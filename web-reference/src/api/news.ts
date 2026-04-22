import type { NewsInfo } from '../types/news/newsInfo';
import apiClient from './apiClient';

export interface NewsListRes {
  success: boolean;
  data: {
    content: NewsInfo[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
    numberOfElements: number;
    empty: boolean;
    pageable: unknown;
  };
  message: string;
}

export const fetchNewsInfo = async (
  category: string,
  page?: number,
  size?: number,
): Promise<NewsListRes> => {
  const params: Record<string, unknown> = { category };
  if (page !== undefined) params.page = page;
  if (size !== undefined) params.size = size;

  const res = await apiClient.get('/news', { params });
  return res.data;
};
