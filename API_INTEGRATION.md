# API Integration Guide

This World Cup 2026 stats website is now integrated with real football data APIs.

## Available APIs

### 1. API-Football (v3.football.api-sports.io)
- **API Key**: `c63785e482459b9f7a1d90138ca920c0`
- **Base URL**: `https://v3.football.api-sports.io`
- **Rate Limit**: 100 requests/day (Free tier)
- **Endpoints Used**:
  - `/fixtures` - Get match fixtures
  - `/fixtures?live=all` - Get live matches
  - `/standings` - Get league standings
  - `/players/topscorers` - Get top scorers

### 2. WC2026 API (api.wc2026api.com)
- **API Key**: `wc26_LBdWanqpvW8YW4CC2B7hFU`
- **Base URL**: `https://api.wc2026api.com`
- **Rate Limit**: 100 requests/day
- **Header**: `Authorization: Bearer wc26_LBdWanqpvW8YW4CC2B7hFU`

### 3. BallDontLie API
- **API Key**: `1093113c-9c70-49a1-9390-750777c1dc86`
- **Base URL**: `https://api.balldontlie.io`

## Implementation

### Service Layer (`/src/services/api.ts`)
Contains all API fetch functions with proper error handling:
- `fetchFixtures()` - Get match fixtures
- `fetchLiveMatches()` - Get live/ongoing matches
- `fetchStandings()` - Get group standings
- `fetchTopScorers()` - Get top scorers leaderboard
- Transformation functions to convert API data to our UI format

### Custom Hooks (`/src/hooks/useFootballData.ts`)
React hooks that manage API calls and state:
- `useLiveMatches()` - Auto-refreshes every 60 seconds
- `useFixtures()` - Fetches all fixtures
- `useStandings()` - Fetches group standings
- `useTopScorers()` - Fetches top scorers

### Fallback System
The app uses a smart fallback system:
1. **API Data First**: Attempts to fetch from APIs
2. **Mock Data Fallback**: If API fails or rate limited, uses mock data from `/src/data/mockData.ts`
3. **Loading States**: Shows "Loading..." while fetching
4. **Error Handling**: Gracefully handles errors without breaking the UI

## Usage in Components

```tsx
// Example: Using the hooks in a component
import { useStandings } from '../hooks/useFootballData';

function MyComponent() {
  const { standings, loading, error } = useStandings();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{/* Use standings data */}</div>;
}
```

## API Parameters

### League IDs
- **Premier League: `39`** (default - most reliable data)
- World Cup: `1` (not available in free tier for 2026)
- La Liga: `140`
- Champions League: `2`

### Season
- **Current season: `2024`** (default - free tier supports 2022-2024 only)
- Free tier limitation: Cannot access 2025 or 2026 data

## Rate Limiting

⚠️ **Important**: The free tier has limited requests:
- API-Football: 100 requests/day
- WC2026 API: 100 requests/day

The app implements:
- **Smart Caching**: Data is fetched once and cached in React state
- **Auto-refresh**: Live matches refresh every 60 seconds only
- **Fallback Data**: Mock data ensures the app works even when rate limited

## Testing the API

To test if the APIs are working:
1. Open browser DevTools Console
2. Check for API requests in Network tab
3. Look for console logs showing API responses
4. If you see mock data, it means the API is rate limited or unavailable

## Upgrading APIs

To get more requests, consider upgrading:
- **API-Football Pro**: Unlimited requests, more endpoints
- **WC2026 Pro**: Higher rate limits

Update the API keys in `/src/services/api.ts` if you upgrade.
