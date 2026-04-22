import apiClient from '../apiClient';

export type RealtimeKeyword = string;
export interface TopKeywordsResponse {
  status: string;
  data: RealtimeKeyword[];
  timestamp: string;
}
export const getRealTimeSearch = async (count: number = 10): Promise<TopKeywordsResponse> => {
  try {
    const response = await apiClient.get<TopKeywordsResponse>('/keywords/top10', {
      params: { count },
    });

    return response.data;
  } catch (e) {
    console.log('실시간 검색어 api 단 불러오기 오류', e);
    throw e;
  }
};
