## Optimized System Requirement Prompt — Realtime DRS Subsystem

Build a **Realtime DRS (Decision Review System) Subsystem** for cricket match recording, replay analysis, and wicket event detection using live sensor data from physical wicket hardware.

The system must support **continuous live recording**, **event bookmarking**, **timeline-based replay**, **device management**, and **live operational monitoring**.

---

# 1. Core System Overview

The application is a **multi-screen realtime cricket review system** that:

* Records live match video continuously
* Receives realtime sensor data from physical wicket devices
* Detects wicket/bail movement events
* Automatically creates timeline bookmarks for detected events
* Allows instant replay navigation
* Continues recording even while replaying previous footage
* Stores completed matches for future review
* Manages connected hardware devices over MQTT/network discovery

---

# 2. Home Screen Module

## Purpose

Primary dashboard for accessing all matches.

## Features

### Match Carousel

* Display matches as responsive cards in a horizontal carousel
* Include:

  * Match name
  * Teams
  * Match status (Live / Completed)
  * Start time
  * Thumbnail preview
  * Duration

### Navigation

* Previous/Next carousel buttons
* Smooth animated transitions

### Actions

* Start New Match
* Open Existing Match
* Resume Live Match
* Delete Match
* Search/Filter matches

---

# 3. Add Match / Match Setup Screen

## Purpose

Create and initialize a new live match session.

## Form Fields

* Match title
* Team A
* Team B
* Venue
* Overs format
* Match officials
* Camera selection
* Recording quality

## Workflow

1. User enters match details
2. User clicks **Start Match**
3. System:

   * Creates match session
   * Starts continuous background recording
   * Initializes sensor listeners
   * Connects to stump/bail hardware
   * Opens Live Match Recording screen

---

# 4. Realtime Sensor Integration

## Physical Hardware

System receives realtime data from:

* Smart stumps
* Bail displacement sensors
* Motion sensors
* LED wicket system

## Event Detection

When:

* Wicket moves
* Bail gets dislodged
* Sudden motion threshold is crossed

The system must:

* Capture precise timestamp
* Generate automatic timeline bookmark
* Store event metadata
* Trigger optional LED/visual indicators
* Push live notification to UI

## Event Metadata

Store:

* Timestamp
* Event type
* Sensor ID
* Confidence level
* Snapshot thumbnail
* Replay clip reference

---

# 5. Continuous Recording Engine

## Critical Requirement

Video recording must NEVER stop during replay navigation.

### Example

If the user:

* Rewinds timeline
* Watches old footage
* Scrubs replay

The backend recording pipeline must continue recording live footage independently in the background.

## Architecture Recommendation

Use:

* Dual-stream pipeline
* Separate:

  * Live recording buffer
  * Playback stream
* Circular buffer for instant replay

---

# 6. Match View Module

## Purpose

Review recorded events using timeline-based navigation.

## Features

### Video Playback

* Play/Pause
* Forward/Rewind
* Frame stepping
* Fullscreen

### Timeline

* Timeline scrubber
* Event markers/bookmarks
* Zoomable timeline
* Color-coded event indicators

### Replay Controls

* Slow-motion replay
* Multi-speed playback
* Instant jump to event

### Event Navigation

* Click marker → jump to exact timestamp
* Event list sidebar
* Filter by event type

### Replay Synchronization

* Sensor event sync with video timestamps

---

# 7. Live Match Recording Module

## Purpose

Primary realtime operational control center.

## Components

### Match Information

* Teams
* Current innings
* Match timer
* Recording duration

### Live System Status

* Recording state
* Storage usage
* Stream health
* CPU/GPU utilization

### Camera Status

* Connected cameras
* FPS
* Resolution
* Bitrate
* Signal health

### Connected Stumps/Sensors

* Online/offline state
* Battery status
* Signal strength
* MQTT connectivity

### Recent Events Feed

Live updating event stream showing:

* Bail removed
* Wicket impact
* Sensor disconnected
* Motion alerts

### Live Notifications

Realtime popup notifications for:

* Wicket detected
* Device failure
* Recording interruption
* Network issues

---

# 8. Match Completion Workflow

## End Match Action

When user clicks **End Match**:

System must:

* Stop recording safely
* Finalize video encoding
* Save metadata
* Store event markers
* Generate preview thumbnail
* Move match into archived matches section

## Storage

Each match should contain:

* Full video
* Timeline markers
* Sensor logs
* Replay data
* Match metadata

---

# 9. Archived Match Viewer

## Features

* View old matches
* Replay timeline
* Event bookmarks
* Slow motion analysis
* Search/filter archived matches
* Export clips

---

# 10. Device Management Module

## Purpose

Manage hardware devices and network connectivity.

## Features

### Device Dashboard

Display:

* Device name
* Device type
* IP address
* MQTT topic
* Online/offline state
* Firmware version

### Add Device

* Scan local network
* Auto-discover compatible devices
* MQTT-based discovery
* Manual IP entry

### Device Configuration

* Assign device roles
* Configure MQTT topics
* Rename devices
* Update firmware

### Connectivity

* MQTT broker integration
* Auto reconnect
* Heartbeat monitoring
* Signal diagnostics

---

# 11. Settings Module

## LED Settings

User should control:

* LED brightness
* Color mode
* Flash duration
* Blink pattern

## Recording Settings

* Resolution
* FPS
* Compression quality
* Storage path

## Replay Settings

* Slow motion factor
* Default replay duration
* Buffer size

## Network Settings

* MQTT broker configuration
* Port
* Authentication
* Device discovery timeout

---

# 12. Technical Requirements

## Realtime Requirements

* Low latency event processing
* Accurate timestamp synchronization
* Continuous recording without interruption
* Realtime UI updates

## Suggested Technologies

### Frontend

* React / Next.js / Electron
* TailwindCSS
* Video.js / custom player

### Backend

* Node.js / Go / Python
* WebSocket server
* MQTT broker integration

### Video Pipeline

* FFmpeg / GStreamer
* Circular replay buffer
* Hardware accelerated encoding

### Database

* PostgreSQL / MongoDB
* Event indexing
* Match metadata storage

---

# 13. Recommended System Architecture

## Services

* Recording Service
* Replay Service
* Sensor Event Service
* MQTT Communication Service
* Match Management Service
* Device Discovery Service

## Communication

* MQTT → sensor communication
* WebSocket → realtime frontend updates
* REST APIs → match management

---

# 14. Key Functional Requirements

The system MUST support:

* Continuous background recording
* Realtime wicket detection
* Timeline bookmark generation
* Instant replay navigation
* Replay while recording
* Archived match playback
* MQTT-based device communication
* Device auto discovery
* Slow motion replay
* Realtime notifications
* Sensor/video synchronization
