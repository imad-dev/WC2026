import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Protect the cron route with a simple secret key
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Fetch players that don't have a photo but have an api_player_id
    const { data: players, error: fetchError } = await supabaseAdmin
      .from('wc2026_players')
      .select('id, api_player_id')
      .is('photo_url', null)
      .not('api_player_id', 'is', null)
      .limit(50); // limit batch size

    if (fetchError) {
      console.error('Error fetching players:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!players || players.length === 0) {
      return NextResponse.json({ message: 'No players to update' });
    }

    let updatedCount = 0;

    // 2. Loop through players and update photos based on the predictable API-Football format
    // Real implementation could also hit the API-Football endpoint if we needed other data, 
    // but the photo URL follows a static pattern: https://media.api-sports.io/football/players/{id}.png
    
    for (const player of players) {
      const photoUrl = `https://media.api-sports.io/football/players/${player.api_player_id}.png`;
      
      const { error: updateError } = await supabaseAdmin
        .from('wc2026_players')
        .update({ photo_url: photoUrl })
        .eq('id', player.id);

      if (updateError) {
        console.error(`Failed to update player ${player.id}:`, updateError);
      } else {
        updatedCount++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Processed ${players.length} players. Successfully updated ${updatedCount} photos.` 
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
