import { useQuery } from '@tanstack/react-query';
import { getRealTimeSearch } from '@/api/main/real-time';
import { HOT_KEYWORDS_STALE_TIME_MS } from '@/constants/common';

export function useRealtimeKeywordQuery(count: number = 6) {
  return useQuery({
    queryKey: ['search', 'realtime-keywords', count] as const,
    queryFn: () => getRealTimeSearch(count),
    staleTime: HOT_KEYWORDS_STALE_TIME_MS,
  });
}
