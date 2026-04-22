import { useQuery } from '@tanstack/react-query';
import { fetchNewsInfo } from '@/api/news';
import { NEWS_STALE_TIME_MS } from '@/constants/common';

export function useNewsQuery(category: string, page: number, size: number) {
  return useQuery({
    queryKey: ['news', category, page, size],
    queryFn: () => fetchNewsInfo(category, page, size),
    staleTime: NEWS_STALE_TIME_MS,
    placeholderData: (prev) => prev,
  });
}
