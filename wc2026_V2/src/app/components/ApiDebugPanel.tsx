import { useState } from 'react';
import { fetchLiveMatches, fetchStandings, fetchTopScorers, fetchFixtures } from '../../services/api';

export function ApiDebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testApi = async (apiName: string, apiFn: () => Promise<any>) => {
    setLoading(true);
    setResults(null);
    try {
      const data = await apiFn();
      setResults({ apiName, success: true, data, count: data.length || 0 });
    } catch (error: any) {
      setResults({ apiName, success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-50 px-4 py-2 rounded-full text-xs font-semibold shadow-lg"
        style={{
          background: 'var(--blue-ref)',
          color: 'var(--void)',
        }}
      >
        🔧 API Debug
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-20 right-4 z-50 rounded-lg border p-4 w-96 max-h-96 overflow-y-auto"
      style={{
        background: 'var(--surface-1)',
        borderColor: 'var(--border)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold" style={{ color: 'var(--white-primary)' }}>
          API Debug Panel
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-xs px-2 py-1 rounded"
          style={{ color: 'var(--white-muted)', background: 'var(--surface-2)' }}
        >
          Close
        </button>
      </div>

      <div className="space-y-2 mb-4">
        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--gold-leader)' }}>
          🏆 WC2026 API (Priority 1)
        </div>
        <button
          onClick={() => testApi('WC2026 Live', fetchLiveMatches)}
          disabled={loading}
          className="w-full text-left px-3 py-2 rounded text-xs transition-colors"
          style={{
            background: 'var(--surface-2)',
            color: 'var(--white-primary)',
            opacity: loading ? 0.5 : 1,
          }}
        >
          🔴 Test Live Matches (All APIs)
        </button>
        <button
          onClick={() => testApi('WC2026 Standings', () => fetchStandings(1, 2026))}
          disabled={loading}
          className="w-full text-left px-3 py-2 rounded text-xs transition-colors"
          style={{
            background: 'var(--surface-2)',
            color: 'var(--white-primary)',
            opacity: loading ? 0.5 : 1,
          }}
        >
          📊 Test WC2026 Standings
        </button>
        <button
          onClick={() => testApi('WC2026 Scorers', () => fetchTopScorers(1, 2026))}
          disabled={loading}
          className="w-full text-left px-3 py-2 rounded text-xs transition-colors"
          style={{
            background: 'var(--surface-2)',
            color: 'var(--white-primary)',
            opacity: loading ? 0.5 : 1,
          }}
        >
          ⚽ Test WC2026 Top Scorers
        </button>

        <div className="text-xs font-semibold mt-4 mb-2" style={{ color: 'var(--blue-ref)' }}>
          ⚽ Premier League (Fallback)
        </div>
        <button
          onClick={() => testApi('PL Standings', () => fetchStandings(39, 2024))}
          disabled={loading}
          className="w-full text-left px-3 py-2 rounded text-xs transition-colors"
          style={{
            background: 'var(--surface-2)',
            color: 'var(--white-primary)',
            opacity: loading ? 0.5 : 1,
          }}
        >
          📊 Test Premier League 2024
        </button>
        <button
          onClick={() => testApi('PL Scorers', () => fetchTopScorers(39, 2024))}
          disabled={loading}
          className="w-full text-left px-3 py-2 rounded text-xs transition-colors"
          style={{
            background: 'var(--surface-2)',
            color: 'var(--white-primary)',
            opacity: loading ? 0.5 : 1,
          }}
        >
          ⚽ Test PL Top Scorers
        </button>
      </div>

      {loading && (
        <div className="text-xs text-center py-4" style={{ color: 'var(--white-muted)' }}>
          Loading...
        </div>
      )}

      {results && (
        <div
          className="rounded p-3 text-xs overflow-auto max-h-48"
          style={{
            background: 'var(--surface-2)',
            color: results.success ? 'var(--green-live)' : 'var(--red-loss)',
          }}
        >
          <div className="font-semibold mb-2">{results.apiName}</div>
          {results.success ? (
            <div>
              <div style={{ color: 'var(--white-muted)' }}>
                ✅ Success! Found {results.count} items
              </div>
              <pre className="mt-2 text-xs overflow-auto" style={{ color: 'var(--white-ghost)' }}>
                {JSON.stringify(results.data.slice(0, 2), null, 2)}
              </pre>
            </div>
          ) : (
            <div>
              ❌ Failed: {results.error}
            </div>
          )}
        </div>
      )}

      <div className="mt-4 pt-4 border-t text-xs" style={{ borderColor: 'var(--border)', color: 'var(--white-ghost)' }}>
        <strong>Multi-API System:</strong> Tries WC2026 API first, falls back to API-Football, then BallDontLie. Check console for logs showing which API responded.
      </div>
    </div>
  );
}
