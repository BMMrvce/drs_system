import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Wifi,
  WifiOff,
  Battery,
  Radio,
  Settings,
  Trash2,
  RefreshCw,
  Router,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export function DeviceManagementScreen() {
  const navigate = useNavigate();
  const { devices, settings } = useApp();
  const [scanning, setScanning] = useState(false);
  const [mqttConfig, setMqttConfig] = useState(settings.mqtt);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
    }, 2500);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'stump':
        return '🏏';
      case 'bail':
        return '🔴';
      case 'camera':
        return '📹';
      case 'led':
        return '💡';
      case 'sensor':
        return '📡';
      default:
        return '•';
    }
  };

  const getDeviceTypeLabel = (type: string) => {
    switch (type) {
      case 'stump':
        return 'Smart Stump';
      case 'bail':
        return 'Bail Sensor';
      case 'camera':
        return 'Camera';
      case 'led':
        return 'LED Controller';
      case 'sensor':
        return 'Motion Sensor';
      default:
        return type;
    }
  };

  const onlineDevices = devices.filter(d => d.online);
  const offlineDevices = devices.filter(d => !d.online);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-green-600 to-green-700 rounded-xl">
              <Radio className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Device Management</h1>
              <p className="text-gray-400 mt-1">Manage connected hardware devices and sensors</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>{onlineDevices.length} Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>{offlineDevices.length} Offline</span>
            </div>
            <div className="text-gray-500">
              Total: {devices.length} devices
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={handleScan}
            disabled={scanning}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 px-6 py-3 rounded-lg transition-colors font-medium"
          >
            <RefreshCw className={`w-5 h-5 ${scanning ? 'animate-spin' : ''}`} />
            {scanning ? 'Scanning Network...' : 'Scan Network'}
          </button>

          <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg transition-colors font-medium">
            <Plus className="w-5 h-5" />
            Add Device Manually
          </button>
        </div>

        {/* Device Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {devices.map(device => (
            <div
              key={device.id}
              className={`border rounded-xl p-6 transition-all ${
                device.online
                  ? 'bg-gray-900 border-gray-800 hover:border-green-500/50'
                  : 'bg-red-950/20 border-red-900/30'
              }`}
            >
              {/* Device Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3">
                  <span className="text-4xl">{getDeviceIcon(device.type)}</span>
                  <div>
                    <h3 className="font-semibold">{device.name}</h3>
                    <p className="text-sm text-gray-400">{getDeviceTypeLabel(device.type)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {device.online ? (
                    <div className="flex items-center gap-1 text-green-400">
                      <Wifi className="w-5 h-5" />
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-400">
                      <WifiOff className="w-5 h-5" />
                      <XCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>

              {/* Device Info */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">IP Address</span>
                  <span className="font-mono text-xs">{device.ipAddress}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">MQTT Topic</span>
                  <span className="font-mono text-xs truncate max-w-[150px]" title={device.mqttTopic}>
                    {device.mqttTopic}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Firmware</span>
                  <span className="font-mono text-xs">{device.firmwareVersion}</span>
                </div>

                {device.capabilities && device.capabilities.length > 0 && (
                  <div className="pt-2 border-t border-gray-800">
                    <div className="text-xs text-gray-400 mb-2">Capabilities</div>
                    <div className="flex flex-wrap gap-1">
                      {device.capabilities.map(cap => (
                        <span
                          key={cap}
                          className="px-2 py-0.5 bg-blue-600/20 text-blue-400 text-xs rounded-full border border-blue-500/30"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {device.batteryLevel !== undefined && (
                  <div className="pt-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400 flex items-center gap-1">
                        <Battery className="w-4 h-4" />
                        Battery
                      </span>
                      <span className={`font-semibold ${
                        device.batteryLevel > 50 ? 'text-green-400' :
                        device.batteryLevel > 20 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {device.batteryLevel}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          device.batteryLevel > 50 ? 'bg-green-500' :
                          device.batteryLevel > 20 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${device.batteryLevel}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {device.signalStrength !== undefined && (
                  <div className="pt-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400 flex items-center gap-1">
                        <Radio className="w-4 h-4" />
                        Signal
                      </span>
                      <span className="font-semibold text-blue-400">
                        {device.signalStrength}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${device.signalStrength}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {device.lastHeartbeat && (
                  <div className="text-xs text-gray-500 pt-2">
                    Last seen: {new Date(device.lastHeartbeat).toLocaleTimeString()}
                  </div>
                )}
              </div>

              {/* Status & Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  device.online
                    ? 'bg-green-600/20 text-green-400 border-green-500/30'
                    : 'bg-red-600/20 text-red-400 border-red-500/30'
                }`}>
                  {device.online ? 'ONLINE' : 'OFFLINE'}
                </span>

                <div className="flex gap-2">
                  <button
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    title="Configure Device"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 hover:bg-red-900/20 text-red-400 rounded-lg transition-colors"
                    title="Remove Device"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MQTT Configuration */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Router className="w-5 h-5 text-purple-500" />
            MQTT Broker Configuration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Broker URL</label>
              <input
                type="text"
                value={mqttConfig.brokerUrl}
                onChange={(e) => setMqttConfig({ ...mqttConfig, brokerUrl: e.target.value })}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Port</label>
              <input
                type="number"
                value={mqttConfig.port}
                onChange={(e) => setMqttConfig({ ...mqttConfig, port: parseInt(e.target.value) })}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Username (Optional)</label>
              <input
                type="text"
                value={mqttConfig.username || ''}
                onChange={(e) => setMqttConfig({ ...mqttConfig, username: e.target.value })}
                placeholder="mqtt_user"
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password (Optional)</label>
              <input
                type="password"
                value={mqttConfig.password || ''}
                onChange={(e) => setMqttConfig({ ...mqttConfig, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Discovery Timeout (ms)</label>
              <input
                type="number"
                value={mqttConfig.discoveryTimeout}
                onChange={(e) => setMqttConfig({ ...mqttConfig, discoveryTimeout: parseInt(e.target.value) })}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Retry Interval (ms)</label>
              <input
                type="number"
                value={mqttConfig.retryInterval}
                onChange={(e) => setMqttConfig({ ...mqttConfig, retryInterval: parseInt(e.target.value) })}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors font-medium">
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
