import apiClient from '../apiClient';
import type { GetSearchResultRes } from '../search';
import { type ApiResponse, type Paginated } from '../types';
import { BROADCAST_PAGE_SIZE, DEFAULT_PAGE_SIZE } from '../../constants/common';

/**
 * 방송국 관련 데이터 타입
 */
export interface BroadcastItem {
  title: string;
  url: string;
  thumbnailUrl: string;
  playlistTitle: string | null;
  publishedAt: string;
}

/**
 * 명지대학교 방송국의 전체 영상 목록을 조회합니다. 페이지네이션 및 최신순 정렬을 지원합니다
 * @param page 페이지네이션 번호를 입력하세요
 * @param size 한번에 불러올 데이터 갯수를 입력하세요
 * @returns 페이지네이션된 BroadcastItem[]를 반환합니다
 */
export const fetchBroadcasts = async (page: number = 0, size: number = BROADCAST_PAGE_SIZE) => {
  const res = await apiClient.get<ApiResponse<Paginated<BroadcastItem>>>('/broadcast', {
    params: { page, size },
  });
  return res.data.data;
};

/**
 * 명지대학교 방송국의 영상을 검색합니다
 * @param keyword 검색할 키워드를 입력하세요.
 * @param order 정렬 기준을 입력하세요.
 * @param page 페이지네이션 페이지를 입력하세요.
 * @param size 페이지네이션 크기를 입력하세요.
 * @returns 검색 결과 배열이 리턴됩니다.
 */
export const searchBroadcasts = async (
  keyword: string,
  order: 'relevance' | 'latest' | 'oldest',
  page = 0,
  size = DEFAULT_PAGE_SIZE,
) => {
  const res = await apiClient.get<ApiResponse<Paginated<GetSearchResultRes>>>('/search/detail', {
    params: { keyword, type: 'BROADCAST', order, page, size },
  });

  const formatted = res.data.data.content.map((item): BroadcastItem => {
    return {
      title: item.highlightedTitle,
      url: item.link,
      thumbnailUrl: item.imageUrl,
      playlistTitle: item.highlightedContent,
      publishedAt: item.date,
    };
  });

  return {
    data: formatted,
    totalPages: res.data.data.totalPages,
  };
};
