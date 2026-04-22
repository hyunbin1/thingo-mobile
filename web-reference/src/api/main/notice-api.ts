import apiClient from '../apiClient';
import type { NoticeResponse } from '../../types/notice/noticeInfo';
import { NOTICE_API_DEFAULT_SIZE } from '../../constants/common';

export const fetchNotionInfo = async (
  category: string,
  page = 0,
  size = NOTICE_API_DEFAULT_SIZE,
  sort: 'asc' | 'desc' = 'desc',
): Promise<NoticeResponse> => {
  const response = await apiClient.get('/notices', {
    params: { category, year: null, page, size, sort },
  });
  return response.data;
};
