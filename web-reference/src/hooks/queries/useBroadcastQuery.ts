import { useQuery } from '@tanstack/react-query';
import { fetchBroadcasts } from '@/api/main/broadcast-api';
import { BROADCAST_STALE_TIME_MS } from '@/constants/common';

export function useBroadcastQuery(page: number, size: number) {
  return useQuery({
    queryKey: ['broadcasts', page, size],
    queryFn: () => fetchBroadcasts(page, size),
    staleTime: BROADCAST_STALE_TIME_MS,
    placeholderData: (prev) => prev,
  });
}
