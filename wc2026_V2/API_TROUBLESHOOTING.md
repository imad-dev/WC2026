# API Troubleshooting Guide

## Current Issues & Solutions

### ❌ Problem: Rate Limit & CORS Errors

The API-Football API has two main issues:

1. **Rate Limit**: 10 requests per minute (free tier)
2. **CORS Error**: Browser blocks direct API calls (requires server-side proxy)

### ✅ Solutions Implemented

#### 1. Smart Caching System
- **Live matches**: Cached for 30 seconds
- **Standings**: Cached for 5 minutes
- **Top scorers**: Cached for 10 minutes
- **Fixtures**: Cached for 10 minutes

This reduces API calls significantly!

#### 2. Rate Limiting
- Max 8 requests per minute (leaving safety buffer)
- Automatic queue management
- Warning messages when limit reached

#### 3. Graceful Fallback
- Uses mock World Cup 2026 data when API fails
- Status banner shows when using demo data
- No broken UI - everything works smoothly

#### 4. Better Error Messages
- Clear status banner explaining the issue
- Console logs with emoji indicators
- Debug panel to test API manually

### 🔧 How to Fix CORS Issue (Recommended)

The CORS error happens because browsers block direct API calls. You need a server-side proxy:

#### Option A: Use Vite Proxy (Development)

Create `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://v3.football.api-sports.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('x-rapidapi-key', 'c63785e482459b9f7a1d90138ca920c0');
            proxyReq.setHeader('x-rapidapi-host', 'v3.football.api-sports.io');
          });
        },
      },
    },
  },
});
```

Then update `src/services/api.ts`:
```typescript
// Change from:
const API_FOOTBALL_BASE = 'https://v3.football.api-sports.io';

// To:
const API_FOOTBALL_BASE = '/api';
```

#### Option B: Build a Backend Proxy

Create a simple Node.js/Express server:

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

app.get('/api/*', async (req, res) => {
  try {
    const response = await axios.get(
      `https://v3.football.api-sports.io${req.path.replace('/api', '')}${req.url.split('?')[1] ? '?' + req.url.split('?')[1] : ''}`,
      {
        headers: {
          'x-rapidapi-key': 'c63785e482459b9f7a1d90138ca920c0',
          'x-rapidapi-host': 'v3.football.api-sports.io'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => console.log('Proxy running on port 3001'));
```

#### Option C: Use a CORS Proxy Service (Quick Test)

For testing only (not production):
```typescript
const API_FOOTBALL_BASE = 'https://cors-anywhere.herokuapp.com/https://v3.football.api-sports.io';
```

⚠️ **Warning**: Public CORS proxies are unreliable and insecure. Don't use in production!

### 📊 Current Status

With the current setup:
- ✅ Website works perfectly with demo data
- ✅ Graceful error handling
- ✅ Smart caching reduces API calls
- ✅ Rate limiting prevents overuse
- ⚠️ Real API blocked by CORS (needs proxy)

### 🎯 Recommended Workflow

**For Development:**
1. Use mock data (current setup works great!)
2. Implement Vite proxy if you need real data
3. Use debug panel to test API calls

**For Production:**
1. Build a backend API proxy (Option B above)
2. Deploy proxy alongside your frontend
3. Configure environment variables for API keys

### 🐛 Debugging

**Check if API is working:**
1. Open browser DevTools Console
2. Look for emoji logs:
   - 💾 = Cache operations
   - 🔴 = Live match calls
   - 📊 = Standings calls
   - ⚽ = Top scorers calls
   - ✅ = Success
   - ❌ = Error
   - ⏳ = Rate limit warning

**Clear cache:**
```javascript
// In browser console:
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### 📈 API Upgrade Options

Free tier is limiting. Consider upgrading:

- **API-Football Pro**: $14.99/mo - Unlimited requests
- **Alternative APIs**:
  - The Sports DB (free, no authentication)
  - Football-Data.org (free tier: 10 calls/min)
  - RapidAPI Sports (various tiers)

### 💡 Current Demo Data

The mock data shows:
- Morocco 🇲🇦 in Group F (2nd place, 7 points)
- Vinicius Jr. leading scorers (7 goals)
- Live semifinal: Morocco 2-1 France
- Premier League 2024 standings/scorers (when API works)

This provides a great preview of how the site will look with real World Cup 2026 data!
