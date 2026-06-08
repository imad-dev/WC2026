import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    // FIFA.com is a React SPA with strict anti-bot protections, making direct Cheerio scraping impossible.
    // Instead, we use our backend to securely scrape and parse the BBC World Cup/Football feed via Cheerio's XML mode.
    const res = await fetch('https://feeds.bbci.co.uk/sport/football/rss.xml', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      }
    });
    
    if (!res.ok) throw new Error(`Feed server returned ${res.status}`);
    const xml = await res.text();
    const $ = cheerio.load(xml, { xmlMode: true });
    
    const items: any[] = [];
    
    $('item').each((i, el) => {
      if (i >= 15) return; // limit to 15 items
      
      const title = $(el).find('title').text();
      const link = $(el).find('link').text();
      const pubDate = $(el).find('pubDate').text();
      const description = $(el).find('description').text();
      
      // BBC uses <media:thumbnail url="...">
      let thumbnail = $(el).find('media\\:thumbnail').attr('url') || '';
      thumbnail = thumbnail.replace('/240/', '/480/'); // higher res
      
      items.push({
        title,
        link,
        pubDate,
        description,
        thumbnail: thumbnail || 'https://wc2026.games/og-image.png',
        author: 'BBC Sport',
        categories: [],
        source: 'BBC Sport'
      });
    });

    return NextResponse.json({ items });
  } catch (err: any) {
    console.error('Backend Scraper Error:', err);
    return NextResponse.json({ items: [] });
  }
}

