import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lightbulb, Video, Gauge, Wifi } from 'lucide-react';

export function SettingsScreen() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    ledBrightness: 75,
    ledColorMode: 'auto',
    flashDuration: 500,
    blinkPattern: 'standard',
    resolution: '1080p',
    fps: 120,
    compressionQuality: 'high',
    storagePath: '/media/recordings',
    slowMotionFactor: 0.25,
    defaultReplayDuration: 30,
    bufferSize: 60,
    mqttBroker: 'mqtt://192.168.1.1:1883',
    mqttPort: 1883
  });

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
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
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-gray-400">Configure system preferences and recording options</p>
        </div>

        <div className="space-y-6">
          {/* LED Settings */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              LED Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Brightness ({settings.ledBrightness}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.ledBrightness}
                  onChange={(e) => handleChange('ledBrightness', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Color Mode</label>
                <select
                  value={settings.ledColorMode}
                  onChange={(e) => handleChange('ledColorMode', e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                >
                  <option value="auto">Auto</option>
                  <option value="red">Red</option>
                  <option value="green">Green</option>
                  <option value="blue">Blue</option>
                  <option value="white">White</option>
                  <option value="rainbow">Rainbow</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Flash Duration (ms)</label>
                <input
                  type="number"
                  value={settings.flashDuration}
                  onChange={(e) => handleChange('flashDuration', parseInt(e.target.value))}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Blink Pattern</label>
                <select
                  value={settings.blinkPattern}
                  onChange={(e) => handleChange('blinkPattern', e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                >
                  <option value="standard">Standard</option>
                  <option value="fast">Fast</option>
                  <option value="pulse">Pulse</option>
                  <option value="strobe">Strobe</option>
                </select>
              </div>
            </div>
          </div>

          {/* Recording Settings */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Video className="w-5 h-5 text-red-500" />
              Recording Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Resolution</label>
                <select
                  value={settings.resolution}
                  onChange={(e) => handleChange('resolution', e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                >
                  <option value="4k">4K Ultra HD (3840x2160)</option>
                  <option value="1080p">Full HD (1920x1080)</option>
                  <option value="720p">HD (1280x720)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">FPS</label>
                <select
                  value={settings.fps}
                  onChange={(e) => handleChange('fps', parseInt(e.target.value))}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                >
                  <option value="30">30 FPS</option>
                  <option value="60">60 FPS</option>
                  <option value="120">120 FPS</option>
                  <option value="240">240 FPS</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Compression Quality</label>
                <select
                  value={settings.compressionQuality}
                  onChange={(e) => handleChange('compressionQuality', e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                >
                  <option value="low">Low (Save Storage)</option>
                  <option value="medium">Medium (Balanced)</option>
                  <option value="high">High (Best Quality)</option>
                  <option value="lossless">Lossless</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Storage Path</label>
                <input
                  type="text"
                  value={settings.storagePath}
                  onChange={(e) => handleChange('storagePath', e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Replay Settings */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-blue-500" />
              Replay Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Slow Motion Factor</label>
                <select
                  value={settings.slowMotionFactor}
                  onChange={(e) => handleChange('slowMotionFactor', parseFloat(e.target.value))}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                >
                  <option value="0.125">1/8x Speed</option>
                  <option value="0.25">1/4x Speed</option>
                  <option value="0.5">1/2x Speed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Default Replay Duration (seconds)</label>
                <input
                  type="number"
                  value={settings.defaultReplayDuration}
                  onChange={(e) => handleChange('defaultReplayDuration', parseInt(e.target.value))}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Buffer Size (seconds)</label>
                <input
                  type="number"
                  value={settings.bufferSize}
                  onChange={(e) => handleChange('bufferSize', parseInt(e.target.value))}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Network Settings */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Wifi className="w-5 h-5 text-green-500" />
              Network Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">MQTT Broker</label>
                <input
                  type="text"
                  value={settings.mqttBroker}
                  onChange={(e) => handleChange('mqttBroker', e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">MQTT Port</label>
                <input
                  type="number"
                  value={settings.mqttPort}
                  onChange={(e) => handleChange('mqttPort', parseInt(e.target.value))}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
