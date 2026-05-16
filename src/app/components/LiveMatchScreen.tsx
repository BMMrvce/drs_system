import { useState, useEffect } from 'react';
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
  Bell
} from 'lucide-react';
import { Device, Camera as CameraType, SensorEvent, SystemStatus } from '../types';
import { mockDevices, mockCameras, mockEvents } from '../mockData';

export function LiveMatchScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recording, setRecording] = useState(true);
  const [devices] = useState<Device[]>(mockDevices);
  const [cameras] = useState<CameraType[]>(mockCameras);
  const [events, setEvents] = useState<SensorEvent[]>(mockEvents);
  const [duration, setDuration] = useState(0);
  const [systemStatus] = useState<SystemStatus>({
    recording: true,
    storageUsed: 145,
    storageTotal: 500,
    cpuUsage: 42,
    gpuUsage: 68,
    streamHealth: 'good'
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'wicket':
        return '⚡';
      case 'bail_removed':
        return '🔴';
      case 'motion_alert':
        return '📡';
      case 'device_disconnected':
        return '⚠️';
      default:
        return '•';
    }
  };

  const formatEventTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  const handleEndMatch = () => {
    setRecording(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
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
              {recording && <Circle className="w-6 h-6 text-red-500 fill-red-500 animate-pulse" />}
              Live Match Recording
            </h1>
            <p className="text-gray-400">IPL 2026 - Mumbai Indians vs Chennai Super Kings</p>
          </div>

          <button
            onClick={handleEndMatch}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
          >
            <Square className="w-5 h-5" />
            End Match
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - System Status */}
          <div className="lg:col-span-2 space-y-6">
            {/* Match Info */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Match Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Recording Duration</div>
                  <div className="text-2xl font-mono">{formatDuration(duration)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Status</div>
                  <div className="flex items-center gap-2">
                    {recording ? (
                      <span className="flex items-center gap-2 text-red-400">
                        <Circle className="w-3 h-3 fill-red-400 animate-pulse" />
                        Recording
                      </span>
                    ) : (
                      <span className="text-gray-500">Stopped</span>
                    )}
                  </div>
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
                      <HardDrive className="w-4 h-4" />
                      Storage
                    </span>
                    <span>{systemStatus.storageUsed} / {systemStatus.storageTotal} GB</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(systemStatus.storageUsed / systemStatus.storageTotal) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="flex items-center gap-2">
                      <Cpu className="w-4 h-4" />
                      CPU Usage
                    </span>
                    <span>{systemStatus.cpuUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${systemStatus.cpuUsage}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="flex items-center gap-2">
                      <Cpu className="w-4 h-4" />
                      GPU Usage
                    </span>
                    <span>{systemStatus.gpuUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${systemStatus.gpuUsage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Camera Status */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Camera Status
              </h2>
              <div className="space-y-3">
                {cameras.map(camera => (
                  <div key={camera.id} className="flex justify-between items-center p-3 bg-gray-950 rounded-lg">
                    <div>
                      <div className="font-medium">{camera.name}</div>
                      <div className="text-sm text-gray-400">
                        {camera.fps} FPS • {camera.resolution} • {camera.bitrate} kbps
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-green-400">{camera.health}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Connected Devices */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Radio className="w-5 h-5" />
                Connected Sensors
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {devices.map(device => (
                  <div key={device.id} className="p-4 bg-gray-950 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">{device.name}</div>
                        <div className="text-xs text-gray-400">{device.ipAddress}</div>
                      </div>
                      {device.online ? (
                        <Wifi className="w-4 h-4 text-green-500" />
                      ) : (
                        <WifiOff className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex gap-4 text-sm text-gray-400">
                      {device.batteryLevel && (
                        <span className="flex items-center gap-1">
                          <Battery className="w-3 h-3" />
                          {device.batteryLevel}%
                        </span>
                      )}
                      {device.signalStrength && (
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

          {/* Right Column - Events Feed */}
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Recent Events
              </h2>
              <div className="space-y-3">
                {events.map(event => (
                  <div key={event.id} className="p-3 bg-gray-950 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getEventIcon(event.eventType)}</span>
                      <div className="flex-1">
                        <div className="font-medium capitalize">
                          {event.eventType.replace('_', ' ')}
                        </div>
                        <div className="text-sm text-gray-400">
                          Sensor: {event.sensorId}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatEventTime(event.timestamp)}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Confidence: {(event.confidence * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Notifications */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">System Notifications</h2>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm p-2 bg-green-900/20 text-green-400 rounded">
                  <CheckCircle className="w-4 h-4 mt-0.5" />
                  <span>All systems operational</span>
                </div>
                <div className="flex items-start gap-2 text-sm p-2 bg-blue-900/20 text-blue-400 rounded">
                  <AlertCircle className="w-4 h-4 mt-0.5" />
                  <span>Recording in progress</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
