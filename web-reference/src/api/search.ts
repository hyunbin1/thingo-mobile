import apiClient from './apiClient';
import type { ApiResponse, Paginated } from './types';
import { SEARCH_API_DEFAULT_SIZE } from '../constants/common';
import type { Sort } from '@/components/molecules/SortButtons';

/**
 * 카테고리별로 상위 검색 결과 5개를 표시합니다
 * @param keyword 검색 키워드를 입력하세요
 */
// interface SearchOverviewRes {
//   broadcast: SearchResultItemRes[];
//   community: SearchResultItemRes[];
//   departmentNotice: SearchResultItemRes[];
//   departmentSchedule: SearchResultItemRes[];
//   mjuCalendar: SearchResultItemRes[];
//   news: SearchResultItemRes[];
//   notice: SearchResultItemRes[];
// }

export interface SearchResultItemRes {
  id: number;
  highlightedTitle: string;
  highlightedContent: string;
  date: string;
  link: string;
  category: string;
  type: string;
  imageUrl: string;
  score: number;
  authorName?: string;
  likeCount?: number;
  commentCount?: number;
}

export interface GetSearchResultRes {
  id: string;
  highlightedTitle: string;
  highlightedContent: string;
  date: string;
  link: string;
  category: string;
  type: string;
  imageUrl: string;
  score: number;
  authorName?: string;
  likeCount?: number;
  commentCount?: number;
}

export interface GetSearchAISummaryRes {
  query: string;
  summary: string;
  document_count: number;
  sources?: {
    title: string;
    url: string;
  }[];
}

export type Category =
  | 'all'
  | 'general'
  | 'academic'
  | 'scholarship'
  | 'career'
  | 'activity'
  | 'rule'
  | 'law'
  | 'REPORT'
  | 'SOCIETY'
  | 'FREE'
  | 'NOTICE';

// export const getSearchOverview = async (
//   keyword: string,
//   order?: Sort,
// ): Promise<SearchOverviewRes> => {
//   const res = await apiClient.get<ApiResponse<SearchOverviewRes>>('/search/overview', {
//     params: { keyword, order },
//   });
//   return res.data.data;
// };

/**
 * 검색어 자동완성 요청.
 * @param keyword 검색어를 입력하세요.
 * @returns 자동완성 키워드 배열을 return 합니다.
 */
export const getSearchWordcompletion = async (keyword: string, signal?: AbortSignal) => {
  const res = await apiClient.get<ApiResponse<string[]>>('/search/suggest', {
    params: { keyword },
    signal,
  });
  return res.data.data;
};

/**
 * 키워드와 카테고리를 이용해서 검색을 수행합니다.
 * @param keyword 검색할 키워드를 입력하세요.
 * @param type 검색할 게시판을 선택하세요.
 * @param category 검색할 카테고리를 선택하세요.
 * @param order 정렬 기준을 입력하세요.
 * @param page 페이지네이션 페이지를 입력하세요.
 * @param size 페이지네이션 크기를 입력하세요.
 * @returns 검색 결과 배열이 리턴됩니다.
 */
export const getSearchResult = async (
  keyword: string,
  type:
    | 'all'
    | 'NOTICE'
    | 'MJU_CALENDAR'
    | 'DEPARTMENT_NOTICE'
    | 'STUDENT_SOUNCIL_NOTICE'
    | 'DEPARTMENT_SCHEDULE'
    | 'NEWS'
    | 'COMMUNITY'
    | 'BROADCAST',
  category: Category | string,
  order: Sort,
  page = 0,
  size = SEARCH_API_DEFAULT_SIZE,
) => {
  const res = await apiClient.get<ApiResponse<Paginated<GetSearchResultRes>>>('/search/detail', {
    params: {
      keyword,
      type: type === 'all' ? undefined : type,
      category: category === 'all' ? undefined : category,
      order,
      page,
      size,
    },
  });
  return res.data.data;
};

/** AI 요약 API는 ApiResponse 래퍼 없이 payload만 반환합니다. */
export const getSearchAISummary = async (keyword: string): Promise<GetSearchAISummaryRes> => {
  const res = await apiClient.get<GetSearchAISummaryRes>('/ai/summary', {
    params: { query: keyword },
  });
  return res.data;
};
