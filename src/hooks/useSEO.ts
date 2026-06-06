import { useEffect } from 'react';

/**
 * SEO hook for Vite SPA — dynamically updates document head
 * (title, meta description, OG tags, canonical, robots)
 * on each route change.
 */
export interface SEOMeta {
  title: string;
  description: string;
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  ogImage?: string;
  twitterCard?: string;
  robots?: string;
}

function setMeta(property: string, content: string, isProperty = false) {
  const attr = isProperty ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = url;
}

export function useSEO(meta: SEOMeta) {
  useEffect(() => {
    // Title
    document.title = meta.title;

    // Meta description
    setMeta('description', meta.description);

    // Robots
    setMeta('robots', meta.robots || 'index, follow');

    // Open Graph
    setMeta('og:title', meta.ogTitle || meta.title, true);
    setMeta('og:description', meta.ogDescription || meta.description, true);
    setMeta('og:url', meta.canonical, true);
    setMeta('og:type', meta.ogType || 'website', true);
    setMeta('og:site_name', 'WC2026.games', true);
    if (meta.ogImage) {
      setMeta('og:image', meta.ogImage, true);
    }

    // Twitter
    setMeta('twitter:card', meta.twitterCard || 'summary_large_image');
    setMeta('twitter:title', meta.ogTitle || meta.title);
    setMeta('twitter:description', meta.ogDescription || meta.description);

    // Canonical
    setCanonical(meta.canonical);
  }, [meta.title, meta.description, meta.canonical, meta.ogTitle, meta.ogDescription, meta.ogType, meta.ogImage, meta.twitterCard, meta.robots]);
}
