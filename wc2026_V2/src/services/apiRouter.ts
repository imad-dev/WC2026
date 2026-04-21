// Smart API Router - Tries multiple APIs in priority order
import { apiCache } from './apiCache';

export type ApiProvider = 'wc2026' | 'api-football' | 'balldontlie';

interface ApiConfig {
  name: ApiProvider;
  baseUrl: string;
  headers: Record<string, string>;
  supports: {
    worldCup2026: boolean;
    liveMatches: boolean;
    standings: boolean;
    topScorers: boolean;
    fixtures: boolean;
  };
  priority: number;
}

// API Configurations
export const API_CONFIGS: Record<ApiProvider, ApiConfig> = {
  'wc2026': {
    name: 'wc2026',
    baseUrl: 'https://api.wc2026api.com',
    headers: {
      'Authorization': 'Bearer wc26_LBdWanqpvW8YW4CC2B7hFU'
    },
    supports: {
      worldCup2026: true,
      liveMatches: true,
      standings: true,
      topScorers: true,
      fixtures: true
    },
    priority: 1 // Highest priority for WC2026 specific data
  },
  'api-football': {
    name: 'api-football',
    baseUrl: 'https://v3.football.api-sports.io',
    headers: {
      'x-rapidapi-key': 'c63785e482459b9f7a1d90138ca920c0',
      'x-rapidapi-host': 'v3.football.api-sports.io'
    },
    supports: {
      worldCup2026: false, // Free tier: only 2022-2024
      liveMatches: true,
      standings: true,
      topScorers: true,
      fixtures: true
    },
    priority: 2
  },
  'balldontlie': {
    name: 'balldontlie',
    baseUrl: 'https://api.balldontlie.io',
    headers: {
      'Authorization': 'Bearer 1093113c-9c70-49a1-9390-750777c1dc86'
    },
    supports: {
      worldCup2026: false, // NBA/NFL/MLB/EPL only
      liveMatches: true,
      standings: true,
      topScorers: true,
      fixtures: true
    },
    priority: 3
  }
};

// Get APIs sorted by priority for a specific data type
export function getApiPriority(dataType: keyof ApiConfig['supports']): ApiProvider[] {
  return Object.values(API_CONFIGS)
    .filter(api => api.supports[dataType])
    .sort((a, b) => a.priority - b.priority)
    .map(api => api.name);
}

// Try multiple APIs in sequence until one works
export async function fetchWithFallback(
  dataType: keyof ApiConfig['supports'],
  fetchFn: (config: ApiConfig) => Promise<any>
): Promise<{ data: any; provider: ApiProvider | null }> {
  const apis = getApiPriority(dataType);

  console.log(`🔄 Trying ${apis.length} APIs for ${dataType}:`, apis.join(' → '));

  for (const apiName of apis) {
    const config = API_CONFIGS[apiName];

    try {
      console.log(`🔌 Attempting ${config.name}...`);
      const data = await fetchFn(config);

      if (data && (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0)) {
        console.log(`✅ Success with ${config.name}!`);
        return { data, provider: apiName };
      }

      console.log(`⚠️ ${config.name} returned empty data, trying next...`);
    } catch (error: any) {
      console.log(`❌ ${config.name} failed:`, error.message);
      // Continue to next API
    }
  }

  console.log('❌ All APIs failed');
  return { data: null, provider: null };
}

// Smart cache key that includes provider
export function getCacheKey(provider: ApiProvider | null, baseKey: string): string {
  return provider ? `${provider}_${baseKey}` : baseKey;
}
