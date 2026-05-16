## End-to-End Realtime DRS (Decision Review System) Platform — Complete Product Requirement Specification

Design and build a **complete end-to-end Realtime DRS (Decision Review System) Platform** for cricket match recording, intelligent replay analysis, and sensor-based wicket event detection using live hardware-integrated stumps and bail sensors.

The platform must function as a **production-grade realtime sports review ecosystem** consisting of:

* Frontend application
* Backend services
* Video processing pipeline
* Sensor integration layer
* MQTT communication system
* Device management
* Replay engine
* Event bookmarking engine
* Match archival system
* Analytics and monitoring
* Hardware communication layer

The system should be optimized for:

* Low latency
* High reliability
* Continuous recording
* Realtime synchronization
* Scalable multi-match operations

---

# 1. System Objectives

The platform must:

* Continuously record live cricket matches
* Integrate with smart wicket/stump hardware
* Detect wicket/bail disturbances in realtime
* Automatically generate replay bookmarks
* Allow replay without interrupting recording
* Store completed matches with indexed events
* Provide instant replay and slow-motion analysis
* Support device discovery and management over MQTT
* Operate reliably under unstable network conditions
* Provide centralized operational monitoring

---

# 2. End-to-End Architecture

## System Layers

### A. Frontend Layer

Responsible for:

* Match control
* Live monitoring
* Replay analysis
* Timeline navigation
* Device management
* Settings configuration

### B. Backend Services Layer

Responsible for:

* Match lifecycle management
* Sensor event processing
* Replay indexing
* Device orchestration
* Authentication
* API management

### C. Video Processing Layer

Responsible for:

* Continuous recording
* Replay buffering
* Clip extraction
* Stream management
* Video transcoding

### D. Hardware Communication Layer

Responsible for:

* MQTT communication
* Sensor data ingestion
* Device health monitoring
* Network discovery

### E. Storage Layer

Responsible for:

* Video storage
* Match metadata
* Replay bookmarks
* Sensor logs
* Device configurations

---

# 3. Frontend Application

## Technology Stack

Recommended:

* React / Next.js / Electron
* TypeScript
* TailwindCSS
* Zustand/Redux
* WebSocket client
* Video.js / custom FFmpeg-based player

---

# 4. Home Screen Module

## Purpose

Central dashboard displaying all matches.

## UI Features

### Match Carousel

Display matches as interactive cards.

Each card contains:

* Match title
* Team names
* Match thumbnail
* Match duration
* Status:

  * Live
  * Completed
  * Interrupted
* Start timestamp

### Carousel Controls

* Previous button
* Next button
* Keyboard navigation
* Touch/drag support

### Quick Actions

* Start Match
* Resume Match
* View Replay
* Delete Match
* Export Match

---

# 5. Match Creation Workflow

## Add Match Screen

### Form Inputs

* Match name
* Tournament
* Team A
* Team B
* Venue
* Overs format
* Camera selection
* Recording quality
* Replay buffer duration

---

## Match Initialization Flow

When user clicks **Start Match**:

### Backend must:

1. Create match session
2. Allocate storage directories
3. Initialize replay buffers
4. Start video recording service
5. Connect sensor listeners
6. Subscribe to MQTT topics
7. Start event indexing
8. Open live control center

---

# 6. Live Match Recording Module

## Purpose

Primary realtime control center during live matches.

---

## Components

### Match Information Panel

Display:

* Teams
* Current innings
* Match timer
* Recording duration
* Match ID

---

### Live Recording Status

Display:

* Recording state
* Bitrate
* FPS
* Encoding health
* Dropped frames

---

### Camera Monitoring

Display:

* Connected cameras
* Resolution
* Signal status
* Stream latency
* Connection quality

---

### Connected Device Panel

Display:

* Smart stumps
* Bail sensors
* LED systems
* Sensor health
* Battery status
* Signal strength

---

### Realtime Events Feed

Display live events:

* Bail displacement
* Wicket movement
* Sensor disconnect
* Motion detection
* Camera failure

---

### Live Notifications

Push notifications for:

* Wicket detected
* Replay generated
* Device disconnected
* Storage low
* MQTT failure

---

# 7. Sensor & Hardware Integration

## Physical Hardware Components

### Smart Stumps

Detect:

* Motion
* Impact
* Tilt

### Bail Sensors

Detect:

* Bail displacement
* Separation timing

### LED System

Provide:

* Flash effects
* Visual wicket indication

---

# 8. MQTT Communication System

## Responsibilities

* Sensor communication
* Device discovery
* Device heartbeat
* Event publishing
* Remote configuration

---

## MQTT Features

### Auto Discovery

System scans network and auto-detects:

* Stump devices
* Bail modules
* LED controllers

---

### Device Registration

Devices must:

* Self-register
* Publish capabilities
* Maintain heartbeat

---

### MQTT Topics Example

```plaintext
drs/device/register
drs/device/status
drs/match/events
drs/stumps/motion
drs/bails/dislodged
drs/led/control
```

---

# 9. Event Detection Engine

## Purpose

Convert raw sensor data into replay events.

---

## Event Detection Conditions

### Wicket Event

Triggered when:

* Bail displacement occurs
* Stump movement exceeds threshold
* Multiple sensors confirm impact

---

## Event Processing Pipeline

1. Receive MQTT payload
2. Validate sensor packet
3. Timestamp synchronization
4. Correlate sensor events
5. Generate event marker
6. Store event metadata
7. Trigger replay bookmark
8. Notify frontend

---

## Event Metadata

Store:

* Event ID
* Timestamp
* Match ID
* Sensor ID
* Event type
* Confidence score
* Replay offset
* Thumbnail reference

---

# 10. Continuous Recording Engine

## Critical System Requirement

Recording MUST continue regardless of replay navigation.

If the operator:

* Rewinds footage
* Views old replay
* Pauses playback
* Scrubs timeline

The live recording pipeline must continue uninterrupted.

---

# 11. Recommended Video Architecture

## Dual Pipeline Design

### Recording Pipeline

Handles:

* Continuous recording
* Segment generation
* Storage writing

### Playback Pipeline

Handles:

* Replay navigation
* Timeline seeking
* Slow motion

Both pipelines operate independently.

---

# 12. Replay Buffer System

## Purpose

Allow instant replay access.

---

## Features

* Circular memory buffer
* Configurable retention duration
* Timestamp indexing
* Fast seek operations

---

## Recommended Buffer

* 30–120 seconds rolling replay buffer

---

# 13. Match View / Replay Module

## Purpose

Review recorded events.

---

## Features

### Video Playback

* Play/Pause
* Frame stepping
* Forward/Rewind
* Fullscreen

---

### Timeline Navigation

* Timeline scrubber
* Event markers
* Zoomable timeline
* Click-to-jump replay

---

### Slow Motion Replay

Support:

* 0.25x
* 0.5x
* 0.75x playback

---

### Event Jump Navigation

User clicks event marker → player jumps directly to event timestamp.

---

### Replay Synchronization

Synchronize:

* Video frames
* Sensor events
* Audio
* Metadata

---

# 14. Match Completion Workflow

## When User Clicks “End Match”

System must:

1. Stop recording safely
2. Finalize segments
3. Merge video streams
4. Persist metadata
5. Save bookmarks
6. Generate thumbnails
7. Archive match
8. Release resources

---

# 15. Archived Match System

## Features

* Match history
* Search/filter
* Replay analysis
* Export replay clips
* Event statistics
* Match summaries

---

# 16. Device Management Module

## Purpose

Manage all connected hardware.

---

## Features

### Device Dashboard

Display:

* Device type
* Firmware version
* IP address
* MQTT topic
* Signal quality
* Online/offline state

---

### Add Device

Support:

* Network scan
* MQTT discovery
* Manual pairing
* QR pairing

---

### Device Configuration

Allow:

* Rename device
* Assign match role
* Configure MQTT topics
* Adjust thresholds
* Firmware updates

---

# 17. Settings Module

## LED Settings

Allow:

* Brightness control
* Color mode
* Flash duration
* Blink patterns

---

## Recording Settings

Allow:

* Resolution
* FPS
* Bitrate
* Storage location

---

## Replay Settings

Allow:

* Replay duration
* Buffer size
* Slow-motion speed

---

## Network Settings

Allow:

* MQTT broker configuration
* Authentication
* Discovery timeout
* Retry intervals

---

# 18. Backend Services

## Core Services

### Match Service

Handles:

* Match lifecycle
* Metadata
* Session state

---

### Replay Service

Handles:

* Replay generation
* Timeline indexing
* Bookmark retrieval

---

### Sensor Service

Handles:

* Sensor packet ingestion
* Event correlation
* Threshold evaluation

---

### Device Service

Handles:

* Discovery
* Pairing
* Health monitoring

---

### Notification Service

Handles:

* Live alerts
* System warnings
* Operator notifications

---

# 19. Database Design

## Recommended Databases

### PostgreSQL

Store:

* Match metadata
* Device registry
* Event indexing

### Object Storage

Store:

* Video segments
* Replay clips
* Snapshots

### Redis

Store:

* Live state
* Replay buffers
* Session cache

---

# 20. APIs Required

## REST APIs

* Create match
* End match
* Fetch replay
* Fetch timeline markers
* Register device
* Configure LEDs

---

## WebSocket APIs

Realtime:

* Live events
* Device status
* Replay updates
* Notifications

---

# 21. Performance Requirements

System must support:

* Low latency replay generation
* Sub-second event detection
* Multi-camera scalability
* Fault-tolerant recording
* Continuous uptime

---

# 22. Reliability Requirements

System must:

* Recover after crashes
* Auto reconnect MQTT devices
* Resume interrupted recording
* Prevent data corruption
* Maintain timestamp accuracy

---

# 23. Security Requirements

Implement:

* Device authentication
* MQTT authentication
* Secure WebSocket communication
* Role-based access
* Match access control

---

# 24. Recommended Technology Stack

## Frontend

* React
* Next.js
* Electron
* TailwindCSS

---

## Backend

* Node.js / NestJS
* Go services for realtime processing

---

## Video Processing

* FFmpeg
* GStreamer
* OpenCV

---

## Messaging

* MQTT Broker (EMQX / Mosquitto)

---

## Database

* PostgreSQL
* Redis

---

# 25. Deliverables

The final end-to-end platform must include:

* Frontend application
* Backend APIs
* Realtime WebSocket system
* MQTT device ecosystem
* Replay engine
* Recording engine
* Device management module
* Timeline replay system
* Match archival system
* Sensor synchronization
* LED control system
* Deployment architecture
* Production-ready scalable infrastructure
