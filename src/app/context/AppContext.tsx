import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { Match, Device, Camera, SensorEvent, AppSettings, SystemStatus } from '../types/index';
import { defaultSettings } from '../data/mockData';
import { connectToBroker, disconnectBroker } from '../services/mqttClient';
import { fetchDevices, syncDevices } from '../services/backendApi';

interface AppContextType {
  matches: Match[];
  devices: Device[];
  cameras: Camera[];
  events: SensorEvent[];
  mqttMessages: Array<{ topic: string; payload: any; receivedAt: number }>;
  settings: AppSettings;
  systemStatus: SystemStatus;
  brokerStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  brokerUrl?: string;
  brokerError?: string | null;
  addMatch: (match: Match) => void;
  updateMatch: (id: string, updates: Partial<Match>) => void;
  deleteMatch: (id: string) => void;
  addEvent: (event: SensorEvent) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  updateSystemStatus: (updates: Partial<SystemStatus>) => void;
  getMatchById: (id: string) => Match | undefined;
  getEventsByMatchId: (matchId: string) => SensorEvent[];
  startDiscovery: (brokerUrl?: string, opts?: any) => void;
  stopDiscovery: () => void;
  updateDevices: (devices: Device[]) => void;
  updateCameras: (cameras: Camera[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [matches, setMatches] = useState<Match[]>(() => {
    try { return JSON.parse(localStorage.getItem('matches') || '[]'); } catch { return []; }
  });
  const [devices, setDevices] = useState<Device[]>(() => {
    try { return JSON.parse(localStorage.getItem('devices') || '[]'); } catch { return []; }
  });
  const [cameras, setCameras] = useState<Camera[]>(() => {
    try { return JSON.parse(localStorage.getItem('cameras') || '[]'); } catch { return []; }
  });
  const [events, setEvents] = useState<SensorEvent[]>(() => {
    try { return JSON.parse(localStorage.getItem('events') || '[]'); } catch { return []; }
  });
  const [mqttMessages, setMqttMessages] = useState<Array<{ topic: string; payload: any; receivedAt: number }>>(() => {
    try { return JSON.parse(localStorage.getItem('mqttMessages') || '[]'); } catch { return []; }
  });
  const [settings, setSettings] = useState<AppSettings>(() => {
    try { return JSON.parse(localStorage.getItem('settings') || JSON.stringify(defaultSettings)); } catch { return defaultSettings; }
  });
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    recording: false,
    storageUsed: 145,
    storageTotal: 500,
    cpuUsage: 35,
    gpuUsage: 42,
    streamHealth: 'good',
    bitrate: 15000,
    fps: 120,
    droppedFrames: 3
  });
  const mqttRef = useRef<any>(null);
  const [brokerStatus, setBrokerStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [brokerUrlState, setBrokerUrlState] = useState<string | undefined>(undefined);
  const [brokerError, setBrokerError] = useState<string | null>(null);
  const backendSyncReadyRef = useRef(false);

  useEffect(() => {
    localStorage.setItem('matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('devices', JSON.stringify(devices));
  }, [devices]);

  useEffect(() => {
    localStorage.setItem('cameras', JSON.stringify(cameras));
  }, [cameras]);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('mqttMessages', JSON.stringify(mqttMessages));
  }, [mqttMessages]);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    let active = true;

    async function loadDevicesFromBackend() {
      try {
        const remoteDevices = await fetchDevices();
        if (!active) {
          return;
        }

        if (remoteDevices.length > 0) {
          setDevices(remoteDevices);
        }

        backendSyncReadyRef.current = true;
      } catch (error) {
        console.warn('Device sync backend unavailable, using local cache', error);
        backendSyncReadyRef.current = false;
      }
    }

    void loadDevicesFromBackend();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!backendSyncReadyRef.current) {
      return;
    }

    void syncDevices(devices).catch((error) => {
      console.warn('Failed to sync devices to backend', error);
    });
  }, [devices]);

  const addMatch = (match: Match) => {
    setMatches(prev => [match, ...prev]);
  };

  const updateMatch = (id: string, updates: Partial<Match>) => {
    setMatches(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const deleteMatch = (id: string) => {
    setMatches(prev => prev.filter(m => m.id !== id));
  };

  const addEvent = (event: SensorEvent) => {
    setEvents(prev => [event, ...prev]);
  };

  const addMqttMessage = (topic: string, payload: any) => {
    setMqttMessages(prev => [{ topic, payload, receivedAt: Date.now() }, ...prev].slice(0, 200));
  };

  const updateDevices = (next: Device[]) => {
    setDevices(next);
  };

  const updateCameras = (next: Camera[]) => {
    setCameras(next);
  };

  const startDiscovery = (brokerUrl?: string, opts?: any) => {
    const url = brokerUrl || settings.mqtt?.brokerUrl;
    if (!url) {
      console.warn('No MQTT broker URL provided for discovery');
      return;
    }
    disconnectBroker();
    setBrokerStatus('connecting');
    setBrokerUrlState(url);
    setBrokerError(null);
    try {
      mqttRef.current = connectToBroker(url, opts || {}, {
        onDevice: (device: any) => {
          // normalize device payload to Device type as best-effort
          const normalized: Device = {
            id: device.id || device.deviceId || `${device.type || 'dev'}-${Date.now()}`,
            name: device.name || device.id || 'Unknown Device',
            type: device.type || 'sensor',
            ipAddress: device.ipAddress || device.ip || '',
            mqttTopic: device.mqttTopic || device.topic || '',
            online: device.online !== undefined ? !!device.online : true,
            firmwareVersion: device.firmwareVersion || device.fw || '',
            batteryLevel: device.batteryLevel,
            signalStrength: device.signalStrength,
            lastHeartbeat: device.lastHeartbeat ? new Date(device.lastHeartbeat) : new Date(),
            capabilities: device.capabilities || []
          } as Device;
          setDevices(prev => {
            const exists = prev.find(d => d.id === normalized.id);
            if (exists) return prev.map(d => d.id === normalized.id ? { ...d, ...normalized } : d);
            return [normalized, ...prev];
          });
        },
        onEvent: (evt: any) => {
          setEvents(prev => [{
            id: evt.id || `evt-${Date.now()}`,
            matchId: evt.matchId || '',
            timestamp: evt.timestamp || Date.now(),
            eventType: evt.eventType || 'unknown',
            sensorId: evt.sensorId || 'unknown',
            confidence: evt.confidence || 1,
            replayOffset: evt.replayOffset || 0,
            metadata: evt.metadata || {}
          }, ...prev]);
        },
        onMessage: (topic: string, message: any) => {
          addMqttMessage(topic, message);
        },
        onConnect: () => {
          setBrokerStatus('connected');
        },
        onError: (err: Error) => {
          setBrokerStatus('error');
          setBrokerError(err?.message || String(err));
        },
        onClose: () => {
          setBrokerStatus('disconnected');
        },
        onOffline: () => {
          setBrokerStatus('disconnected');
        },
        onReconnect: () => {
          setBrokerStatus('connecting');
        }
      });
    } catch (e) {
      console.error('Discovery failed', e);
      setBrokerStatus('error');
      setBrokerError(String(e));
    }
  };

  const stopDiscovery = () => {
    disconnectBroker();
    mqttRef.current = null;
    setBrokerStatus('disconnected');
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const updateSystemStatus = (updates: Partial<SystemStatus>) => {
    setSystemStatus(prev => ({ ...prev, ...updates }));
  };

  const getMatchById = (id: string) => {
    return matches.find(m => m.id === id);
  };

  const getEventsByMatchId = (matchId: string) => {
    return events.filter(e => e.matchId === matchId);
  };

  return (
    <AppContext.Provider
      value={{
        matches,
        devices,
        cameras,
        events,
        mqttMessages,
        settings,
        systemStatus,
        brokerStatus,
        brokerUrl: brokerUrlState,
        brokerError,
        addMatch,
        updateMatch,
        deleteMatch,
        addEvent,
        updateSettings,
        updateSystemStatus,
        getMatchById,
        getEventsByMatchId,
        startDiscovery,
        stopDiscovery,
        updateDevices,
        updateCameras
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
