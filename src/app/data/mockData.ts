import { Match, Device, Camera, SensorEvent, AppSettings } from '../types';

// Replace large hardcoded mock data with empty defaults so the app
// initializes from real runtime sources (camera, network discovery).
export const mockMatches: Match[] = [];
export const mockDevices: Device[] = [];
export const mockCameras: Camera[] = [];
export const mockEvents: SensorEvent[] = [];

export const defaultSettings: AppSettings = {
  recording: {
    resolution: '1280x720',
    fps: 60,
    bitrate: 8000,
    storagePath: './recordings',
    compressionQuality: 'high'
  },
  replay: {
    defaultDuration: 30,
    bufferSize: 60,
    slowMotionSpeed: 0.25
  },
  led: {
    brightness: 75,
    colorMode: 'auto',
    flashDuration: 500,
    blinkPattern: 'standard'
  },
  mqtt: {
    brokerUrl: '',
    port: 1883,
    username: '',
    password: '',
    discoveryTimeout: 5000,
    retryInterval: 3000
  }
};
