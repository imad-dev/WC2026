import { useQuery } from '@tanstack/react-query'
import { fetchGroupStandings } from '@/api/dataOrchestrator'
import { QUERY_STALE_TIMES } from '@/lib/queryClient'

export function useGroupStandings(group: string) {
  return useQuery({
    queryKey: ['standings', group],
    queryFn: () => fetchGroupStandings(group),
    staleTime: QUERY_STALE_TIMES.standings,
    enabled: Boolean(group),
  })
}
