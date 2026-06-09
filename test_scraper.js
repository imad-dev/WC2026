const cheerio = require('cheerio');

async function test() {
  try {
    const res = await fetch('https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/news', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    const html = await res.text();
    console.log("HTML length:", html.length);
    const $ = cheerio.load(html);
    
    // Instead of /news/, try dumping all link hrefs briefly
    let found = 0;
    $('a').each((i, el) => {
      const href = $(el).attr('href') || '';
      if (href.includes('news') || href.includes('article')) {
        console.log("Found link:", href.substring(0, 50));
        found++;
      }
    });
    console.log("Total articles found:", found);
  } catch (e) {
    console.error(e);
  }
}
test();
