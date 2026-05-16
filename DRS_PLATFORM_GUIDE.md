# DRS Platform - Complete User Guide

## 🏏 Realtime Cricket Decision Review System

A comprehensive end-to-end platform for cricket match recording, intelligent replay analysis, and sensor-based wicket event detection using live hardware-integrated stumps and bail sensors.

---

## 📋 Table of Contents

- [Features Overview](#features-overview)
- [Getting Started](#getting-started)
- [Module Guide](#module-guide)
- [Technical Architecture](#technical-architecture)
- [Simulated Features](#simulated-features)

---

## ✨ Features Overview

### Core Capabilities

✅ **Live Match Recording**
- Continuous video recording during matches
- Real-time sensor event detection
- Automatic event bookmarking
- System health monitoring
- Multi-camera support

✅ **Realtime Event Detection**
- Wicket detection via smart stumps
- Bail displacement sensors
- Motion alert system
- Confidence scoring (75-99%)
- Automatic replay generation

✅ **Match Replay System**
- Timeline-based navigation
- Variable playback speed (0.25x - 2x)
- Frame-by-frame stepping
- Event markers on timeline
- Click-to-jump navigation

✅ **Device Management**
- MQTT-based device communication
- Network scanning and discovery
- Device health monitoring
- Battery and signal tracking
- Firmware version display

✅ **Statistics & Analytics**
- Real-time match statistics
- Event breakdown by type
- Average confidence tracking
- Events per hour metrics

✅ **Export Functionality**
- Multiple format support (MP4, MOV, AVI)
- Quality selection (4K, 1080p, 720p, 480p)
- Event marker inclusion
- Selective event export

---

## 🚀 Getting Started

### Navigation

**Home Screen** (`/`)
- View all matches (live and completed)
- Search and filter matches
- Quick access to devices and settings
- Quick action cards

**Start a New Match**
1. Click "New Match" on home screen
2. Fill in match details (teams, venue, tournament)
3. Configure recording settings
4. Select camera and buffer duration
5. Click "Start Match Recording"

### Viewing Live Matches

Navigate to a live match to see:
- Recording duration counter
- System status (CPU, GPU, Storage)
- Camera monitoring
- Connected sensors
- Live events feed (auto-updating)
- Match statistics

### Viewing Replays

Navigate to completed matches to:
- Review timeline with event markers
- Play/pause/skip through footage
- Adjust playback speed
- Jump to specific events
- Export replay clips

---

## 📚 Module Guide

### 1. Home Screen

**Features:**
- Match carousel with status indicators
- Search by name, team, or tournament
- Quick actions (New Match, Devices, Settings)
- Delete matches with confirmation

**Match Statuses:**
- 🔴 **LIVE** - Currently recording
- ✅ **COMPLETED** - Finished match
- ⏸️ **PAUSED** - Temporarily stopped
- ⚠️ **INTERRUPTED** - Unexpected stop

### 2. Add Match Screen

**Configuration Options:**

**Match Information:**
- Match title (required)
- Tournament name
- Team A & Team B (required)
- Venue (required)
- Overs format (T20, ODI, Test)
- Match officials

**Recording Configuration:**
- Camera selection
- Recording quality (4K, 1080p, 720p)
- Replay buffer duration (30-120 seconds)

### 3. Live Match Recording Screen

**Panels:**

**Match Information:**
- Recording duration
- Status indicator
- Current innings
- Quality settings

**System Status:**
- Storage usage (with visual bar)
- CPU usage (real-time)
- GPU usage (real-time)
- Bitrate, FPS, dropped frames

**Camera Monitoring:**
- Multiple camera support
- FPS and resolution
- Latency tracking
- Health indicators

**Connected Sensors:**
- Smart stumps (left, middle, right)
- Bail sensors (primary, secondary)
- LED controllers
- Battery levels
- Signal strength

**Live Events Feed:**
- Real-time event notifications
- Confidence percentages
- Sensor identification
- Timestamp tracking

**Statistics Dashboard:**
- Total events count
- Average confidence
- Events per hour
- Event type breakdown

### 4. Match Replay Screen

**Playback Controls:**
- Play/Pause
- Skip forward/backward (10 seconds)
- Frame step forward/backward
- Variable speed (0.25x, 0.5x, 0.75x, 1x, 1.5x, 2x)

**Timeline Features:**
- Interactive scrubber
- Event markers (color-coded by type)
- Click-to-jump to events
- Zoom in/out controls

**Event Navigation:**
- Event bookmarks list
- Click to jump to timestamp
- Event details panel
- Metadata display

**Export Options:**
- Format selection (MP4, MOV, AVI)
- Quality settings
- Include/exclude event markers
- Selective event export

### 5. Device Management Screen

**Features:**
- Device grid with status
- Online/offline indicators
- Battery monitoring
- Signal strength tracking
- Network scanning
- MQTT configuration
- Device capabilities display

**Supported Devices:**
- 🏏 Smart Stumps
- 🔴 Bail Sensors
- 📹 Cameras
- 💡 LED Controllers
- 📡 Motion Sensors

**Device Information:**
- IP address
- MQTT topic
- Firmware version
- Last heartbeat
- Capabilities list

### 6. Settings Screen

**LED Settings:**
- Brightness control (0-100%)
- Color mode (Auto, Red, Green, Blue, White, Rainbow)
- Flash duration (100-5000ms)
- Blink pattern (Standard, Fast, Pulse, Strobe, Fade)

**Recording Settings:**
- Resolution (4K, 1080p, 720p, SD)
- FPS (30, 60, 120, 240)
- Bitrate (5000-50000 kbps)
- Compression quality
- Storage path

**Replay Settings:**
- Slow motion speed
- Default replay duration
- Buffer size (30-300 seconds)

**Network Settings:**
- MQTT broker URL
- MQTT port
- Discovery timeout
- Retry interval

---

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Context API** for state management

### Key Technologies
- WebSocket simulation for real-time events
- MQTT communication layer (simulated)
- Event-driven architecture
- Circular buffer for replay system

### Data Flow
1. **Sensor Events** → MQTT Topics → Event Service
2. **Event Service** → Processing → Bookmark Generation
3. **Recording Pipeline** → Continuous Recording → Storage
4. **Playback Pipeline** → Replay Navigation → UI

---

## 🎭 Simulated Features

This is a **frontend demonstration** with realistic simulations:

### Real-time Event Generation
- Events generated every 20-60 seconds during live matches
- Random event types (wicket, bail_dislodged, stump_motion, motion_alert)
- Confidence levels (75-99%)
- Sensor attribution
- Metadata generation

### System Metrics
- CPU usage fluctuation (30-60%)
- GPU usage variation (40-80%)
- Dropped frames (0-10)
- Storage tracking

### Device Simulation
- 8 pre-configured devices
- Online/offline states
- Battery levels (75-95%)
- Signal strength (85-100%)
- MQTT topics

### Notifications
- Toast notifications for events
- Color-coded by event type
- Auto-dismiss after 4-5 seconds
- Event confidence display

---

## 🎯 Event Types

| Event Type | Description | Color | Typical Confidence |
|------------|-------------|-------|-------------------|
| **Wicket** | Stump impact detected | Red | 90-99% |
| **Bail Dislodged** | Bail separation | Orange | 85-95% |
| **Stump Motion** | Stump tilt/movement | Yellow | 75-90% |
| **Motion Alert** | General motion detection | Blue | 70-85% |

---

## 📊 Statistics Tracked

### Match Level
- Total events
- Average confidence
- Events per hour
- Event type distribution

### System Level
- Storage usage
- CPU/GPU utilization
- Recording quality
- Stream health
- Dropped frames

### Device Level
- Online/offline status
- Battery levels
- Signal strength
- Heartbeat timing

---

## 🔧 Configuration Options

### Camera Settings
- Resolution: 4K, 1080p, 720p, SD
- Frame rate: 30, 60, 120, 240 FPS
- Bitrate: 5-50 Mbps

### Replay Buffer
- Size: 30-300 seconds
- Circular buffer architecture
- Instant replay access

### Export Formats
- MP4 (recommended)
- MOV (Apple)
- AVI (legacy)

---

## 🎨 User Interface

### Design System
- **Dark Mode** optimized (Gray-950 base)
- **Color Coding** for status and events
- **Responsive** grid layouts
- **Smooth** transitions and animations
- **Icon-rich** interface

### Status Indicators
- 🟢 Green: Good/Online
- 🟡 Yellow: Warning/Fair
- 🔴 Red: Error/Poor/Offline
- 🔵 Blue: Info/Active

---

## 🚦 Workflow Examples

### Starting a Match
1. Home → "New Match"
2. Enter match details
3. Configure recording settings
4. Start recording
5. Monitor live feed

### Reviewing Events
1. Live screen → View events feed
2. Click event to see details
3. Auto-bookmarks created
4. Statistics update in real-time

### Exporting Replay
1. Navigate to completed match
2. Click "Export Replay"
3. Select format and quality
4. Choose events to include
5. Export and download

---

## 💡 Tips & Best Practices

### For Best Performance
- Use 1080p for balanced quality/storage
- Keep buffer size at 60 seconds
- Monitor storage regularly
- Check device batteries

### For Event Detection
- Ensure sensors are online
- Check signal strength (>80%)
- Verify battery levels (>20%)
- Monitor confidence scores

### For Replay Analysis
- Use slow motion (0.25x) for detailed review
- Zoom timeline for precise navigation
- Export with event markers enabled
- Review metadata for sensor info

---

## 🎬 Demo Data

The platform includes:
- **4 sample matches** (1 live, 3 completed)
- **8 connected devices** (stumps, bails, cameras, LEDs)
- **Multiple cameras** with different specs
- **Pre-generated events** for completed matches
- **Realistic statistics** and metadata

---

## 🔮 Future Enhancements

Potential real-world integrations:
- Actual MQTT broker connection
- Real video recording/playback
- Cloud storage integration
- Multi-match concurrent recording
- AI-powered event analysis
- Advanced analytics dashboard
- Mobile app companion
- Live streaming support

---

## 📞 Support

For issues or questions:
- Check console for error logs
- Verify device connections
- Review MQTT configuration
- Check storage availability

---

**Built with ❤️ for Cricket Technology**

*This is a demonstration platform showcasing the complete DRS ecosystem architecture and user experience.*
