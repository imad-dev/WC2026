import * as cheerio from 'cheerio';

async function test() {
  try {
    const res = await fetch('https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/news', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });
    const html = await res.text();
    console.log("HTML length:", html.length);
    const $ = cheerio.load(html);
    
    let found = 0;
    $('a').each((i, el) => {
      const href = $(el).attr('href') || '';
      console.log("A tag href:", href);
      if (href.includes('news') || href.includes('article') || href.includes('/en/')) {
        found++;
      }
    });
    console.log("Total matched links:", found);
    
    // Dump script tags maybe the content is hydrated
    $('script').each((i, el) => {
        const scriptId = $(el).attr('id');
        if (scriptId) console.log("Script ID:", scriptId);
    });
  } catch (e) {
    console.error(e);
  }
}
test();
