/**
 * Vercel Serverless Function — /api/geo
 *
 * Returns the visitor's country code from Vercel's edge network.
 * The `x-vercel-ip-country` header is injected automatically by Vercel.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const country = (req.headers['x-vercel-ip-country'] as string) || '';

  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
  res.status(200).json({ country });
}
