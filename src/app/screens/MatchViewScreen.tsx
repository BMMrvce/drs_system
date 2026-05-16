import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Maximize,
  Bookmark,
  Gauge,
  ZoomIn,
  ZoomOut,
  Rewind,
  FastForward,
  Download
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ExportDialog } from '../components/ExportDialog';

export function MatchViewScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMatchById, getEventsByMatchId } = useApp();

  const match = getMatchById(id!);
  const events = getEventsByMatchId(id!);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [timelineZoom, setTimelineZoom] = useState(1);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const duration = match?.duration || 0;
  const speedOptions = [0.25, 0.5, 0.75, 1, 1.5, 2];

  useEffect(() => {
    if (playing) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + playbackSpeed;
          if (next >= duration) {
            setPlaying(false);
            return duration;
          }
          return next;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [playing, playbackSpeed, duration]);

  if (!match) {
    navigate('/');
    return null;
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(parseInt(e.target.value));
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleSkipBack = () => {
    setCurrentTime(prev => Math.max(0, prev - 10));
  };

  const handleSkipForward = () => {
    setCurrentTime(prev => Math.min(duration, prev + 10));
  };

  const handleFrameStep = (direction: 'forward' | 'backward') => {
    const frameTime = 1 / (match.recordingQuality === '240fps' ? 240 : 120);
    setCurrentTime(prev => {
      if (direction === 'forward') {
        return Math.min(duration, prev + frameTime);
      } else {
        return Math.max(0, prev - frameTime);
      }
    });
  };

  const handleEventClick = (eventId: string, timestamp: number) => {
    const eventTime = (Date.now() - timestamp) / 1000;
    const seekTime = Math.max(0, duration - eventTime);
    setCurrentTime(seekTime);
    setSelectedEvent(eventId);
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case 'wicket':
        return 'border-red-500 bg-red-900/20';
      case 'bail_dislodged':
        return 'border-orange-500 bg-orange-900/20';
      case 'stump_motion':
        return 'border-yellow-500 bg-yellow-900/20';
      case 'motion_alert':
        return 'border-blue-500 bg-blue-900/20';
      default:
        return 'border-gray-500 bg-gray-900/20';
    }
  };

  const getEventMarkerColor = (eventType: string) => {
    switch (eventType) {
      case 'wicket':
        return 'bg-red-500';
      case 'bail_dislodged':
        return 'bg-orange-500';
      case 'stump_motion':
        return 'bg-yellow-500';
      case 'motion_alert':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const selectedEventData = events.find(e => e.id === selectedEvent);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        matchId={match.id}
        matchName={match.name}
        events={events}
      />
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">Match Replay</h1>
              <p className="text-gray-400">{match.name}</p>
              <p className="text-gray-500 text-sm">{match.teamA} vs {match.teamB} • {match.venue}</p>
            </div>
            <button
              onClick={() => setShowExportDialog(true)}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors flex items-center gap-2 font-medium"
            >
              <Download className="w-5 h-5" />
              Export Replay
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-6">
          <div className="relative aspect-video bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 flex items-center justify-center">
            <div className="text-center z-10">
              <div className="text-9xl mb-4">🏏</div>
              <div className="text-3xl font-mono font-bold mb-2">{formatTime(currentTime)}</div>
              <div className="text-gray-400">
                {playing ? 'Playing' : 'Paused'} • {playbackSpeed}x Speed
              </div>
              {selectedEventData && (
                <div className="mt-4 px-4 py-2 bg-blue-600 rounded-lg inline-block">
                  <div className="text-sm font-medium">
                    {selectedEventData.eventType.replace(/_/g, ' ').toUpperCase()}
                  </div>
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors">
              <Maximize className="w-5 h-5" />
            </button>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent pointer-events-none"></div>
          </div>

          {/* Controls */}
          <div className="p-6 bg-gray-950">
            {/* Timeline */}
            <div className="relative mb-6">
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-3 bg-gray-800 rounded-lg appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500
                [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
              />

              {/* Event Markers */}
              <div className="absolute top-0 left-0 right-0 h-3 pointer-events-none">
                {events.map((event) => {
                  const eventTimeInSeconds = duration - (Date.now() - event.timestamp) / 1000;
                  const position = (eventTimeInSeconds / duration) * 100;
                  if (position < 0 || position > 100) return null;
                  return (
                    <div
                      key={event.id}
                      className={`absolute w-1.5 h-5 -mt-1 ${getEventMarkerColor(event.eventType)} cursor-pointer`}
                      style={{ left: `${position}%` }}
                      title={event.eventType}
                      onClick={() => handleEventClick(event.id, event.timestamp)}
                    />
                  );
                })}
              </div>
            </div>

            {/* Time Display */}
            <div className="flex justify-between text-sm text-gray-400 mb-6">
              <span className="font-mono">{formatTime(currentTime)}</span>
              <span className="font-mono">{formatTime(duration)}</span>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <button
                onClick={() => handleFrameStep('backward')}
                className="p-3 hover:bg-gray-800 rounded-lg transition-colors"
                title="Step Back 1 Frame"
              >
                <Rewind className="w-5 h-5" />
              </button>

              <button
                onClick={handleSkipBack}
                className="p-3 hover:bg-gray-800 rounded-lg transition-colors"
                title="Skip Back 10s"
              >
                <SkipBack className="w-6 h-6" />
              </button>

              <button
                onClick={handlePlayPause}
                className="p-5 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
              >
                {playing ? (
                  <Pause className="w-7 h-7" />
                ) : (
                  <Play className="w-7 h-7" />
                )}
              </button>

              <button
                onClick={handleSkipForward}
                className="p-3 hover:bg-gray-800 rounded-lg transition-colors"
                title="Skip Forward 10s"
              >
                <SkipForward className="w-6 h-6" />
              </button>

              <button
                onClick={() => handleFrameStep('forward')}
                className="p-3 hover:bg-gray-800 rounded-lg transition-colors"
                title="Step Forward 1 Frame"
              >
                <FastForward className="w-5 h-5" />
              </button>
            </div>

            {/* Additional Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-gray-400" />
                  <select
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  >
                    {speedOptions.map(speed => (
                      <option key={speed} value={speed}>
                        {speed}x
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => setTimelineZoom(Math.max(0.5, timelineZoom - 0.5))}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    title="Zoom Out Timeline"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-400 min-w-[60px] text-center">
                    Zoom {timelineZoom}x
                  </span>
                  <button
                    onClick={() => setTimelineZoom(Math.min(5, timelineZoom + 0.5))}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    title="Zoom In Timeline"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-400">
                {events.length} event{events.length !== 1 ? 's' : ''} • {match.recordingQuality}
              </div>
            </div>
          </div>
        </div>

        {/* Events and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Event Bookmarks */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-blue-500" />
                Event Bookmarks
              </h2>
              {events.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No events recorded for this match</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {events.map(event => {
                    const eventTimeInSeconds = duration - (Date.now() - event.timestamp) / 1000;
                    return (
                      <div
                        key={event.id}
                        onClick={() => handleEventClick(event.id, event.timestamp)}
                        className={`p-4 rounded-lg cursor-pointer hover:bg-gray-800 transition-all border-l-4 ${
                          selectedEvent === event.id
                            ? 'border-blue-500 bg-gray-800'
                            : getEventTypeColor(event.eventType)
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-semibold capitalize mb-1">
                              {event.eventType.replace(/_/g, ' ')}
                            </div>
                            <div className="text-sm text-gray-400">
                              Sensor: {event.sensorId}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Confidence: {(event.confidence * 100).toFixed(0)}%
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-mono text-gray-400">
                              {formatTime(Math.max(0, eventTimeInSeconds))}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {event.replayOffset && `${event.replayOffset}s offset`}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Event Details */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Event Details</h2>
            {selectedEventData ? (
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Event Type</div>
                  <div className="capitalize font-semibold">
                    {selectedEventData.eventType.replace(/_/g, ' ')}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Sensor ID</div>
                  <div className="font-mono text-sm bg-gray-950 px-3 py-2 rounded">
                    {selectedEventData.sensorId}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Timestamp</div>
                  <div className="font-mono text-sm bg-gray-950 px-3 py-2 rounded">
                    {new Date(selectedEventData.timestamp).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-2">Confidence</div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-800 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          selectedEventData.confidence > 0.9 ? 'bg-green-500' :
                          selectedEventData.confidence > 0.7 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${selectedEventData.confidence * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold">
                      {(selectedEventData.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                {selectedEventData.metadata && (
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Metadata</div>
                    <div className="bg-gray-950 px-3 py-2 rounded">
                      <pre className="text-xs text-gray-300">
                        {JSON.stringify(selectedEventData.metadata, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p className="text-sm">Select an event to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
