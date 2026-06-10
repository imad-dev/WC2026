export default function StandingsTab({ match }: any) {
  // In a real app, you would query `wc2026_standings` where group_name = match.group_name
  // Here we show a placeholder using the match data itself
  
  const groupName = match.group_name || 'Group A';
  const homeTeam = match.home_team || { name: 'Home' };
  const awayTeam = match.away_team || { name: 'Away' };

  return (
    <div className="p-4 md:p-6 w-full">
      <div className="bg-[var(--wc-surface)] border border-[var(--wc-border)] rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-black/20 border-b border-[var(--wc-border)]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">{groupName}</h3>
        </div>
        
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-white/5 text-[var(--wc-text-muted)]">
              <tr>
                <th className="px-4 py-3 font-normal w-8 text-center">#</th>
                <th className="px-4 py-3 font-normal min-w-[120px]">Team</th>
                <th className="px-3 py-3 font-normal text-center">P</th>
                <th className="px-3 py-3 font-normal text-center">W</th>
                <th className="px-3 py-3 font-normal text-center">D</th>
                <th className="px-3 py-3 font-normal text-center">L</th>
                <th className="px-3 py-3 font-normal text-center">DIFF</th>
                <th className="px-3 py-3 font-normal text-center">PTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--wc-border)]">
              {/* Dummy row 1 */}
              <tr className="hover:bg-white/5 transition-colors bg-white/[0.06]">
                <td className="px-4 py-3 text-center">
                  <span className="w-2 h-2 rounded-full bg-[var(--wc-green)] inline-block mr-1"></span>
                  1
                </td>
                <td className="px-4 py-3 font-bold text-white flex items-center gap-2">
                  {homeTeam.country_code && <img src={`https://flagcdn.com/24x18/${homeTeam.country_code}.png`} alt={homeTeam.name} />}
                  {homeTeam.name}
                </td>
                <td className="px-3 py-3 text-center tabular-nums">1</td>
                <td className="px-3 py-3 text-center tabular-nums">0</td>
                <td className="px-3 py-3 text-center tabular-nums">1</td>
                <td className="px-3 py-3 text-center tabular-nums">0</td>
                <td className="px-3 py-3 text-center tabular-nums">0</td>
                <td className="px-3 py-3 text-center font-bold tabular-nums">1</td>
              </tr>
              {/* Dummy row 2 */}
              <tr className="hover:bg-white/5 transition-colors bg-white/[0.06]">
                <td className="px-4 py-3 text-center">
                  <span className="w-2 h-2 rounded-full bg-[var(--wc-green)] inline-block mr-1"></span>
                  2
                </td>
                <td className="px-4 py-3 font-bold text-white flex items-center gap-2">
                  {awayTeam.country_code && <img src={`https://flagcdn.com/24x18/${awayTeam.country_code}.png`} alt={awayTeam.name} />}
                  {awayTeam.name}
                </td>
                <td className="px-3 py-3 text-center tabular-nums">1</td>
                <td className="px-3 py-3 text-center tabular-nums">0</td>
                <td className="px-3 py-3 text-center tabular-nums">1</td>
                <td className="px-3 py-3 text-center tabular-nums">0</td>
                <td className="px-3 py-3 text-center tabular-nums">0</td>
                <td className="px-3 py-3 text-center font-bold tabular-nums">1</td>
              </tr>
              {/* Dummy row 3 */}
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-center text-[var(--wc-text-muted)]">3</td>
                <td className="px-4 py-3 text-white flex items-center gap-2">
                  <span className="w-[24px]"></span>
                  Team C
                </td>
                <td className="px-3 py-3 text-center tabular-nums">0</td>
                <td className="px-3 py-3 text-center tabular-nums">0</td>
                <td className="px-3 py-3 text-center tabular-nums">0</td>
                <td className="px-3 py-3 text-center tabular-nums">0</td>
                <td className="px-3 py-3 text-center tabular-nums">0</td>
                <td className="px-3 py-3 text-center font-bold tabular-nums">0</td>
              </tr>
              {/* Dummy row 4 */}
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-center text-[var(--wc-text-muted)]">4</td>
                <td className="px-4 py-3 text-white flex items-center gap-2">
                  <span className="w-[24px]"></span>
                  Team D
                </td>
                <td className="px-3 py-3 text-center tabular-nums">0</td>
                <td className="px-3 py-3 text-center tabular-nums">0</td>
                <td className="px-3 py-3 text-center tabular-nums">0</td>
                <td className="px-3 py-3 text-center tabular-nums">0</td>
                <td className="px-3 py-3 text-center tabular-nums">0</td>
                <td className="px-3 py-3 text-center font-bold tabular-nums">0</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-white/5 border-t border-[var(--wc-border)] text-xs text-[var(--wc-text-muted)]">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[var(--wc-green)]"></span>
            <span>Top 2 advance to Round of 32</span>
          </div>
          <p className="opacity-70">If teams are tied on points, tie-breakers apply (Goal Difference, Goals Scored, Head-to-Head).</p>
        </div>
      </div>
    </div>
  );
}
