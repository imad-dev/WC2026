import { useState, useEffect } from 'react';

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  thumbnail: string;
  author: string;
  categories: string[];
  source?: string;
}

export const NEWS_TABS = [
  { key: 'all',      label: 'All News',  flag: '🌍', keywords: [] },
  { key: 'wc2026',   label: 'WC 2026',   flag: '⚽', keywords: ['world cup', '2026', 'fifa', 'wc2026', 'world cup 2026'] },
  { key: 'morocco',  label: 'Morocco',   flag: '🇲🇦', keywords: ['morocco', 'atlas lions', 'hakimi', 'ouahbi', 'maroc', 'mazraoui'] },
  { key: 'brazil',   label: 'Brazil',    flag: '🇧🇷', keywords: ['brazil', 'brasil', 'vinicius', 'raphinha', 'seleção'] },
  { key: 'argentina',label: 'Argentina', flag: '🇦🇷', keywords: ['argentina', 'messi', 'scaloni', 'albiceleste', 'álvarez'] },
  { key: 'france',   label: 'France',    flag: '🇫🇷', keywords: ['france', 'mbappé', 'mbappe', 'les bleus', 'griezmann'] },
  { key: 'england',  label: 'England',   flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', keywords: ['england', 'kane', 'bellingham', 'three lions', 'tuchel'] },
  { key: 'germany',  label: 'Germany',   flag: '🇩🇪', keywords: ['germany', 'deutschland', 'nagelsmann', 'wirtz', 'musiala'] },
  { key: 'spain',    label: 'Spain',     flag: '🇪🇸', keywords: ['spain', 'españa', 'de la fuente', 'yamal', 'pedri'] },
] as const;

export type NewsTabKey = typeof NEWS_TABS[number]['key'];

const RSS_URL = 'https://feeds.bbci.co.uk/sport/football/rss.xml';
// We use allorigins to bypass CORS, since rss2json API often throws 422 errors for BBC feeds
const API = `https://api.allorigins.win/get?url=${encodeURIComponent(RSS_URL)}`;

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}

function filterByTab(items: NewsItem[], tabKey: string): NewsItem[] {
  const tab = NEWS_TABS.find(t => t.key === tabKey);
  if (!tab || tab.keywords.length === 0) return items;
  const keywords = tab.keywords as readonly string[];
  return items.filter(item => {
    const text = (item.title + ' ' + item.description).toLowerCase();
    return keywords.some(kw => text.includes(kw));
  });
}

// Cache to avoid re-fetching
let cachedItems: NewsItem[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 min

export function useFootballNews(tabKey: NewsTabKey = 'all') {
  const [allItems, setAllItems] = useState<NewsItem[]>(cachedItems || []);
  const [loading, setLoading] = useState(!cachedItems);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const now = Date.now();
    if (cachedItems && now - cacheTime < CACHE_TTL) {
      setAllItems(cachedItems);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(API)
      .then(r => r.json())
      .then(data => {
        if (!data.contents) throw new Error('Empty feed');
        
        // Parse the raw XML string directly in the browser
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.contents, "text/xml");
        const itemNodes = xmlDoc.querySelectorAll("item");
        
        const items: NewsItem[] = Array.from(itemNodes).map(node => {
          const title = node.querySelector("title")?.textContent || '';
          const link = node.querySelector("link")?.textContent || '';
          const pubDate = node.querySelector("pubDate")?.textContent || '';
          const description = node.querySelector("description")?.textContent || '';
          
          // BBC uses <media:thumbnail>
          let thumbnail = '';
          const mediaThumb = node.getElementsByTagNameNS("*", "thumbnail")[0];
          if (mediaThumb) {
            thumbnail = mediaThumb.getAttribute("url") || '';
          }

          return {
            title,
            link,
            pubDate,
            description: stripHtml(description),
            thumbnail: thumbnail.replace('/240/', '/480/'), // Get higher res image from BBC if possible
            author: 'BBC Sport',
            categories: [],
            source: 'BBC Sport'
          };
        });

        cachedItems = items;
        cacheTime = Date.now();
        setAllItems(items);
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        console.error('RSS Fetch error:', err);
        setError('Could not load news. Check your connection.');
        setLoading(false);
      });
  }, []);

  const filtered = filterByTab(allItems, tabKey);
  return { items: filtered, loading, error };
}
