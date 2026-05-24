import { useEffect, useState } from 'react';
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
  XCircle,
  Save,
  X
} from 'lucide-react';
import { Device, DeviceType } from '../types';
import { useApp } from '../context/AppContext';

export function DeviceManagementScreen() {
  const navigate = useNavigate();
  const { devices, settings, updateDevices, updateSettings, startDiscovery, stopDiscovery, brokerStatus, brokerUrl, brokerError } = useApp();
  const [scanning, setScanning] = useState(false);
  const [mqttConfig, setMqttConfig] = useState(settings.mqtt);
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [manualDevice, setManualDevice] = useState({
    id: '',
    name: '',
    type: 'sensor' as DeviceType,
    ipAddress: '',
    mqttTopic: '',
    firmwareVersion: '1.0.0',
    online: true,
    batteryLevel: '',
    signalStrength: ''
  });

  useEffect(() => {
    setMqttConfig(settings.mqtt);
  }, [settings.mqtt]);

  useEffect(() => {
    if (scanning && (brokerStatus === 'connected' || brokerStatus === 'error' || brokerStatus === 'disconnected')) {
      setScanning(false);
    }
  }, [scanning, brokerStatus]);

  const getDiscoveryUrl = () => {
    const configuredUrl = mqttConfig.brokerUrl.trim();
    if (configuredUrl) {
      return configuredUrl.includes('://') ? configuredUrl : `mqtt://${configuredUrl}`;
    }

    return `mqtt://localhost:${mqttConfig.port}`;
  };

  const handleScan = () => {
    setScanning(true);
    try {
      startDiscovery(getDiscoveryUrl(), {
        username: mqttConfig.username || undefined,
        password: mqttConfig.password || undefined,
        port: mqttConfig.port
      });
    } catch (e) {
      console.error(e);
      setScanning(false);
    }
  };

  const handleDisconnect = () => {
    stopDiscovery();
  };

  const handleSaveConfiguration = () => {
    updateSettings({ mqtt: mqttConfig });
  };

  const handleAddManualDevice = () => {
    if (!manualDevice.name.trim() || !manualDevice.ipAddress.trim() || !manualDevice.mqttTopic.trim()) {
      window.alert('Device name, IP address, and MQTT topic are required.');
      return;
    }

    const nextDevice: Device = {
      id: manualDevice.id.trim() || `${manualDevice.type}-${Date.now()}`,
      name: manualDevice.name.trim(),
      type: manualDevice.type,
      ipAddress: manualDevice.ipAddress.trim(),
      mqttTopic: manualDevice.mqttTopic.trim(),
      online: manualDevice.online,
      firmwareVersion: manualDevice.firmwareVersion.trim() || '1.0.0',
      batteryLevel: manualDevice.batteryLevel === '' ? undefined : Number(manualDevice.batteryLevel),
      signalStrength: manualDevice.signalStrength === '' ? undefined : Number(manualDevice.signalStrength),
      lastHeartbeat: new Date(),
      capabilities: []
    };

    updateDevices([
      nextDevice,
      ...devices.filter(device => device.id !== nextDevice.id)
    ]);

    setManualDevice({
      id: '',
      name: '',
      type: 'sensor',
      ipAddress: '',
      mqttTopic: '',
      firmwareVersion: '1.0.0',
      online: true,
      batteryLevel: '',
      signalStrength: ''
    });
    setShowManualAdd(false);
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
        <div className="flex gap-4 mb-8 items-center flex-wrap">
          <button
            onClick={handleScan}
            disabled={scanning}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 px-6 py-3 rounded-lg transition-colors font-medium"
          >
            <RefreshCw className={`w-5 h-5 ${scanning ? 'animate-spin' : ''}`} />
            {scanning ? 'Scanning Network...' : 'Scan Network'}
          </button>

          <button
            onClick={() => setShowManualAdd(prev => !prev)}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            {showManualAdd ? 'Close Manual Add' : 'Add Device Manually'}
          </button>

          <button
            onClick={handleDisconnect}
            className="ml-auto flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-lg transition-colors font-medium"
          >
            Disconnect
          </button>
        </div>

        {showManualAdd && (
          <div className="mb-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Add Device Manually</h2>
              <button
                onClick={() => setShowManualAdd(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Close manual add form"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Device ID</label>
                <input
                  type="text"
                  value={manualDevice.id}
                  onChange={(e) => setManualDevice({ ...manualDevice, id: e.target.value })}
                  placeholder="sensor-01"
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={manualDevice.name}
                  onChange={(e) => setManualDevice({ ...manualDevice, name: e.target.value })}
                  placeholder="Front Pitch Sensor"
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={manualDevice.type}
                  onChange={(e) => setManualDevice({ ...manualDevice, type: e.target.value as DeviceType })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                >
                  <option value="sensor">Sensor</option>
                  <option value="stump">Smart Stump</option>
                  <option value="bail">Bail Sensor</option>
                  <option value="camera">Camera</option>
                  <option value="led">LED Controller</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">IP Address</label>
                <input
                  type="text"
                  value={manualDevice.ipAddress}
                  onChange={(e) => setManualDevice({ ...manualDevice, ipAddress: e.target.value })}
                  placeholder="192.168.1.50"
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">MQTT Topic</label>
                <input
                  type="text"
                  value={manualDevice.mqttTopic}
                  onChange={(e) => setManualDevice({ ...manualDevice, mqttTopic: e.target.value })}
                  placeholder="drs/devices/sensor-01"
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Firmware Version</label>
                <input
                  type="text"
                  value={manualDevice.firmwareVersion}
                  onChange={(e) => setManualDevice({ ...manualDevice, firmwareVersion: e.target.value })}
                  placeholder="1.0.0"
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Battery Level</label>
                <input
                  type="number"
                  value={manualDevice.batteryLevel}
                  onChange={(e) => setManualDevice({ ...manualDevice, batteryLevel: e.target.value })}
                  placeholder="85"
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Signal Strength</label>
                <input
                  type="number"
                  value={manualDevice.signalStrength}
                  onChange={(e) => setManualDevice({ ...manualDevice, signalStrength: e.target.value })}
                  placeholder="72"
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-3 md:col-span-2">
                <input
                  id="manual-device-online"
                  type="checkbox"
                  checked={manualDevice.online}
                  onChange={(e) => setManualDevice({ ...manualDevice, online: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-700 bg-gray-950"
                />
                <label htmlFor="manual-device-online" className="text-sm text-gray-300">
                  Mark device as online
                </label>
              </div>
            </div>

            <button
              onClick={handleAddManualDevice}
              className="mt-6 flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Device
            </button>
          </div>
        )}

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
                onChange={(e) => setMqttConfig({ ...mqttConfig, port: parseInt(e.target.value || '0') })}
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
                onChange={(e) => setMqttConfig({ ...mqttConfig, discoveryTimeout: parseInt(e.target.value || '0') })}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Retry Interval (ms)</label>
              <input
                type="number"
                value={mqttConfig.retryInterval}
                onChange={(e) => setMqttConfig({ ...mqttConfig, retryInterval: parseInt(e.target.value || '0') })}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4 flex-wrap">
            <button
              onClick={handleSaveConfiguration}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors font-medium"
            >
              <Save className="w-5 h-5" />
              Save Configuration
            </button>

            <div className="text-sm text-gray-400">
              Active broker: {brokerUrl || getDiscoveryUrl()}
            </div>
          </div>

          {brokerError && (
            <div className="mt-4 text-sm text-red-400">
              {brokerError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
