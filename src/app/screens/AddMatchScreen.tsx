import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Camera, Video, Gauge } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Match } from '../types/index';

export function AddMatchScreen() {
  const navigate = useNavigate();
  const { addMatch, cameras } = useApp();

  const [formData, setFormData] = useState({
    matchName: '',
    tournament: '',
    teamA: '',
    teamB: '',
    venue: '',
    overs: '20',
    officials: '',
    cameraSelection: cameras[0]?.id || 'cam-main-1',
    recordingQuality: '1080p',
    replayBufferDuration: '60'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newMatch: Match = {
      id: `match-${Date.now()}`,
      name: formData.matchName,
      tournament: formData.tournament || undefined,
      teamA: formData.teamA,
      teamB: formData.teamB,
      venue: formData.venue,
      status: 'live',
      startTime: new Date(),
      duration: 0,
      overs: parseInt(formData.overs) || undefined,
      officials: formData.officials ? formData.officials.split(',').map(o => o.trim()) : undefined,
      recordingQuality: formData.recordingQuality,
      cameraId: formData.cameraSelection,
      replayBufferDuration: parseInt(formData.replayBufferDuration),
      currentInnings: 1
    };

    addMatch(newMatch);
    navigate(`/live/${newMatch.id}`);
  };

  const isFormValid = formData.matchName && formData.teamA && formData.teamB && formData.venue;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl">
              <Video className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Create New Match</h1>
              <p className="text-gray-400 mt-1">Set up a new cricket match recording session</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Match Information */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
              Match Information
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Match Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="matchName"
                  value={formData.matchName}
                  onChange={handleChange}
                  placeholder="e.g., IPL 2026 Final"
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tournament (Optional)</label>
                <input
                  type="text"
                  name="tournament"
                  value={formData.tournament}
                  onChange={handleChange}
                  placeholder="e.g., Indian Premier League 2026"
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Team A <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="teamA"
                    value={formData.teamA}
                    onChange={handleChange}
                    placeholder="e.g., Mumbai Indians"
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Team B <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="teamB"
                    value={formData.teamB}
                    onChange={handleChange}
                    placeholder="e.g., Chennai Super Kings"
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Venue <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="e.g., Wankhede Stadium, Mumbai"
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Overs Format</label>
                <select
                  name="overs"
                  value={formData.overs}
                  onChange={handleChange}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="20">T20 (20 Overs)</option>
                  <option value="50">ODI (50 Overs)</option>
                  <option value="90">Test Match (90 Overs/Day)</option>
                  <option value="0">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Match Officials (Optional)</label>
                <textarea
                  name="officials"
                  value={formData.officials}
                  onChange={handleChange}
                  placeholder="Enter officials separated by commas&#10;e.g., Umpire: Kumar Dharmasena, Match Referee: Ranjan Madugalle"
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Recording Configuration */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
              Recording Configuration
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Camera Selection
                </label>
                <select
                  name="cameraSelection"
                  value={formData.cameraSelection}
                  onChange={handleChange}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                >
                  {cameras.map(camera => (
                    <option key={camera.id} value={camera.id}>
                      {camera.name} ({camera.fps} FPS, {camera.resolution})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Recording Quality
                </label>
                <select
                  name="recordingQuality"
                  value={formData.recordingQuality}
                  onChange={handleChange}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="4k">4K Ultra HD (3840×2160)</option>
                  <option value="1080p">Full HD (1920×1080)</option>
                  <option value="720p">HD (1280×720)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Gauge className="w-4 h-4" />
                  Replay Buffer Duration (seconds)
                </label>
                <select
                  name="replayBufferDuration"
                  value={formData.replayBufferDuration}
                  onChange={handleChange}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="30">30 seconds</option>
                  <option value="60">60 seconds (Recommended)</option>
                  <option value="90">90 seconds</option>
                  <option value="120">120 seconds</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  Buffer allows instant replay of recent events. Higher values use more memory.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-800 hover:bg-gray-700 px-6 py-4 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed px-6 py-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Start Match Recording
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
