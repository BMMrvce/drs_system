import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lightbulb, Video, Gauge, Wifi, Save } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function SettingsScreen() {
  const navigate = useNavigate();
  const { settings, updateSettings } = useApp();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    updateSettings(localSettings);
    alert('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
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
            <div className="p-3 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl">
              <Gauge className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Settings</h1>
              <p className="text-gray-400 mt-1">Configure system preferences and recording options</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* LED Settings */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              LED Settings
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-3">
                  Brightness ({localSettings.led.brightness}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localSettings.led.brightness}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      led: { ...localSettings.led, brightness: parseInt(e.target.value) }
                    })
                  }
                  className="w-full h-3 bg-gray-800 rounded-lg appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-yellow-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Color Mode</label>
                <select
                  value={localSettings.led.colorMode}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      led: { ...localSettings.led, colorMode: e.target.value }
                    })
                  }
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                >
                  <option value="auto">Auto</option>
                  <option value="red">Red</option>
                  <option value="green">Green</option>
                  <option value="blue">Blue</option>
                  <option value="white">White</option>
                  <option value="rainbow">Rainbow</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Flash Duration (ms)</label>
                  <input
                    type="number"
                    value={localSettings.led.flashDuration}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        led: { ...localSettings.led, flashDuration: parseInt(e.target.value) }
                      })
                    }
                    min="100"
                    max="5000"
                    step="100"
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Blink Pattern</label>
                  <select
                    value={localSettings.led.blinkPattern}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        led: { ...localSettings.led, blinkPattern: e.target.value }
                      })
                    }
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  >
                    <option value="standard">Standard</option>
                    <option value="fast">Fast Blink</option>
                    <option value="pulse">Pulse</option>
                    <option value="strobe">Strobe</option>
                    <option value="fade">Fade In/Out</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Recording Settings */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Video className="w-5 h-5 text-red-500" />
              Recording Settings
            </h2>
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Resolution</label>
                  <select
                    value={localSettings.recording.resolution}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        recording: { ...localSettings.recording, resolution: e.target.value }
                      })
                    }
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  >
                    <option value="3840x2160">4K Ultra HD (3840×2160)</option>
                    <option value="1920x1080">Full HD (1920×1080)</option>
                    <option value="1280x720">HD (1280×720)</option>
                    <option value="854x480">SD (854×480)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">FPS (Frames Per Second)</label>
                  <select
                    value={localSettings.recording.fps}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        recording: { ...localSettings.recording, fps: parseInt(e.target.value) }
                      })
                    }
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  >
                    <option value="30">30 FPS</option>
                    <option value="60">60 FPS</option>
                    <option value="120">120 FPS (High Speed)</option>
                    <option value="240">240 FPS (Ultra High Speed)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Bitrate (kbps)</label>
                  <input
                    type="number"
                    value={localSettings.recording.bitrate}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        recording: { ...localSettings.recording, bitrate: parseInt(e.target.value) }
                      })
                    }
                    min="5000"
                    max="50000"
                    step="1000"
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Compression Quality</label>
                  <select
                    value={localSettings.recording.compressionQuality}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        recording: { ...localSettings.recording, compressionQuality: e.target.value }
                      })
                    }
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  >
                    <option value="low">Low (Save Storage)</option>
                    <option value="medium">Medium (Balanced)</option>
                    <option value="high">High (Best Quality)</option>
                    <option value="lossless">Lossless (Max Quality)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Storage Path</label>
                <input
                  type="text"
                  value={localSettings.recording.storagePath}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      recording: { ...localSettings.recording, storagePath: e.target.value }
                    })
                  }
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Default location for saving match recordings
                </p>
              </div>
            </div>
          </div>

          {/* Replay Settings */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-blue-500" />
              Replay Settings
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Slow Motion Speed</label>
                <select
                  value={localSettings.replay.slowMotionSpeed}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      replay: { ...localSettings.replay, slowMotionSpeed: parseFloat(e.target.value) }
                    })
                  }
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                >
                  <option value="0.125">1/8x Speed (Ultra Slow)</option>
                  <option value="0.25">1/4x Speed (Super Slow)</option>
                  <option value="0.5">1/2x Speed (Slow)</option>
                  <option value="0.75">3/4x Speed</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Default Replay Duration (seconds)
                  </label>
                  <input
                    type="number"
                    value={localSettings.replay.defaultDuration}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        replay: { ...localSettings.replay, defaultDuration: parseInt(e.target.value) }
                      })
                    }
                    min="10"
                    max="120"
                    step="5"
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Buffer Size (seconds)
                  </label>
                  <input
                    type="number"
                    value={localSettings.replay.bufferSize}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        replay: { ...localSettings.replay, bufferSize: parseInt(e.target.value) }
                      })
                    }
                    min="30"
                    max="300"
                    step="30"
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Circular buffer for instant replay
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Network Settings */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Wifi className="w-5 h-5 text-green-500" />
              Network Settings
            </h2>
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2">MQTT Broker URL</label>
                  <input
                    type="text"
                    value={localSettings.mqtt.brokerUrl}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        mqtt: { ...localSettings.mqtt, brokerUrl: e.target.value }
                      })
                    }
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">MQTT Port</label>
                  <input
                    type="number"
                    value={localSettings.mqtt.port}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        mqtt: { ...localSettings.mqtt, port: parseInt(e.target.value) }
                      })
                    }
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Discovery Timeout (ms)
                  </label>
                  <input
                    type="number"
                    value={localSettings.mqtt.discoveryTimeout}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        mqtt: { ...localSettings.mqtt, discoveryTimeout: parseInt(e.target.value) }
                      })
                    }
                    min="1000"
                    max="30000"
                    step="1000"
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Retry Interval (ms)
                  </label>
                  <input
                    type="number"
                    value={localSettings.mqtt.retryInterval}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        mqtt: { ...localSettings.mqtt, retryInterval: parseInt(e.target.value) }
                      })
                    }
                    min="1000"
                    max="10000"
                    step="1000"
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-4 pt-2">
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-800 hover:bg-gray-700 px-6 py-4 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
