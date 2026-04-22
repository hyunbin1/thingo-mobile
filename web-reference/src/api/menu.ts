import apiClient from './apiClient';
import type { ApiResponse } from './types';

export interface MenuItem {
  date: string;
  menuCategory: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  meals: string[];
}

export const getMenus = async () => {
  const res = await apiClient.get<ApiResponse<MenuItem[]>>('/menus');
  return res.data.data;
};
