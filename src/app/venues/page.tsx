import { unstable_cache } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase';
import { VenueCard } from '@/components/ui/VenueCard';

const getVenues = unstable_cache(
  async () => {
    const { data, error } = await supabaseAdmin
      .from('wc2026_venues')
      .select('*')
      .order('capacity', { ascending: false });

    if (error) {
      console.error('Error fetching venues:', error);
      return [];
    }
    return data || [];
  },
  ['wc2026-venues'],
  { revalidate: 30 }
);

export default async function VenuesPage() {
  const venues = await getVenues();

  return (
    <div className="w-full min-h-screen bg-[var(--wc-dark)] py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--wc-gold)] mb-3 font-semibold">
            Tournament Venues
          </p>
          <h1
            className="text-4xl md:text-5xl text-[var(--wc-text)] mb-3 uppercase"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Host Cities & Venues
          </h1>
          <p className="text-[var(--wc-text-muted)] text-sm md:text-base max-w-2xl leading-relaxed">
            16 iconic stadiums across USA, Canada, and Mexico will host the 104 matches of the 2026 FIFA World Cup — the largest in history.
          </p>
        </div>

        {/* Masonry Grid — single column on mobile */}
        <div className="columns-1 sm:columns-2 gap-4 sm:gap-6">
          {venues.map((venue, idx) => (
            <VenueCard key={venue.id} venue={venue} idx={idx} />
          ))}
        </div>

      </div>
    </div>
  );
}
