import apiClient from './apiClient';
import { COLLEGE_OPTIONS, DEPARTMENT_OPTIONS } from '@/constants/departments';
import type { ApiResponse } from '@/types/api';

/** College 타입 정의 - constants/departments의 COLLEGE_OPTIONS에서 추출 */
export type College = (typeof COLLEGE_OPTIONS)[number]['value'];

/** Department 타입 정의 - constants/departments의 DEPARTMENT_OPTIONS에서 추출 */
export type Department = (typeof DEPARTMENT_OPTIONS)[number]['departments'][number]['value'];

/** 학과 일정 등록 요청 데이터 타입 */
export interface CreateDepartmentScheduleRequest {
  /** 일정 제목 (필수) */
  title: string;
  /** 일정 상세 내용 */
  content?: string;
  /** 일정 표시 색상 코드 (예: "#4F46E5") */
  colorCode?: string;
  /** 일정 시작일 (YYYY-MM-DD, 필수) */
  startDate: string;
  /** 일정 종료일 (YYYY-MM-DD, startDate보다 빠를 수 없음) */
  endDate?: string;
}

/** 학과 일정 등록 응답 데이터 타입 */
export interface CreateDepartmentScheduleResponse {
  departmentScheduleUuid: string;
  title: string;
  content: string | null;
  colorCode: string | null;
  startDate: string;
  endDate: string | null;
}

/**
 * 학과 일정 등록 API
 * ADMIN 또는 OPERATOR 권한이 필요합니다.
 * @param college - 단과대학 (constants/departments의 COLLEGE_OPTIONS에서 가져온 값)
 * @param department - 학과명 (constants/departments의 DEPARTMENT_OPTIONS에서 가져온 값)
 * @param scheduleData - 일정 제목, 내용, 색상, 시작일, 종료일
 * @returns 생성된 학과 일정 정보
 */
export const createDepartmentSchedule = async (
  college: College,
  department: Department | null,
  scheduleData: CreateDepartmentScheduleRequest,
) => {
  const { data } = await apiClient.post<ApiResponse<CreateDepartmentScheduleResponse>>(
    '/admin/departments/schedules',
    scheduleData,
    {
      params: {
        college,
        department,
      },
    },
  );
  return data;
};

/** 학과 일정 수정 요청 데이터 타입 */
export type UpdateDepartmentScheduleRequest = CreateDepartmentScheduleRequest;

/** 학과 일정 수정 응답 데이터 타입 */
export type UpdateDepartmentScheduleResponse = CreateDepartmentScheduleResponse;

/**
 * 학과 일정 수정 API
 * ADMIN 또는 OPERATOR 권한이 필요합니다.
 * @param college - 단과대학 (constants/departments의 COLLEGE_OPTIONS에서 가져온 값)
 * @param department - 학과명 (constants/departments의 DEPARTMENT_OPTIONS에서 가져온 값)
 * @param scheduleUuid - 수정할 일정 UUID
 * @param scheduleData - 일정 제목, 내용, 색상, 시작일, 종료일
 * @returns 수정된 학과 일정 정보
 */
export const updateDepartmentSchedule = async (
  college: College,
  department: Department | null,
  scheduleUuid: string,
  scheduleData: UpdateDepartmentScheduleRequest,
) => {
  const { data } = await apiClient.patch<ApiResponse<UpdateDepartmentScheduleResponse>>(
    `/admin/departments/schedules/${scheduleUuid}`,
    scheduleData,
    {
      params: {
        college,
        department,
      },
    },
  );
  return data;
};

/**
 * 학과 일정 삭제 API
 * ADMIN 또는 OPERATOR 권한이 필요합니다.
 * 일정 관련 S3 폴더를 정리한 후 일정을 삭제합니다.
 * @param college - 단과대학 (constants/departments의 COLLEGE_OPTIONS에서 가져온 값)
 * @param department - 학과명 (constants/departments의 DEPARTMENT_OPTIONS에서 가져온 값)
 * @param scheduleUuid - 삭제할 일정 UUID
 * @returns 삭제 성공 메시지 (예: "삭제 완료")
 */
export const deleteDepartmentSchedule = async (
  college: College,
  department: Department | null,
  scheduleUuid: string,
) => {
  const { data } = await apiClient.delete<ApiResponse<string>>(
    `/admin/departments/schedules/${scheduleUuid}`,
    {
      params: {
        college,
        department,
      },
    },
  );
  return data;
};
