import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Save } from 'lucide-react';

export function AddMatchScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    matchTitle: '',
    teamA: '',
    teamB: '',
    venue: '',
    overs: '20',
    matchOfficials: '',
    cameraSelection: 'main-camera',
    recordingQuality: '1080p'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleStartMatch = () => {
    const newMatchId = `match-${Date.now()}`;
    navigate(`/live/${newMatchId}`);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          <h1 className="text-4xl font-bold mb-2">Create New Match</h1>
          <p className="text-gray-400">Set up a new cricket match recording session</p>
        </div>

        {/* Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <div className="space-y-6">
            {/* Match Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Match Title *</label>
              <input
                type="text"
                name="matchTitle"
                value={formData.matchTitle}
                onChange={handleChange}
                placeholder="e.g., IPL 2026 - Final"
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Teams */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Team A *</label>
                <input
                  type="text"
                  name="teamA"
                  value={formData.teamA}
                  onChange={handleChange}
                  placeholder="e.g., Mumbai Indians"
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Team B *</label>
                <input
                  type="text"
                  name="teamB"
                  value={formData.teamB}
                  onChange={handleChange}
                  placeholder="e.g., Chennai Super Kings"
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Venue */}
            <div>
              <label className="block text-sm font-medium mb-2">Venue *</label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="e.g., Wankhede Stadium"
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Overs Format */}
            <div>
              <label className="block text-sm font-medium mb-2">Overs Format</label>
              <select
                name="overs"
                value={formData.overs}
                onChange={handleChange}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              >
                <option value="20">T20 (20 Overs)</option>
                <option value="50">ODI (50 Overs)</option>
                <option value="90">Test Match (90 Overs/Day)</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {/* Match Officials */}
            <div>
              <label className="block text-sm font-medium mb-2">Match Officials</label>
              <input
                type="text"
                name="matchOfficials"
                value={formData.matchOfficials}
                onChange={handleChange}
                placeholder="e.g., Umpire: Kumar Dharmasena"
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Camera Selection */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Camera Selection
              </label>
              <select
                name="cameraSelection"
                value={formData.cameraSelection}
                onChange={handleChange}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              >
                <option value="main-camera">Main Camera (120 FPS)</option>
                <option value="stump-camera">Stump Camera (240 FPS)</option>
                <option value="multi-camera">Multi-Camera Setup</option>
              </select>
            </div>

            {/* Recording Quality */}
            <div>
              <label className="block text-sm font-medium mb-2">Recording Quality</label>
              <select
                name="recordingQuality"
                value={formData.recordingQuality}
                onChange={handleChange}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              >
                <option value="4k">4K Ultra HD (3840x2160)</option>
                <option value="1080p">Full HD (1920x1080)</option>
                <option value="720p">HD (1280x720)</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-800">
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleStartMatch}
              disabled={!formData.matchTitle || !formData.teamA || !formData.teamB || !formData.venue}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Start Match Recording
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
