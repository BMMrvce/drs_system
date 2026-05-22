import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Circle,
  Square,
  Cpu,
  HardDrive,
  Wifi,
  WifiOff,
  Battery,
  Radio,
  Camera,
  AlertCircle,
  CheckCircle,
  Bell,
  Activity,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import CircularRecorder from '../services/recorder';
import { useRealtimeEvents } from '../hooks/useRealtimeEvents';
import { SensorEvent } from '../types/index';
import { NotificationToast, useToast } from '../components/NotificationToast';
import { MatchStatistics } from '../components/MatchStatistics';

export function LiveMatchScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMatchById, updateMatch, devices, cameras, getEventsByMatchId, systemStatus, updateSystemStatus, addEvent } = useApp();

  const match = getMatchById(id!);
  const matchEvents = getEventsByMatchId(id!);

  const [duration, setDuration] = useState(0);
  const [recording, setRecording] = useState(true);
  const [localEvents, setLocalEvents] = useState<SensorEvent[]>(matchEvents);
  const { toasts, dismissToast, showEvent } = useToast();

  // Camera local state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<CircularRecorder | null>(null);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);


  // Sync local events with context events
  useEffect(() => {
    setLocalEvents(matchEvents);
  }, [matchEvents]);

  // Handle new real-time events
  const handleNewEvent = useCallback((event: SensorEvent) => {
    addEvent(event);
    setLocalEvents(prev => [event, ...prev]);

    // Show notification for the event
    const eventName = event.eventType.replace(/_/g, ' ').toUpperCase();
    showEvent(`🎯 ${eventName} DETECTED! (${(event.confidence * 100).toFixed(0)}% confidence)`, event.eventType);
  }, [addEvent, showEvent]);

  // Use real-time event simulation
  useRealtimeEvents({
    matchId: id!,
    isLive: recording,
    onEvent: handleNewEvent
  });

  // Camera helpers: request permission, enumerate devices, start/stop stream
  async function enumerateVideoDevices() {
    try {
      const list = await navigator.mediaDevices.enumerateDevices();
      setVideoDevices(list.filter(d => d.kind === 'videoinput'));
    } catch (e) {
      console.warn('enumerateDevices failed', e);
    }
  }

  async function startCamera(deviceId?: string | null) {
    try {
      // Ask for permission with a minimal getUserMedia call first to ensure labels appear
      const baseConstraints: MediaStreamConstraints = { video: { width: 1280, height: 720 }, audio: false };
      const constraints = deviceId ? { video: { deviceId: { exact: deviceId }, width: 1280, height: 720 }, audio: false } : baseConstraints;
      const s = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = s;
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        // Some browsers require play() after attaching srcObject
        try { await videoRef.current.play(); } catch (e) { /* ignore */ }
      }
      setCameraError(null);
      // Start/replace circular recorder
      try { recorderRef.current?.stop(); } catch {}
      try {
        recorderRef.current = new CircularRecorder(60, 1000);
        recorderRef.current.start(s, 'video/webm;codecs=vp9');
      } catch (e) {
        console.warn('Recorder start failed', e);
      }

      // Refresh device list (labels available after permission)
      await enumerateVideoDevices();
      if (!selectedDeviceId) {
        const preferred = videoDevices[0] || null;
        if (preferred) setSelectedDeviceId(preferred.deviceId);
      }
    } catch (err: any) {
      console.warn('Camera start failed', err);
      setCameraError(err?.message || String(err));
    }
  }

  useEffect(() => {
    // enumerate devices on mount
    enumerateVideoDevices();
    // Listen for device changes (plug/unplug)
    const handler = () => enumerateVideoDevices();
    navigator.mediaDevices?.addEventListener?.('devicechange', handler);
    return () => {
      navigator.mediaDevices?.removeEventListener?.('devicechange', handler);
    };
  }, []);

  // start camera when user picks a device (or when selectedDeviceId becomes set)
  useEffect(() => {
    if (selectedDeviceId === null) return;
    startCamera(selectedDeviceId);
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      try { recorderRef.current?.stop(); } catch {}
    };
  }, [selectedDeviceId]);

  useEffect(() => {
    if (!match) {
      navigate('/');
      return;
    }

    // Update match as live and recording
    updateMatch(id!, { status: 'live' });
    updateSystemStatus({ recording: true });

    // Simulate duration timer
    const timer = setInterval(() => {
      setDuration(prev => prev + 1);
      updateMatch(id!, { duration: duration + 1 });
    }, 1000);

    // Simulate system metrics changes
    const metricsTimer = setInterval(() => {
      updateSystemStatus({
        cpuUsage: 30 + Math.random() * 30,
        gpuUsage: 40 + Math.random() * 40,
        droppedFrames: Math.floor(Math.random() * 10)
      });
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(metricsTimer);
    };
  }, [id, duration]);

  if (!match) {
    return null;
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatEventTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'wicket':
        return <Zap className="w-5 h-5 text-red-500" />;
      case 'bail_dislodged':
        return <Circle className="w-5 h-5 text-orange-500" />;
      case 'stump_motion':
        return <Activity className="w-5 h-5 text-yellow-500" />;
      case 'motion_alert':
        return <Radio className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleEndMatch = () => {
    if (confirm('Are you sure you want to end this match? Recording will stop.')) {
      setRecording(false);
      updateMatch(id!, { status: 'completed', endTime: new Date() });
      updateSystemStatus({ recording: false });
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <NotificationToast toasts={toasts} onDismiss={dismissToast} />
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </button>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              {recording && (
                <Circle className="w-7 h-7 text-red-500 fill-red-500 animate-pulse" />
              )}
              Live Match Recording
            </h1>
            <p className="text-gray-400">{match.name}</p>
            <p className="text-gray-500 text-sm">{match.teamA} vs {match.teamB}</p>
          </div>

          <button
            onClick={handleEndMatch}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition-colors flex items-center gap-2 font-medium"
          >
            <Square className="w-5 h-5" />
            End Match
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left & Center Columns */}
          <div className="xl:col-span-2 space-y-6">
            {/* Match Info */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Match Information</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Recording Duration</div>
                  <div className="text-2xl font-mono font-bold">{formatDuration(duration)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Status</div>
                  <div className="flex items-center gap-2">
                    {recording ? (
                      <span className="flex items-center gap-2 text-red-400 font-semibold">
                        <Circle className="w-3 h-3 fill-red-400 animate-pulse" />
                        Recording
                      </span>
                    ) : (
                      <span className="text-gray-500 font-semibold">Stopped</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Current Innings</div>
                  <div className="text-2xl font-mono font-bold">{match.currentInnings || 1}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Quality</div>
                  <div className="text-lg font-semibold">{match.recordingQuality}</div>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">System Status</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-blue-500" />
                      Storage
                    </span>
                    <span className="font-mono">
                      {systemStatus.storageUsed} / {systemStatus.storageTotal} GB
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all ${
                        (systemStatus.storageUsed / systemStatus.storageTotal) * 100 > 80
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                      }`}
                      style={{ width: `${(systemStatus.storageUsed / systemStatus.storageTotal) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-green-500" />
                      CPU Usage
                    </span>
                    <span className="font-mono">{systemStatus.cpuUsage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2.5">
                    <div
                      className="bg-green-500 h-2.5 rounded-full transition-all"
                      style={{ width: `${systemStatus.cpuUsage}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-purple-500" />
                      GPU Usage
                    </span>
                    <span className="font-mono">{systemStatus.gpuUsage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2.5">
                    <div
                      className="bg-purple-500 h-2.5 rounded-full transition-all"
                      style={{ width: `${systemStatus.gpuUsage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="text-center p-3 bg-gray-950 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">Bitrate</div>
                    <div className="text-lg font-mono font-semibold">{systemStatus.bitrate} kbps</div>
                  </div>
                  <div className="text-center p-3 bg-gray-950 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">FPS</div>
                    <div className="text-lg font-mono font-semibold">{systemStatus.fps}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-950 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">Dropped Frames</div>
                    <div className="text-lg font-mono font-semibold">{systemStatus.droppedFrames}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Camera Status */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-500" />
                Camera Monitoring
              </h2>
              <div className="space-y-3">
                <div className="bg-gray-950 rounded-lg p-2">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full rounded bg-black" />
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <label className="text-sm text-gray-400">Camera:</label>
                  <select
                    value={selectedDeviceId || ''}
                    onChange={(e) => setSelectedDeviceId(e.target.value || null)}
                    className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">Default</option>
                    {videoDevices.map(d => (
                      <option key={d.deviceId} value={d.deviceId}>{d.label || d.deviceId}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => startCamera(selectedDeviceId || null)}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                  >
                    Start Camera
                  </button>
                  {cameraError && <div className="text-sm text-red-400">{cameraError}</div>}
                </div>

                {cameras.length === 0 && (
                  <div className="text-sm text-gray-400">No external cameras discovered — using local camera.</div>
                )}

                {cameras.map(camera => (
                  <div
                    key={camera.id}
                    className="flex justify-between items-center p-4 bg-gray-950 rounded-lg border border-gray-800"
                  >
                    <div className="flex-1">
                      <div className="font-semibold mb-1">{camera.name}</div>
                      <div className="text-sm text-gray-400">
                        {camera.fps} FPS • {camera.resolution} • {camera.bitrate} kbps
                      </div>
                      {camera.latency && (
                        <div className="text-xs text-gray-500 mt-1">
                          Latency: {camera.latency}ms
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          camera.health === 'good' ? 'text-green-400' :
                          camera.health === 'fair' ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {camera.health.toUpperCase()}
                        </div>
                        {camera.droppedFrames !== undefined && (
                          <div className="text-xs text-gray-500">
                            {camera.droppedFrames} dropped
                          </div>
                        )}
                      </div>
                      <CheckCircle className={`w-6 h-6 ${
                        camera.health === 'good' ? 'text-green-500' :
                        camera.health === 'fair' ? 'text-yellow-500' :
                        'text-red-500'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Connected Devices */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Radio className="w-5 h-5 text-green-500" />
                Connected Sensors ({devices.filter(d => d.online).length}/{devices.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {devices.map(device => (
                  <div
                    key={device.id}
                    className={`p-4 rounded-lg border ${
                      device.online
                        ? 'bg-gray-950 border-gray-800'
                        : 'bg-red-950/20 border-red-900/30'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{device.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{device.ipAddress}</div>
                      </div>
                      {device.online ? (
                        <Wifi className="w-4 h-4 text-green-500" />
                      ) : (
                        <WifiOff className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex gap-3 text-xs text-gray-400">
                      {device.batteryLevel !== undefined && (
                        <span className="flex items-center gap-1">
                          <Battery className={`w-3 h-3 ${
                            device.batteryLevel > 50 ? 'text-green-500' :
                            device.batteryLevel > 20 ? 'text-yellow-500' :
                            'text-red-500'
                          }`} />
                          {device.batteryLevel}%
                        </span>
                      )}
                      {device.signalStrength !== undefined && (
                        <span className="flex items-center gap-1">
                          <Radio className="w-3 h-3" />
                          {device.signalStrength}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Events Feed & Statistics */}
          <div className="space-y-6">
            {/* Match Statistics */}
            <MatchStatistics events={localEvents} duration={duration} />

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-500" />
                Live Events Feed
              </h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {localEvents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No events detected yet...</p>
                    <p className="text-xs text-gray-600 mt-1">Events will appear automatically</p>
                  </div>
                ) : (
                  localEvents.map(event => (
                    <div
                      key={event.id}
                      className="p-4 bg-gray-950 rounded-lg border-l-4 border-blue-500"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">{getEventIcon(event.eventType)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold capitalize text-sm">
                            {event.eventType.replace(/_/g, ' ')}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Sensor: {event.sensorId}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {formatEventTime(event.timestamp)}
                          </div>
                          <div className="mt-2">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-800 rounded-full h-1.5">
                                <div
                                  className="bg-green-500 h-1.5 rounded-full"
                                  style={{ width: `${event.confidence * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-400">
                                {(event.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* System Notifications */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">System Notifications</h2>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm p-3 bg-green-900/20 text-green-400 rounded-lg border border-green-500/30">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>All systems operational</span>
                </div>
                <div className="flex items-start gap-2 text-sm p-3 bg-blue-900/20 text-blue-400 rounded-lg border border-blue-500/30">
                  <Activity className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Recording in progress - {formatDuration(duration)}</span>
                </div>
                {systemStatus.droppedFrames && systemStatus.droppedFrames > 5 && (
                  <div className="flex items-start gap-2 text-sm p-3 bg-yellow-900/20 text-yellow-400 rounded-lg border border-yellow-500/30">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Warning: {systemStatus.droppedFrames} frames dropped</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
