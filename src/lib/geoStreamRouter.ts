/**
 * Geo-based stream routing.
 *
 * In production (Vercel), the country code comes from `x-vercel-ip-country`.
 * On the client side, we call a thin API route `/api/geo` that forwards
 * that header value back to the browser.
 */

export interface StreamConfig {
  embedUrl: string;
  channelName: string;
  note: string;
  region: string;
}

// ── Channel IDs ────────────────────────────────────────────────

const BEIN_MENA_CHANNEL = 'UCnMBNOyoFGLGHRlMSHjLSEg';
const TELEMUNDO_CHANNEL = 'UCRwA9bDCxhdlJCUy3BnbflA';
const FIFA_CHANNEL      = 'UCWOA1ZGiwLbDQJk2xcd9BSg';

// MENA ISO codes
const MENA_COUNTRIES = new Set([
  'DZ', 'BH', 'EG', 'IQ', 'JO', 'KW', 'LB', 'LY', 'MA', 'OM',
  'PS', 'QA', 'SA', 'SD', 'SY', 'TN', 'AE', 'YE', 'MR', 'SO', 'DJ',
]);

// Latin American ISO codes
const LATAM_COUNTRIES = new Set([
  'AR', 'BO', 'BR', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'SV',
  'GT', 'HN', 'MX', 'NI', 'PA', 'PY', 'PE', 'PR', 'UY', 'VE',
]);

// European free-to-air broadcasters
const EUROPE_BROADCASTERS: Record<string, { channel: string; name: string }> = {
  GB: { channel: 'UC_x5XG1OV2P6uZZ5FSM9Ttw', name: 'BBC iPlayer' },
  DE: { channel: 'UCmphdsp_kDIgPEjPFNKMYyg', name: 'ARD' },
  FR: { channel: 'UCSTCbBiNIJXSMDSM3YaTkjQ', name: 'TF1' },
  ES: { channel: 'UCJFp8uSYCjXOMnkUyb3CQ3Q', name: 'RTVE' },
  IT: { channel: 'UC5GUEsQbMGBJMA8KYHguyEA', name: 'RAI' },
  NL: { channel: 'UCo8bcnLyZH8tBIH9V1mLgqQ', name: 'NOS' },
  PT: { channel: 'UC2BT8oNWpWmYHhHBLSP8IEg', name: 'RTP' },
};

// ── Resolver ───────────────────────────────────────────────────

export function resolveStreamConfig(countryCode: string | null): StreamConfig {
  const cc = (countryCode || '').toUpperCase().trim();

  // MENA → beIN Sports MENA
  if (MENA_COUNTRIES.has(cc)) {
    return {
      embedUrl: `https://www.youtube.com/live_stream?channel=${BEIN_MENA_CHANNEL}`,
      channelName: 'beIN Sports MENA',
      note: 'Official MENA broadcast partner',
      region: 'MENA',
    };
  }

  // Latin America → Telemundo
  if (LATAM_COUNTRIES.has(cc)) {
    return {
      embedUrl: `https://www.youtube.com/live_stream?channel=${TELEMUNDO_CHANNEL}`,
      channelName: 'Telemundo Deportes',
      note: 'Broadcast en español',
      region: 'Latin America',
    };
  }

  // USA → Telemundo (free English on Peacock is gated, Telemundo Spanish is FTA)
  if (cc === 'US') {
    return {
      embedUrl: `https://www.youtube.com/live_stream?channel=${TELEMUNDO_CHANNEL}`,
      channelName: 'Telemundo Deportes',
      note: 'Free Spanish-language broadcast',
      region: 'United States',
    };
  }

  // Canada → TSN (no free YT live, fallback to FIFA)
  if (cc === 'CA') {
    return {
      embedUrl: `https://www.youtube.com/live_stream?channel=${FIFA_CHANNEL}`,
      channelName: 'FIFA Official',
      note: 'TSN/RDS holds rights — check local listings',
      region: 'Canada',
    };
  }

  // Europe per-country
  if (EUROPE_BROADCASTERS[cc]) {
    const b = EUROPE_BROADCASTERS[cc];
    return {
      embedUrl: `https://www.youtube.com/live_stream?channel=${b.channel}`,
      channelName: b.name,
      note: 'Free-to-air broadcaster',
      region: cc,
    };
  }

  // Default fallback → FIFA Official YouTube
  return {
    embedUrl: `https://www.youtube.com/live_stream?channel=${FIFA_CHANNEL}`,
    channelName: 'FIFA Official',
    note: 'Global fallback stream',
    region: cc || 'Unknown',
  };
}
