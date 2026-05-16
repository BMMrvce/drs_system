// Match Types
export type MatchStatus = 'live' | 'completed' | 'interrupted' | 'paused';
export type EventType = 'wicket' | 'bail_dislodged' | 'stump_motion' | 'motion_alert' | 'device_disconnected' | 'camera_failure';
export type DeviceType = 'stump' | 'bail' | 'camera' | 'led' | 'sensor';
export type StreamHealth = 'good' | 'fair' | 'poor' | 'offline';

export interface Match {
  id: string;
  name: string;
  tournament?: string;
  teamA: string;
  teamB: string;
  venue: string;
  status: MatchStatus;
  startTime: Date;
  endTime?: Date;
  duration: number; // seconds
  thumbnail?: string;
  overs?: number;
  officials?: string[];
  currentInnings?: number;
  recordingQuality?: string;
  cameraId?: string;
  replayBufferDuration?: number;
}

export interface SensorEvent {
  id: string;
  matchId: string;
  timestamp: number;
  eventType: EventType;
  sensorId: string;
  confidence: number;
  replayOffset?: number;
  thumbnailUrl?: string;
  metadata?: Record<string, any>;
}

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  ipAddress: string;
  mqttTopic: string;
  online: boolean;
  firmwareVersion: string;
  batteryLevel?: number;
  signalStrength?: number;
  lastHeartbeat?: Date;
  capabilities?: string[];
}

export interface Camera {
  id: string;
  name: string;
  fps: number;
  resolution: string;
  bitrate: number;
  health: StreamHealth;
  latency?: number;
  droppedFrames?: number;
}

export interface SystemStatus {
  recording: boolean;
  storageUsed: number;
  storageTotal: number;
  cpuUsage: number;
  gpuUsage: number;
  streamHealth: StreamHealth;
  bitrate?: number;
  fps?: number;
  droppedFrames?: number;
}

export interface ReplayBookmark {
  id: string;
  matchId: string;
  timestamp: number;
  eventId?: string;
  label?: string;
  thumbnailUrl?: string;
}

export interface MQTTConfig {
  brokerUrl: string;
  port: number;
  username?: string;
  password?: string;
  discoveryTimeout: number;
  retryInterval: number;
}

export interface RecordingSettings {
  resolution: string;
  fps: number;
  bitrate: number;
  storagePath: string;
  compressionQuality: string;
}

export interface ReplaySettings {
  defaultDuration: number;
  bufferSize: number;
  slowMotionSpeed: number;
}

export interface LEDSettings {
  brightness: number;
  colorMode: string;
  flashDuration: number;
  blinkPattern: string;
}

export interface AppSettings {
  recording: RecordingSettings;
  replay: ReplaySettings;
  led: LEDSettings;
  mqtt: MQTTConfig;
}
