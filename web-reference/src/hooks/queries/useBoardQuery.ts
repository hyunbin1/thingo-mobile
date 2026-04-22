import { useQuery } from '@tanstack/react-query';
import { getBoards, type Category } from '@/api/board';
import { BOARD_STALE_TIME_MS } from '@/constants/common';

export function useBoardQuery(category: Category, page: number, size: number) {
  return useQuery({
    queryKey: ['boards', category, page, size],
    queryFn: () => getBoards({ page, size, communityCategory: category }),
    staleTime: BOARD_STALE_TIME_MS,
    placeholderData: (prev) => prev,
  });
}
