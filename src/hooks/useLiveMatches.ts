import { useQuery } from '@tanstack/react-query'
import { fetchLiveMatches } from '@/api/dataOrchestrator'
import { QUERY_STALE_TIMES } from '@/lib/queryClient'

export function useLiveMatches() {
  return useQuery({
    queryKey: ['liveMatches'],
    queryFn: fetchLiveMatches,
    staleTime: QUERY_STALE_TIMES.liveMatches,
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
  })
}
