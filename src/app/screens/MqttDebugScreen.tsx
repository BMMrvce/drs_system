import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wifi, Radio, Bug, Copy } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function MqttDebugScreen() {
  const navigate = useNavigate();
  const { brokerStatus, brokerUrl, brokerError, devices, events, mqttMessages } = useApp();
  const [filterText, setFilterText] = useState('');

  const filteredMessages = useMemo(() => {
    const needle = filterText.trim().toLowerCase();
    if (!needle) {
      return mqttMessages;
    }

    return mqttMessages.filter(message => {
      const payloadText = typeof message.payload === 'string'
        ? message.payload
        : JSON.stringify(message.payload);

      return message.topic.toLowerCase().includes(needle) || payloadText.toLowerCase().includes(needle);
    });
  }, [filterText, mqttMessages]);

  const copyPayload = async (payload: any) => {
    try {
      await navigator.clipboard.writeText(typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2));
    } catch {
      // ignore clipboard failures
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-orange-500/20 rounded-xl border border-orange-500/30">
              <Bug className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">MQTT Debug Console</h1>
              <p className="text-gray-400">Hidden diagnostics page for live broker traffic</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-gray-950 rounded-lg border border-gray-800">
              <div className="text-gray-400 mb-1">Broker Status</div>
              <div className="font-semibold capitalize">{brokerStatus}</div>
            </div>
            <div className="p-4 bg-gray-950 rounded-lg border border-gray-800">
              <div className="text-gray-400 mb-1">Broker URL</div>
              <div className="font-mono text-xs break-all">{brokerUrl || 'Not connected'}</div>
            </div>
            <div className="p-4 bg-gray-950 rounded-lg border border-gray-800">
              <div className="text-gray-400 mb-1">Broker Error</div>
              <div className="text-red-400 text-xs break-words">{brokerError || 'None'}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="space-y-6 xl:col-span-1">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Wifi className="w-5 h-5 text-green-500" />
                Connected Devices
              </h2>
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {devices.length === 0 ? (
                  <div className="text-sm text-gray-500">No devices have been discovered yet.</div>
                ) : (
                  devices.map(device => (
                    <div key={device.id} className="p-3 bg-gray-950 rounded-lg border border-gray-800">
                      <div className="font-medium">{device.name}</div>
                      <div className="text-xs text-gray-400 font-mono break-all">{device.id}</div>
                      <div className="text-xs text-gray-500 mt-1">{device.mqttTopic}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Radio className="w-5 h-5 text-blue-500" />
                Recent Events
              </h2>
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {events.length === 0 ? (
                  <div className="text-sm text-gray-500">No MQTT events have arrived yet.</div>
                ) : (
                  events.slice(0, 20).map(event => (
                    <div key={event.id} className="p-3 bg-gray-950 rounded-lg border border-gray-800">
                      <div className="text-sm font-medium capitalize">{event.eventType.replace(/_/g, ' ')}</div>
                      <div className="text-xs text-gray-400">Sensor: {event.sensorId}</div>
                      <div className="text-xs text-gray-500 mt-1">Confidence: {(event.confidence * 100).toFixed(0)}%</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="xl:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <h2 className="text-xl font-semibold">Raw MQTT Messages</h2>
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Filter by topic or payload"
                className="w-full md:w-96 bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-3 max-h-[760px] overflow-y-auto pr-1">
              {filteredMessages.length === 0 ? (
                <div className="text-sm text-gray-500">No MQTT messages match the filter.</div>
              ) : (
                filteredMessages.map((message, index) => {
                  const payloadText = typeof message.payload === 'string'
                    ? message.payload
                    : JSON.stringify(message.payload, null, 2);

                  return (
                    <div key={`${message.topic}-${message.receivedAt}-${index}`} className="bg-gray-950 border border-gray-800 rounded-lg p-4">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="text-xs text-gray-400 uppercase tracking-wide">Topic</div>
                          <div className="font-mono text-sm break-all">{message.topic}</div>
                        </div>
                        <button
                          onClick={() => void copyPayload(message.payload)}
                          className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          Copy
                        </button>
                      </div>
                      <pre className="text-xs whitespace-pre-wrap break-words text-green-300 bg-black/30 rounded-lg p-3 overflow-x-auto">
{payloadText}
                      </pre>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}