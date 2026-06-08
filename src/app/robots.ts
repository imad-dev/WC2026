import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        // Explicitly allow verified AI search crawlers
        userAgent: ['Googlebot', 'Bingbot', 'Applebot', 'GPTBot', 'ClaudeBot', 'PerplexityBot', 'anthropic-ai', 'Google-Extended', 'OAI-SearchBot'],
        allow: '/',
      },
      {
        // Block known aggressive scrapers
        userAgent: ['Bytespider', 'Amazonbot', 'DataForSeoBot', 'DotBot', 'MJ12bot', 'AhrefsBot', 'SemrushBot', 'PetalBot'],
        disallow: '/',
      },
    ],
    sitemap: 'https://wc2026.games/sitemap.xml',
    host: 'https://wc2026.games',
  };
}
