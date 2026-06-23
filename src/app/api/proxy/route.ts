import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return new NextResponse('Missing url', { status: 400 });

  try {
    const targetUrl = new URL(url);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Connection': 'keep-alive',
        'Referer': targetUrl.origin + '/',
        'Origin': targetUrl.origin,
      }
    });

    if (!response.ok) {
      return new NextResponse(`Failed to fetch: ${response.statusText}`, { status: response.status });
    }

    // If it's a media segment (e.g. .ts), pipe it back
    if (url.endsWith('.ts')) {
      // Return the media stream directly
      return new NextResponse(response.body, {
        headers: {
          'Content-Type': response.headers.get('content-type') || 'video/MP2T',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Otherwise, assume it's a playlist (.m3u8)
    const content = await response.text();
    const finalUrl = response.url; // The actual URL after redirects
    const baseUrl = new URL(finalUrl);

    const lines = content.split('\n');
    const rewrittenLines = lines.map(line => {
      line = line.trim();
      if (!line || line.startsWith('#')) return line;

      let absoluteUrl = line;
      if (!line.startsWith('http://') && !line.startsWith('https://')) {
        absoluteUrl = new URL(line, baseUrl.href).href;
      }

      // Proxy the segments too to avoid Mixed Content / Self-Signed Cert errors
      const reqUrl = new URL(req.url);
      return `${reqUrl.origin}/api/proxy?url=${encodeURIComponent(absoluteUrl)}`;
    });

    return new NextResponse(rewrittenLines.join('\n'), {
      headers: {
        'Content-Type': 'application/vnd.apple.mpegurl',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error: any) {
    return new NextResponse(`Proxy Error: ${error.message}`, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
}
