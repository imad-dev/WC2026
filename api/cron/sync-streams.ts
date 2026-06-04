/**
 * Vercel Serverless Cron — /api/cron/sync-streams
 *
 * Runs every 15 minutes.
 * Searches YouTube Data API v3 for a current live stream
 * on the beIN MENA channel → upserts into wc2026_config.
 *
 * Env vars required:
 *   - YOUTUBE_DATA_API_KEY
 *   - CRON_SECRET
 *   - SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const BEIN_CHANNEL_ID = 'UCnMBNOyoFGLGHRlMSHjLSEg';

interface YouTubeSearchItem {
  id: { videoId: string };
  snippet: {
    title: string;
    liveBroadcastContent: 'live' | 'upcoming' | 'none';
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ── Auth ──
  const secret = req.headers['authorization']?.replace('Bearer ', '') || req.headers['x-cron-secret'];
  if (secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Search for live videos on beIN MENA channel
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    searchUrl.searchParams.set('part', 'snippet');
    searchUrl.searchParams.set('channelId', BEIN_CHANNEL_ID);
    searchUrl.searchParams.set('eventType', 'live');
    searchUrl.searchParams.set('type', 'video');
    searchUrl.searchParams.set('maxResults', '1');
    searchUrl.searchParams.set('key', process.env.YOUTUBE_DATA_API_KEY!);

    const ytRes = await fetch(searchUrl.toString());

    if (!ytRes.ok) {
      throw new Error(`YouTube API error: ${ytRes.status}`);
    }

    const ytData = await ytRes.json();
    const items: YouTubeSearchItem[] = ytData.items || [];

    let videoId: string | null = null;

    if (items.length > 0 && items[0].snippet.liveBroadcastContent === 'live') {
      videoId = items[0].id.videoId;
    }

    // Upsert into wc2026_config
    const { error } = await supabase
      .from('wc2026_config')
      .upsert(
        {
          key: 'bein_live_video_id',
          value: videoId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );

    if (error) throw error;

    return res.status(200).json({
      success: true,
      bein_live_video_id: videoId,
      found: items.length > 0,
    });
  } catch (err: any) {
    console.error('sync-streams error:', err);
    return res.status(500).json({ error: err.message });
  }
}
