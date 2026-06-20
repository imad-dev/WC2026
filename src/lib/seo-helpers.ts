/**
 * Centralized SEO helper functions for WC2026.games
 * Generates JSON-LD structured data for various page types
 */

const SITE_URL = 'https://wc2026.games';
const SITE_NAME = 'WC2026.games';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function generateTeamJsonLd(team: {
  name: string;
  id: string;
  group_letter?: string;
  confederation?: string;
  world_ranking?: number;
  flag_url?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsTeam',
    name: team.name,
    url: `${SITE_URL}/team/${team.id}`,
    sport: 'Football/Soccer',
    memberOf: {
      '@type': 'SportsOrganization',
      name: 'FIFA World Cup 2026',
    },
    ...(team.flag_url ? { logo: team.flag_url } : {}),
  };
}

export function generateMatchJsonLd(match: {
  home_team: string;
  away_team: string;
  kickoff_utc?: string;
  venue?: string;
  group_name?: string;
  status?: string;
  home_score?: number | null;
  away_score?: number | null;
  slug: string;
}) {
  const eventStatus =
    match.status === 'live'
      ? 'https://schema.org/EventMovedOnline'
      : match.status === 'finished'
        ? 'https://schema.org/EventScheduled'
        : 'https://schema.org/EventScheduled';

  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `${match.home_team} vs ${match.away_team} — FIFA World Cup 2026`,
    description: `${match.group_name || 'Knockout Stage'} match between ${match.home_team} and ${match.away_team} at the 2026 FIFA World Cup.`,
    startDate: match.kickoff_utc || undefined,
    eventStatus,
    eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
    sport: 'Football/Soccer',
    url: `${SITE_URL}/match/${match.slug}`,
    ...(match.venue
      ? {
          location: {
            '@type': 'Place',
            name: match.venue,
          },
        }
      : {}),
    homeTeam: { '@type': 'SportsTeam', name: match.home_team },
    awayTeam: { '@type': 'SportsTeam', name: match.away_team },
    organizer: {
      '@type': 'Organization',
      name: 'FIFA',
      url: 'https://www.fifa.com',
    },
  };
}

export function generateFAQJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export { SITE_URL, SITE_NAME };
