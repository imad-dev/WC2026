'use client';

import Link from 'next/link';

export default function TeamsClient({ teams }: { teams: any[] }) {
  // Hosts are Canada, Mexico, USA (or based on is_host_country if updated in DB)
  // For fallback before DB is updated, use short_name match
  const hosts = teams.filter((t) => t.is_host_country || ['CA', 'MX', 'US'].includes(t.country_code?.toUpperCase())).sort((a, b) => a.name.localeCompare(b.name));
  const others = teams.filter((t) => !t.is_host_country && !['CA', 'MX', 'US'].includes(t.country_code?.toUpperCase())).sort((a, b) => a.name.localeCompare(b.name));

  const TeamCard = ({ team, isHost }: { team: any, isHost: boolean }) => {
    const bgColor = team.kit_primary_color || '#1a2235';
    const flagUrl = team.flag_url || `https://flagcdn.com/120x90/${team.country_code?.toLowerCase() || 'un'}.png`;

    return (
      <Link href={`/team/${team.id}`} className="block group">
        {/* Top colored section */}
        <div 
          className="relative h-[200px] p-6 rounded-t transition-transform duration-200 ease-out group-hover:scale-[1.02] overflow-hidden"
          style={{ backgroundColor: bgColor }}
        >
          <div className="flex flex-col h-full justify-between relative z-10">
            <div>
              <img 
                src={flagUrl} 
                alt={`${team.name} flag`} 
                className="w-8 h-6 object-cover rounded-[2px] shadow-sm mb-2"
              />
              {isHost && (
                <span className="text-[13px] font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  Host country
                </span>
              )}
            </div>
            <h3 className="text-[40px] text-white leading-none uppercase" style={{ fontFamily: 'var(--font-display)' }}>
              {team.name}
            </h3>
          </div>
        </div>
        
        {/* Stats section below */}
        <div className="bg-white p-4 rounded-b text-[var(--wc-dark)] border border-gray-200 border-t-0 shadow-sm transition-transform duration-200 ease-out group-hover:scale-[1.02]">
          <div className="flex justify-between items-center py-1">
            <span className="text-[13px] text-gray-500 font-medium">Stage</span>
            <span className="text-[13px] font-bold">{team.group_name || 'Group Stage'}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-[13px] text-gray-500 font-medium">World Ranking</span>
            <span className="text-[13px] font-bold">{team.world_ranking ? `#${team.world_ranking}` : '-'}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-[13px] text-gray-500 font-medium">Participations</span>
            <span className="text-[13px] font-bold">{team.participations || '-'}</span>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="w-full min-h-screen bg-[var(--wc-surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        
        {/* Host Countries Section */}
        {hosts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl text-[var(--wc-text)] mb-8 uppercase" style={{ fontFamily: 'var(--font-display)' }}>
              Host countries
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {hosts.map(team => <TeamCard key={team.id} team={team} isHost={true} />)}
            </div>
          </section>
        )}

        {/* Qualified Teams Section */}
        <section>
          <h2 className="text-3xl md:text-4xl text-[var(--wc-text)] mb-8 uppercase" style={{ fontFamily: 'var(--font-display)' }}>
            Qualified teams
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {others.map(team => <TeamCard key={team.id} team={team} isHost={false} />)}
          </div>
        </section>

      </div>
    </div>
  );
}
