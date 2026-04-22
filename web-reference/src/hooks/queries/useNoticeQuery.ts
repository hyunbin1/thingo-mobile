import { useQuery } from '@tanstack/react-query';
import { fetchNotionInfo } from '@/api/main/notice-api';
import { NOTICE_API_DEFAULT_SIZE, NOTICE_STALE_TIME_MS } from '@/constants/common';

export function useNoticeQuery(
  category: string,
  page: number,
  size: number = NOTICE_API_DEFAULT_SIZE,
  sort: 'asc' | 'desc' = 'desc',
) {
  return useQuery({
    queryKey: ['notices', category, page, size, sort],
    queryFn: () => fetchNotionInfo(category, page, size, sort),
    staleTime: NOTICE_STALE_TIME_MS,
    placeholderData: (prev) => prev,
  });
}
