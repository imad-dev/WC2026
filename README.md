# WC2026 Stats - World Cup 2026 Dashboard

## Overview
WC2026 Stats is a React + TypeScript dashboard for World Cup 2026 coverage with live scores, group standings, top scorers, and tournament KPIs.

Screenshot: add your deployed dashboard screenshot URL here.

## Tech Stack
- React 18 + TypeScript + Vite 6 + Tailwind v4 + shadcn/Radix UI
- TanStack Query for server state + caching
- Zustand for UI-only state
- APIs: wc2026api.com (primary), API-Football RapidAPI (fallback), balldontlie.io

## Local Setup
1. Clone the repository.
2. Copy environment template: `cp .env.example .env.local`
3. Fill all 3 keys in `.env.local`:
- `VITE_API_FOOTBALL_KEY`
- `VITE_WC2026_API_KEY`
- `VITE_BALLDONTLIE_KEY`
4. Install dependencies: `npm install`
5. Start dev server: `npm run dev`

## Available Scripts
| Script | Description |
| --- | --- |
| npm run dev | Dev server (localhost:5173) |
| npm run build | Production build + type-check |
| npm run preview | Preview production build |
| npm run test | Run all tests |
| npm run lint | ESLint check |
| npm run ci | Full CI pipeline |

## Architecture
src/
- api/ : API modules, orchestrator, mock fallback
- hooks/ : TanStack Query hooks
- store/ : Zustand UI store
- types/ : shared TypeScript interfaces
- app/components/ : React components and UI primitives
- utils/ : helpers and formatters
- lib/ : axios instance and query client

## Data Strategy
- Primary source: wc2026api.com
- Fallback source: API-Football
- Final fallback: local MOCK_DASHBOARD_DATA
- Live polling: every 30s, paused when tab is hidden

## Deployment
Recommended target: Vercel.
Required env vars:
- VITE_API_FOOTBALL_KEY
- VITE_WC2026_API_KEY
- VITE_BALLDONTLIE_KEY

## Security
- API keys only in environment variables
- DOMPurify available for sanitizing dynamic HTML
- npm audit gate in CI
- Security headers configured in vercel.json
