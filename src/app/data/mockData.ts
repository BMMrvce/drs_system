import { Match, Device, Camera, SensorEvent, AppSettings } from '../types';

export const mockMatches: Match[] = [
  {
    id: 'match-001',
    name: 'IPL 2026 Final',
    tournament: 'Indian Premier League 2026',
    teamA: 'Mumbai Indians',
    teamB: 'Chennai Super Kings',
    venue: 'Wankhede Stadium, Mumbai',
    status: 'live',
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    duration: 7200,
    overs: 20,
    currentInnings: 2,
    officials: ['Umpire: Kumar Dharmasena', 'Umpire: Marais Erasmus', 'Match Referee: Ranjan Madugalle'],
    recordingQuality: '1080p',
    cameraId: 'cam-main-1',
    replayBufferDuration: 60
  },
  {
    id: 'match-002',
    name: 'India vs Australia - Test Match Day 3',
    tournament: 'Border-Gavaskar Trophy 2026',
    teamA: 'India',
    teamB: 'Australia',
    venue: 'Melbourne Cricket Ground',
    status: 'completed',
    startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    endTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
    duration: 28800,
    overs: 90,
    officials: ['Umpire: Simon Taufel', 'Umpire: Richard Illingworth'],
    recordingQuality: '4k',
    replayBufferDuration: 120
  },
  {
    id: 'match-003',
    name: 'County Championship - Yorkshire vs Lancashire',
    tournament: 'County Championship 2026',
    teamA: 'Yorkshire',
    teamB: 'Lancashire',
    venue: 'Headingley, Leeds',
    status: 'completed',
    startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000),
    duration: 25200,
    overs: 50,
    recordingQuality: '1080p'
  },
  {
    id: 'match-004',
    name: 'Women\'s T20 World Cup Semi-Final',
    tournament: 'ICC Women\'s T20 World Cup 2026',
    teamA: 'England Women',
    teamB: 'India Women',
    venue: 'Sydney Cricket Ground',
    status: 'completed',
    startTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 3.5 * 60 * 60 * 1000),
    duration: 12600,
    overs: 20,
    recordingQuality: '1080p'
  }
];

export const mockDevices: Device[] = [
  {
    id: 'stump-left-001',
    name: 'Stump Sensor - Left',
    type: 'stump',
    ipAddress: '192.168.1.101',
    mqttTopic: 'drs/stumps/left',
    online: true,
    firmwareVersion: '2.4.1',
    batteryLevel: 87,
    signalStrength: 94,
    lastHeartbeat: new Date(),
    capabilities: ['motion', 'impact', 'tilt']
  },
  {
    id: 'stump-middle-001',
    name: 'Stump Sensor - Middle',
    type: 'stump',
    ipAddress: '192.168.1.102',
    mqttTopic: 'drs/stumps/middle',
    online: true,
    firmwareVersion: '2.4.1',
    batteryLevel: 82,
    signalStrength: 91,
    lastHeartbeat: new Date(),
    capabilities: ['motion', 'impact', 'tilt']
  },
  {
    id: 'stump-right-001',
    name: 'Stump Sensor - Right',
    type: 'stump',
    ipAddress: '192.168.1.103',
    mqttTopic: 'drs/stumps/right',
    online: true,
    firmwareVersion: '2.4.1',
    batteryLevel: 79,
    signalStrength: 89,
    lastHeartbeat: new Date(),
    capabilities: ['motion', 'impact', 'tilt']
  },
  {
    id: 'bail-primary-001',
    name: 'Bail Sensor - Primary',
    type: 'bail',
    ipAddress: '192.168.1.104',
    mqttTopic: 'drs/bails/primary',
    online: true,
    firmwareVersion: '1.9.5',
    batteryLevel: 93,
    signalStrength: 96,
    lastHeartbeat: new Date(),
    capabilities: ['displacement', 'timing']
  },
  {
    id: 'bail-secondary-001',
    name: 'Bail Sensor - Secondary',
    type: 'bail',
    ipAddress: '192.168.1.105',
    mqttTopic: 'drs/bails/secondary',
    online: true,
    firmwareVersion: '1.9.5',
    batteryLevel: 88,
    signalStrength: 92,
    lastHeartbeat: new Date(),
    capabilities: ['displacement', 'timing']
  },
  {
    id: 'led-system-001',
    name: 'LED Controller - Main',
    type: 'led',
    ipAddress: '192.168.1.106',
    mqttTopic: 'drs/led/control',
    online: true,
    firmwareVersion: '3.1.2',
    signalStrength: 98,
    lastHeartbeat: new Date(),
    capabilities: ['flash', 'color', 'pattern']
  },
  {
    id: 'camera-main-001',
    name: 'Main Camera Unit',
    type: 'camera',
    ipAddress: '192.168.1.200',
    mqttTopic: 'drs/camera/main',
    online: true,
    firmwareVersion: '4.2.0',
    signalStrength: 100,
    lastHeartbeat: new Date()
  },
  {
    id: 'camera-stump-001',
    name: 'Stump Camera Unit',
    type: 'camera',
    ipAddress: '192.168.1.201',
    mqttTopic: 'drs/camera/stump',
    online: false,
    firmwareVersion: '4.1.8',
    signalStrength: 45,
    lastHeartbeat: new Date(Date.now() - 5 * 60 * 1000)
  }
];

export const mockCameras: Camera[] = [
  {
    id: 'cam-main-1',
    name: 'Main Camera',
    fps: 120,
    resolution: '1920x1080',
    bitrate: 15000,
    health: 'good',
    latency: 45,
    droppedFrames: 2
  },
  {
    id: 'cam-stump-1',
    name: 'Stump Camera',
    fps: 240,
    resolution: '1280x720',
    bitrate: 12000,
    health: 'good',
    latency: 38,
    droppedFrames: 0
  },
  {
    id: 'cam-boundary-1',
    name: 'Boundary Camera',
    fps: 60,
    resolution: '1920x1080',
    bitrate: 10000,
    health: 'fair',
    latency: 67,
    droppedFrames: 12
  }
];

export const mockEvents: SensorEvent[] = [
  {
    id: 'evt-001',
    matchId: 'match-001',
    timestamp: Date.now() - 15 * 60 * 1000, // 15 mins ago
    eventType: 'wicket',
    sensorId: 'stump-middle-001',
    confidence: 0.98,
    replayOffset: 5,
    metadata: {
      impactForce: 8.5,
      bailDisplaced: true
    }
  },
  {
    id: 'evt-002',
    matchId: 'match-001',
    timestamp: Date.now() - 8 * 60 * 1000, // 8 mins ago
    eventType: 'bail_dislodged',
    sensorId: 'bail-primary-001',
    confidence: 0.95,
    replayOffset: 3,
    metadata: {
      separationTime: 0.032,
      bailId: 'primary'
    }
  },
  {
    id: 'evt-003',
    matchId: 'match-001',
    timestamp: Date.now() - 3 * 60 * 1000, // 3 mins ago
    eventType: 'stump_motion',
    sensorId: 'stump-left-001',
    confidence: 0.87,
    replayOffset: 4,
    metadata: {
      tiltAngle: 12.3
    }
  },
  {
    id: 'evt-004',
    matchId: 'match-001',
    timestamp: Date.now() - 90 * 1000, // 90 secs ago
    eventType: 'motion_alert',
    sensorId: 'stump-right-001',
    confidence: 0.82,
    replayOffset: 2
  }
];

export const defaultSettings: AppSettings = {
  recording: {
    resolution: '1920x1080',
    fps: 120,
    bitrate: 15000,
    storagePath: '/media/drs/recordings',
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
    brokerUrl: 'mqtt://192.168.1.1',
    port: 1883,
    username: '',
    password: '',
    discoveryTimeout: 5000,
    retryInterval: 3000
  }
};
