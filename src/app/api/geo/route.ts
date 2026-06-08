import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/geo
 * Returns the visitor's country code from Vercel's edge network.
 */
export function GET(request: NextRequest) {
  const country = request.headers.get('x-vercel-ip-country') || '';

  return NextResponse.json(
    { country },
    {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    }
  );
}
