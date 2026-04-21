import { useQuery } from '@tanstack/react-query'
import { fetchTopScorers } from '@/api/dataOrchestrator'
import { QUERY_STALE_TIMES } from '@/lib/queryClient'

export function useTopScorers() {
  return useQuery({
    queryKey: ['topScorers'],
    queryFn: fetchTopScorers,
    staleTime: QUERY_STALE_TIMES.topScorers,
  })
}
