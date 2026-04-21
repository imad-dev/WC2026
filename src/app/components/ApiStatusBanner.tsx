export function ApiStatusBanner() {
  return (
    <div
      className="mx-4 md:mx-8 lg:mx-20 mb-6 px-4 py-2 rounded-lg flex items-center gap-3 text-xs"
      style={{ background: 'rgba(0,230,118,0.06)', border: '1px solid rgba(0,230,118,0.15)' }}
    >
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--green-live)' }} />
      <span style={{ color: 'var(--white-muted)' }}>
        Live data powered by <span className="font-semibold" style={{ color: 'var(--green-live)' }}>football-data.org</span>
        {' '}· Premier League, La Liga, Bundesliga, Serie A, Ligue 1, Champions League
      </span>
      <span className="ml-auto flex-shrink-0" style={{ color: 'var(--white-ghost)' }}>
        WC2026 API coming June 2026
      </span>
    </div>
  );
}
