import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Maximize,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Gauge
} from 'lucide-react';
import { SensorEvent } from '../types';
import { useApp } from '../context/AppContext';

export function MatchViewScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const { events } = useApp();
  const [selectedEvent, setSelectedEvent] = useState<SensorEvent | null>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  const duration = 7200; // 2 hours in seconds
  const speedOptions = [0.25, 0.5, 1, 1.5, 2];

  useEffect(() => {
    if (playing) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + playbackSpeed;
          return next >= duration ? duration : next;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [playing, playbackSpeed, duration]);

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

  const handleEventClick = (event: SensorEvent) => {
    const eventTimeInSeconds = Math.floor((Date.now() - event.timestamp) / 1000);
    setCurrentTime(duration - eventTimeInSeconds);
    setSelectedEvent(event);
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case 'wicket':
        return 'bg-red-500';
      case 'bail_removed':
        return 'bg-orange-500';
      case 'motion_alert':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          <h1 className="text-4xl font-bold mb-2">Match Replay</h1>
          <p className="text-gray-400">IPL 2026 - Final • Mumbai Indians vs Chennai Super Kings</p>
        </div>

        {/* Video Player */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-6">
          <div
            ref={videoRef}
            className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="text-8xl mb-4">🏏</div>
              <div className="text-2xl font-mono">{formatTime(currentTime)}</div>
              <div className="text-gray-400 mt-2">
                {playing ? 'Playing' : 'Paused'} • {playbackSpeed}x Speed
              </div>
            </div>

            {/* Fullscreen Button */}
            <button className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors">
              <Maximize className="w-5 h-5" />
            </button>
          </div>

          {/* Timeline */}
          <div className="p-6 bg-gray-950">
            {/* Timeline Scrubber */}
            <div className="relative mb-4">
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
              />

              {/* Event Markers */}
              <div className="absolute top-0 left-0 right-0 h-2 pointer-events-none">
                {events.map((event, index) => {
                  const eventTimeInSeconds = duration - Math.floor((Date.now() - event.timestamp) / 1000);
                  const position = (eventTimeInSeconds / duration) * 100;
                  return (
                    <div
                      key={event.id}
                      className={`absolute w-1 h-4 -mt-1 ${getEventTypeColor(event.eventType)}`}
                      style={{ left: `${position}%` }}
                      title={event.eventType}
                    />
                  );
                })}
              </div>
            </div>

            {/* Time Display */}
            <div className="flex justify-between text-sm text-gray-400 mb-4">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleSkipBack}
                className="p-3 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <SkipBack className="w-6 h-6" />
              </button>

              <button
                onClick={handlePlayPause}
                className="p-4 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
              >
                {playing ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>

              <button
                onClick={handleSkipForward}
                className="p-3 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <SkipForward className="w-6 h-6" />
              </button>

              {/* Speed Control */}
              <div className="ml-4 flex items-center gap-2">
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
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Bookmark className="w-5 h-5" />
                Event Bookmarks
              </h2>
              <div className="space-y-3">
                {events.map(event => (
                  <div
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    className={`p-4 bg-gray-950 rounded-lg cursor-pointer hover:bg-gray-900 transition-colors border-l-4 ${
                      selectedEvent?.id === event.id ? 'border-blue-500' : getEventTypeColor(event.eventType)
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium capitalize">
                          {event.eventType.replace('_', ' ')}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          Sensor: {event.sensorId}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Confidence: {(event.confidence * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        {formatTime(duration - Math.floor((Date.now() - event.timestamp) / 1000))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Event Details</h2>
            {selectedEvent ? (
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Event Type</div>
                  <div className="capitalize">{selectedEvent.eventType.replace('_', ' ')}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Sensor ID</div>
                  <div className="font-mono text-sm">{selectedEvent.sensorId}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Timestamp</div>
                  <div className="font-mono text-sm">
                    {new Date(selectedEvent.timestamp).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Confidence</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${selectedEvent.confidence * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{(selectedEvent.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-center py-8">
                Select an event to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
