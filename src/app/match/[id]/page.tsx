import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import WorldCup2026Hub from '../../_legacy-pages/WorldCup2026Hub';

// Next.js ISR settings
export const revalidate = 60; // revalidate every 60 seconds

interface Props {
  params: Promise<{ id: string }>;
}

// 1. Static Params Generation for Build-Time Statically Generated Pages
export async function generateStaticParams() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: matches } = await supabase
    .from('wc2026_matches')
    .select('id');

  if (!matches) return [];

  return matches.map((match) => ({
    id: match.id.toString(),
  }));
}

// 2. Dynamic Metadata for SEO and Social Sharing
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const matchId = resolvedParams.id;
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: match } = await supabase
    .from('wc2026_matches')
    .select('*')
    .eq('id', matchId)
    .single();

  if (!match) {
    return {
      title: 'Match Not Found | WC2026.games',
    };
  }

  const title = `${match.home_team} vs ${match.away_team} - Live Stream & Score | FIFA World Cup 2026`;
  const description = `Watch ${match.home_team} vs ${match.away_team} live. Free stream, real-time score, and match details for this FIFA World Cup 2026 fixture at ${match.venue}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/match/${match.id}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://wc2026.games/match/${match.id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

// 3. Page Component
export default async function MatchPage({ params }: Props) {
  const resolvedParams = await params;
  const matchId = resolvedParams.id;
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: match } = await supabase
    .from('wc2026_matches')
    .select('id')
    .eq('id', matchId)
    .single();

  if (!match) {
    notFound();
  }

  // We reuse the existing SPA Hub here, but now it has its own indexable URL and metadata
  // A further enhancement would be passing the `matchId` to the Hub to auto-open that match
  return <WorldCup2026Hub />;
}
