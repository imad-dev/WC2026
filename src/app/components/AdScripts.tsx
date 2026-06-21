'use client';

import Script from 'next/script';
import { useGeo } from '@/hooks/useSupabase';

export function AdScripts() {
  const country = useGeo();
  
  // Do not render ads for Spanish users
  if (country === 'ES') return null;

  return (
    <>
      {/* Google AdSense */}
      <Script
        id="adsense"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1999755644541481"
        crossOrigin="anonymous"
        strategy="lazyOnload"
      />
      {/* Popunder Script */}
      <Script
        id="popunder"
        src="https://pl29770201.effectivecpmnetwork.com/5a/71/87/5a71872f0b95ba2ae33f1ce0e281902b.js"
        strategy="lazyOnload"
      />
      {/* Social Bar Script */}
      <Script
        id="social-bar"
        src="https://pl29770203.effectivecpmnetwork.com/34/94/04/349404a6f693ba2d8907d7b787e9513e.js"
        strategy="lazyOnload"
      />
    </>
  );
}
