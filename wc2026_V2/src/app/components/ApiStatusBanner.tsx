import { AlertCircle, Wifi, WifiOff, Clock } from 'lucide-react';
import { apiCache } from '../../services/apiCache';

interface ApiStatusBannerProps {
  error?: string | null;
  isUsingMockData?: boolean;
}

export function ApiStatusBanner({ error, isUsingMockData }: ApiStatusBannerProps) {
  const status = apiCache.getStatus();
  const isRateLimited = !status.canRequest && status.waitTime > 0;

  if (!error && !isUsingMockData && !isRateLimited) return null;

  const getBannerColor = () => {
    if (isRateLimited) return { bg: 'rgba(68, 138, 255, 0.1)', border: 'var(--blue-ref)' };
    if (error) return { bg: 'rgba(255, 61, 87, 0.1)', border: 'var(--red-loss)' };
    return { bg: 'rgba(255, 179, 0, 0.1)', border: 'var(--gold-leader)' };
  };

  const colors = getBannerColor();

  return (
    <div
      className="mx-4 md:mx-8 mt-4 rounded-lg p-4 border flex items-start gap-3"
      style={{
        background: colors.bg,
        borderColor: colors.border,
      }}
    >
      {isRateLimited ? (
        <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--blue-ref)' }} />
      ) : error ? (
        <WifiOff className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--red-loss)' }} />
      ) : (
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--gold-leader)' }} />
      )}

      <div className="flex-1">
        <div className="text-sm font-semibold mb-1" style={{ color: 'var(--white-primary)' }}>
          {isRateLimited ? 'Rate Limit Active' : error ? 'API Connection Issue' : 'Using Demo Data'}
        </div>
        <div className="text-xs" style={{ color: 'var(--white-muted)' }}>
          {isRateLimited ? (
            <>
              API rate limit reached ({status.requestsInWindow}/8 requests used).
              Wait {Math.ceil(status.waitTime / 1000)}s for next request.
              Using cached data in the meantime.
            </>
          ) : error ? (
            <>
              {error.includes('Rate limit') ? (
                'API rate limit reached. Using cached/demo data.'
              ) : error.includes('CORS') || error.includes('Network') ? (
                'API requires server-side proxy due to CORS. Showing demo World Cup 2026 data.'
              ) : (
                `Unable to fetch live data: ${error}. Using demo data.`
              )}
            </>
          ) : (
            'Showing demo World Cup 2026 data. API attempts WC2026 → API-Football (PL 2024) → Demo fallback.'
          )}
        </div>
      </div>
    </div>
  );
}
