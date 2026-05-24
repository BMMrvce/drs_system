
  # Build Step by Step

  This is a code bundle for Build Step by Step. The original project is available at https://www.figma.com/design/u3X7qmkfNTbYDZjX2Tot4c/Build-Step-by-Step.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  
# Build Step by Step

An interactive web application skeleton for managing live matches, device integration, and match playback. This repository provides a Vite + React (TypeScript) frontend with UI primitives, services for MQTT and recording, and screens for match management.

## Table of contents
- **Overview:** Project purpose and features
- **Tech Stack:** Libraries and tools used
- **Quick Start:** Install and run locally
- **Project Structure:** Key files and folders
- **Services & Configuration:** MQTT, recorder, and env notes
- **Development:** Scripts and tips
- **Contributing & License:** How to help

## Overview
This project is a frontend application intended for live-match workflows (create, view, record, export). It includes:
- Live match screens and playback UI
- Device discovery/management via MQTT
- Recording/exporting match data
- Reusable UI components and layout primitives

## Tech Stack
- **Framework:** React + TypeScript
- **Bundler:** Vite
- **Package manager:** pnpm (works with npm/yarn)
- **UI:** Custom shadcn-style components in `src/app/ui`

## Quick start
Prerequisites: Node.js (16+ recommended) and either `pnpm`, `npm`, or `yarn`.

Install dependencies:
```bash
pnpm install
# or
npm install
```

Start development server:
```bash
pnpm dev
# or
npm run dev
```

Build for production:
```bash
pnpm build
# or
npm run build
```

Preview the production build:
```bash
pnpm preview
# or
npm run preview
```

## Project structure (key files)
- **Entry:** [src/main.tsx](src/main.tsx)
- **App shell:** [src/app/App.tsx](src/app/App.tsx)
- **Screens:** [src/app/screens](src/app/screens)
- **Components:** [src/app/components](src/app/components)
- **UI primitives:** [src/app/ui](src/app/ui)
- **Context:** [src/app/context/AppContext.tsx](src/app/context/AppContext.tsx)
- **Services:** [src/app/services/mqttClient.ts](src/app/services/mqttClient.ts) and [src/app/services/recorder.ts](src/app/services/recorder.ts)
- **Hooks:** [src/app/hooks/useRealtimeEvents.ts](src/app/hooks/useRealtimeEvents.ts)
- **Types:** [src/app/types/index.ts](src/app/types/index.ts)
- **Styles:** [src/styles](src/styles)

Refer to the `src/app/components` and `src/app/screens` folders for feature implementations like live match handling, device management, and exporting.

## Services & configuration
- MQTT client implementation: [src/app/services/mqttClient.ts](src/app/services/mqttClient.ts). Configure broker URL and topics inside this file or via environment variables that you add for your deployment.
- Recorder/export logic: [src/app/services/recorder.ts](src/app/services/recorder.ts) — handles local recording and export of match data.
- App-wide state: [src/app/context/AppContext.tsx](src/app/context/AppContext.tsx)

There is no committed `.env` in the repo. If your deployment requires secrets or endpoints, add a `.env` or `env.local` and reference them in `vite.config.ts` or the relevant service files.

## Development notes
- Use the UI primitives in `src/app/ui` when adding or refactoring components to keep styling consistent.
- Mock/test data is available at [src/app/data/mockData.ts](src/app/data/mockData.ts) for quick UI testing.
- Figma source reference: https://www.figma.com/design/u3X7qmkfNTbYDZjX2Tot4c/Build-Step-by-Step

## Scripts (from package.json)
- **dev:** start dev server (`pnpm dev` / `npm run dev`)
- **build:** create production build
- **preview:** locally preview production build

Run the exact scripts defined in [package.json](package.json) for the canonical commands.

## Contributing
- Fork the repo, work on a feature branch, and open PRs with clear descriptions.
- Add or update documentation in `README.md` when behavior or public APIs change.

## License & contact
Specify your project's license here (e.g., MIT). For questions, add contact info or create an issue in the repository.

## Where to look next
- To add a new screen or feature, start from [src/main.tsx](src/main.tsx) → [src/app/App.tsx](src/app/App.tsx) and follow existing patterns in `src/app/screens`.
- To integrate a real MQTT broker, update [src/app/services/mqttClient.ts](src/app/services/mqttClient.ts).

----
If you'd like, I can also:
- Add a short CONTRIBUTING.md and code of conduct.
- Create example `.env.example` with the expected variables.
- Run the dev server here and verify the app starts.
