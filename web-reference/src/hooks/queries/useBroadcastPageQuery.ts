import { useQuery } from '@tanstack/react-query';
import { fetchBroadcasts, searchBroadcasts } from '@/api/main/broadcast-api';
import { BROADCAST_PAGE_SIZE, BROADCAST_SEARCH_STALE_TIME_MS } from '@/constants/common';

export function useBroadcastListQuery(page: number, size: number = BROADCAST_PAGE_SIZE) {
  return useQuery({
    queryKey: ['broadcast-page', 'list', page, size] as const,
    queryFn: () => fetchBroadcasts(page, size),
    staleTime: BROADCAST_SEARCH_STALE_TIME_MS,
    placeholderData: (prev) => prev,
  });
}

export function useBroadcastSearchQuery(
  keyword: string,
  page: number,
  size: number = BROADCAST_PAGE_SIZE,
) {
  return useQuery({
    queryKey: ['broadcast-page', 'search', keyword, page, size] as const,
    queryFn: () => searchBroadcasts(keyword, 'relevance', page, size),
    enabled: !!keyword.trim(),
    staleTime: BROADCAST_SEARCH_STALE_TIME_MS,
    placeholderData: (prev) => prev,
  });
}
