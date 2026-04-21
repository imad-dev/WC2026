import { useQuery } from '@tanstack/react-query'
import { fetchDashboardData } from '@/api/dataOrchestrator'
import { QUERY_STALE_TIMES } from '@/lib/queryClient'

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
    staleTime: QUERY_STALE_TIMES.default,
  })
}
