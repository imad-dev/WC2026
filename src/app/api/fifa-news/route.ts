import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const res = await fetch('https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/news', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });
    
    if (!res.ok) throw new Error(`FIFA servers returned ${res.status}`);
    const html = await res.text();
    const $ = cheerio.load(html);
    
    const items: any[] = [];
    const seenLinks = new Set();
    
    // Target any link that goes to a specific news article
    $('a').each((i, el) => {
      const href = $(el).attr('href') || '';
      
      // Match FIFA's typical news URL patterns
      if (href.includes('/news/')) {
        const fullLink = href.startsWith('http') ? href : `https://www.fifa.com${href}`;
        if (seenLinks.has(fullLink)) return;
        
        // Extract a meaningful title
        const titleText = $(el).text().replace(/\s+/g, ' ').trim();
        const ariaLabel = $(el).attr('aria-label') || '';
        const title = titleText.length > 15 ? titleText : ariaLabel;
        
        if (!title || title.length < 15 || title.toLowerCase() === 'read more') return;
        
        // Attempt to find thumbnail inside the link element or its parent container
        let thumbnail = $(el).find('img').attr('src') || $(el).find('picture source').attr('srcset');
        if (!thumbnail) {
          // Look up the DOM tree to a common container and check for images
          thumbnail = $(el).closest('article, div[class*="card"], li, div[class*="item"]').find('img').first().attr('src');
        }
        
        if (thumbnail && thumbnail.startsWith('/')) {
            thumbnail = `https://www.fifa.com${thumbnail}`;
        }
        
        // Parse the image URL up to any query string to get highest res
        if (thumbnail && thumbnail.includes('?')) {
            thumbnail = thumbnail.split('?')[0];
        }
        
        seenLinks.add(fullLink);
        items.push({
          title,
          link: fullLink,
          pubDate: new Date().toISOString(), // Fallback (FIFA rarely puts semantic dates in DOM)
          description: title,
          thumbnail: thumbnail || 'https://wc2026.games/og-image.png',
          author: 'FIFA Official',
          categories: ['FIFA World Cup 2026'],
          source: 'FIFA.com'
        });
      }
    });

    return NextResponse.json({ items: items.slice(0, 15) });
  } catch (err: any) {
    console.error('FIFA Scraper Error:', err);
    // Return empty array gracefully so UI doesn't crash
    return NextResponse.json({ items: [] });
  }
}
