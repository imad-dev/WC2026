import { QueryClient } from '@tanstack/react-query'

export const QUERY_STALE_TIMES = {
  default: 300_000,
  liveMatches: 30_000,
  standings: 300_000,
  topScorers: 600_000,
  teams: 3_600_000,
} as const

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_TIMES.default,
      gcTime: 900_000,
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
      refetchOnWindowFocus: false,
    },
  },
})
