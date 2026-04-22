import { useQuery, useQueries } from '@tanstack/react-query';
import { getSearchResult, getSearchAISummary, getSearchWordcompletion } from '@/api/search';
import {
  AI_SUMMARY_STALE_TIME_MS,
  SEARCH_STALE_TIME_MS,
  SEARCH_SUGGEST_STALE_TIME_MS,
} from '@/constants/common';
import type { Sort } from '@/components/molecules/SortButtons';

type AllSearchType = 'NOTICE' | 'COMMUNITY' | 'NEWS' | 'BROADCAST';

/** ALL 탭 전용: 4가지 타입을 병렬로 조회 */
export function useAllSearchQueries(keyword: string | null, sort: Sort) {
  return useQueries({
    queries: (['NOTICE', 'COMMUNITY', 'NEWS', 'BROADCAST'] as AllSearchType[]).map((type) => ({
      queryKey: ['search', 'all', type, keyword, sort] as const,
      queryFn: () => getSearchResult(keyword!, type, 'all', sort),
      enabled: !!keyword,
      staleTime: SEARCH_STALE_TIME_MS,
    })),
  });
}

/** 개별 탭 전용: 단일 타입 조회 */
export function useSearchQuery(
  keyword: string | null,
  type: Parameters<typeof getSearchResult>[1],
  category: string,
  sort: Sort,
  page: number,
  enabled: boolean,
) {
  return useQuery({
    queryKey: ['search', 'detail', type, keyword, category, sort, page] as const,
    queryFn: () => getSearchResult(keyword!, type, category, sort, page, 10),
    enabled: enabled && !!keyword,
    staleTime: SEARCH_STALE_TIME_MS,
    placeholderData: (prev) => prev,
  });
}

/** AI 요약: keyword 변경 시에만 재조회, 10분 stale */
export function useAiSummaryQuery(keyword: string | null) {
  return useQuery({
    queryKey: ['search', 'ai-summary', keyword] as const,
    queryFn: () => getSearchAISummary(keyword!),
    enabled: !!keyword,
    staleTime: AI_SUMMARY_STALE_TIME_MS,
    retry: 0,
  });
}

/** 자동완성: signal 전달로 실제 HTTP 요청 취소, 1분 stale */
export function useSearchSuggestQuery(keyword: string) {
  return useQuery({
    queryKey: ['search', 'suggest', keyword] as const,
    queryFn: ({ signal }) => getSearchWordcompletion(keyword, signal),
    enabled: !!keyword.trim(),
    staleTime: SEARCH_SUGGEST_STALE_TIME_MS,
  });
}
