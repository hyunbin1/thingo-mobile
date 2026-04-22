import apiClient from '../apiClient';
import type { ApiResponse } from '../types';

/**
 * 월별 학사 일정을 조회합니다. 년, 월 기준으로 조회할 수 있고 모든 카테고리의 학사 일정을 한번에 응답받습니다.
 * @param year 조회할 년도를 입력하세요
 * @param month 조회할 월을 입력하세요
 * @returns 해당 월의 학사 일정 배열을 반환합니다
 */
export const getAcademicCalendar = async (year: number, month: number) => {
  const res = await apiClient.get<ApiResponse<CalendarMonthlyRes>>('/calendar/monthly', {
    params: {
      year,
      month,
    },
  });
  return res.data.data;
};

/**
 * 월별 학사일정 API 응답 (data)의 인터페이스
 * (서버에서 카테고리별로 그룹화되어 오는 구조)
 */
export interface CalendarMonthlyRes {
  year: number;
  month: number;
  all: CalendarScheduleItem[];
  undergrad: CalendarScheduleItem[];
  graduate: CalendarScheduleItem[];
  holiday: CalendarScheduleItem[];
}

/**
 * 개별 학사일정 항목의 인터페이스
 */
export interface CalendarScheduleItem {
  id: number;
  startDate: string;
  endDate: string;
  description: string;
}
