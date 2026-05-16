import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Match, Device, Camera, SensorEvent, AppSettings, SystemStatus } from '../types/index';
import { mockMatches, mockDevices, mockCameras, mockEvents, defaultSettings } from '../data/mockData';

interface AppContextType {
  matches: Match[];
  devices: Device[];
  cameras: Camera[];
  events: SensorEvent[];
  settings: AppSettings;
  systemStatus: SystemStatus;
  addMatch: (match: Match) => void;
  updateMatch: (id: string, updates: Partial<Match>) => void;
  deleteMatch: (id: string) => void;
  addEvent: (event: SensorEvent) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  updateSystemStatus: (updates: Partial<SystemStatus>) => void;
  getMatchById: (id: string) => Match | undefined;
  getEventsByMatchId: (matchId: string) => SensorEvent[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [matches, setMatches] = useState<Match[]>(mockMatches);
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [cameras, setCameras] = useState<Camera[]>(mockCameras);
  const [events, setEvents] = useState<SensorEvent[]>(mockEvents);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
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
        settings,
        systemStatus,
        addMatch,
        updateMatch,
        deleteMatch,
        addEvent,
        updateSettings,
        updateSystemStatus,
        getMatchById,
        getEventsByMatchId
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
