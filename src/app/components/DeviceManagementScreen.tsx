import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Wifi, WifiOff, Battery, Radio, Settings, Trash2, RefreshCw } from 'lucide-react';
import { Device } from '../types';
import { useApp } from '../context/AppContext';

export function DeviceManagementScreen() {
  const navigate = useNavigate();
  const { devices, startDiscovery, stopDiscovery, brokerStatus, brokerUrl, brokerError } = useApp();
  const [scanning, setScanning] = useState(false);
  const [broker, setBroker] = useState('');
  const [port, setPort] = useState(1883);
  const [username, setUsername] = useState('');
  const [discoveryTimeout, setDiscoveryTimeout] = useState(5000);

  const handleScan = () => {
    setScanning(true);
    try {
      const url = broker || `ws://localhost:${port}`;
      startDiscovery(url, { username });
    } catch (e) {
      console.error(e);
    }
    setTimeout(() => {
      setScanning(false);
    }, 2000);
  };

  const handleDisconnect = () => {
    stopDiscovery();
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'stump':
        return '🏏';
      case 'bail':
        return '🔴';
      case 'camera':
        return '📹';
      case 'sensor':
        return '📡';
      default:
        return '•';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          <h1 className="text-4xl font-bold mb-2">Device Management</h1>
          <p className="text-gray-400">Manage connected hardware devices and sensors</p>
        </div>

        {/* Actions Bar */}
          <div className="flex gap-4 mb-8 items-center">
          <button
            onClick={handleScan}
            disabled={scanning}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 px-6 py-3 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${scanning ? 'animate-spin' : ''}`} />
            {scanning ? 'Scanning...' : 'Scan Network'}
          </button>

          {brokerStatus && (
            <div className="ml-4">
              <span className={`px-3 py-1 rounded-full text-sm ${brokerStatus === 'connected' ? 'bg-green-600/20 text-green-400' : brokerStatus === 'connecting' ? 'bg-yellow-600/20 text-yellow-300' : 'bg-red-600/20 text-red-400'}`}>
                {brokerStatus.toUpperCase()}
              </span>
              {brokerUrl && <div className="text-xs text-gray-400 mt-1">{brokerUrl}</div>}
              {brokerError && <div className="text-xs text-red-400 mt-1">{brokerError}</div>}
            </div>
          )}

          <button onClick={handleDisconnect} className="ml-auto flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors">
            Disconnect
          </button>

          <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg transition-colors">
            <Plus className="w-5 h-5" />
            Add Device Manually
          </button>
        </div>

        {/* Device List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map(device => (
            <div key={device.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              {/* Device Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getDeviceIcon(device.type)}</span>
                  <div>
                    <h3 className="font-semibold">{device.name}</h3>
                    <p className="text-sm text-gray-400 capitalize">{device.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {device.online ? (
                    <Wifi className="w-5 h-5 text-green-500" />
                  ) : (
                    <WifiOff className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>

              {/* Device Info */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">IP Address</span>
                  <span className="font-mono">{device.ipAddress}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">MQTT Topic</span>
                  <span className="font-mono text-xs">{device.mqttTopic}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Firmware</span>
                  <span className="font-mono">{device.firmwareVersion}</span>
                </div>

                {device.batteryLevel !== undefined && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400 flex items-center gap-1">
                        <Battery className="w-4 h-4" />
                        Battery
                      </span>
                      <span>{device.batteryLevel}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          device.batteryLevel > 50
                            ? 'bg-green-500'
                            : device.batteryLevel > 20
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${device.batteryLevel}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {device.signalStrength !== undefined && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400 flex items-center gap-1">
                        <Radio className="w-4 h-4" />
                        Signal
                      </span>
                      <span>{device.signalStrength}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${device.signalStrength}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  device.online
                    ? 'bg-green-600/20 text-green-400'
                    : 'bg-red-600/20 text-red-400'
                }`}>
                  {device.online ? 'Online' : 'Offline'}
                </span>

                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Connection Settings */}
        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">MQTT Broker Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium mb-2">Broker Address</label>
                <input
                  type="text"
                  value={broker}
                  onChange={(e) => setBroker(e.target.value)}
                  placeholder="ws://broker:8083 or mqtt://..."
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Port</label>
              <input
                type="number"
                value={port}
                onChange={(e) => setPort(parseInt(e.target.value || '0'))}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Username (Optional)</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="mqtt_user"
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Discovery Timeout (ms)</label>
              <input
                type="number"
                value={discoveryTimeout}
                onChange={(e) => setDiscoveryTimeout(parseInt(e.target.value || '0'))}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors">
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
