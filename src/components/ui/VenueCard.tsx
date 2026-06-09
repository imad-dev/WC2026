'use client';

import { useState } from 'react';
import Link from 'next/link';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&q=80';

export function VenueCard({ venue, idx }: { venue: any; idx: number }) {
  const [imgSrc, setImgSrc] = useState(venue.image_url || FALLBACK_IMG);
  // On mobile, all cards same height; on desktop, vary
  const heights = ['h-64 sm:h-72', 'h-64 sm:h-96', 'h-64 sm:h-80', 'h-64 sm:h-[22rem]'];
  const height = heights[idx % heights.length];

  return (
    <div className={`relative group mb-4 sm:mb-6 w-full rounded-2xl overflow-hidden cursor-pointer ${height} break-inside-avoid`}>
      {/* Image */}
      <img
        src={imgSrc}
        alt={`${venue.name} stadium`}
        onError={() => setImgSrc(FALLBACK_IMG)}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        loading="lazy"
      />

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-90"
        style={{ background: 'linear-gradient(to top, rgba(10,14,26,0.95) 0%, rgba(10,14,26,0.4) 50%, transparent 100%)' }}
      />

      {/* Final Badge */}
      {venue.is_final_host && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-gradient-to-r from-[var(--wc-gold)] to-[#ffeaa7] text-black px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-bold tracking-[0.15em] uppercase shadow-lg">
          🏆 Final Host
        </div>
      )}
      
      {/* Opening Host Badge */}
      {venue.is_opening_host && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-gradient-to-r from-[var(--wc-green)] to-[#00ff87] text-black px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-bold tracking-[0.15em] uppercase shadow-lg">
          🌟 Opening Match Host
        </div>
      )}

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <h3
          className="text-xl sm:text-2xl md:text-3xl text-white mb-1.5 sm:mb-2 leading-none"
          style={{ fontFamily: 'var(--font-display)', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
        >
          {venue.name}
        </h3>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-[var(--wc-text-muted)] font-medium mb-2 sm:mb-3">
          <span>📍 {venue.city}, {venue.country}</span>
          <span className="opacity-40">•</span>
          <span>🏟️ {venue.capacity.toLocaleString()}</span>
        </div>

        {/* CTA reveals on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
          <Link href={`/schedule?venue=${venue.id}`} className="inline-flex items-center text-xs sm:text-sm font-bold text-[var(--wc-green)] uppercase tracking-wider">
            View Matches <span className="ml-2 text-base sm:text-lg leading-none">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
