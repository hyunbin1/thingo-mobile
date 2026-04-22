import apiClient from './apiClient';
import { COLLEGE_OPTIONS, DEPARTMENT_OPTIONS } from '@/constants/departments';
import type { ApiResponse } from '@/types/api';

/** College 타입 정의 - constants/departments의 COLLEGE_OPTIONS에서 추출 */
export type College = (typeof COLLEGE_OPTIONS)[number]['value'];

/** Department 타입 정의 - constants/departments의 DEPARTMENT_OPTIONS에서 추출 */
export type Department = (typeof DEPARTMENT_OPTIONS)[number]['departments'][number]['value'];

/** 학과 정보 응답 데이터 타입 */
export interface DepartmentInfo {
  college: College;
  departmentName: string;
  academicOfficePhone: string;
  instagramUrl: string;
  homepageUrl: string;
}

/**
 * 학과 정보 조회 API
 * @param college - 단과대학 (constants/departments의 COLLEGE_OPTIONS에서 가져온 값)
 * @param department - 학과명 (null이면 전체)
 * @returns 학과 정보
 */
export const getDepartmentInfo = async (college: College, department: Department | null) => {
  const { data } = await apiClient.get<ApiResponse<DepartmentInfo>>('/departments/info', {
    params: {
      college,
      department: department ?? null,
    },
  });
  return data;
};

/** 학과 일정 항목 타입 */
export interface DepartmentSchedule {
  uuid: string;
  title: string;
  startDateTime: string;
  endDateTime: string;
  content: string | null;
}

/** 학과 일정 조회 응답 데이터 타입 */
export interface DepartmentSchedulesData {
  schedules: DepartmentSchedule[];
}

/**
 * 학과 일정 조회 API
 * @param college - 단과대학 (constants/departments의 COLLEGE_OPTIONS에서 가져온 값)
 * @param department - 학과명 (null이면 전체)
 * @returns 학과 일정 목록
 */
export const getDepartmentSchedules = async (college: College, department: Department | null) => {
  const { data } = await apiClient.get<ApiResponse<DepartmentSchedulesData>>(
    '/departments/schedules',
    {
      params: {
        college,
        department: department ?? null,
      },
    },
  );
  return data;
};

/** 학과 공지사항(DepartmentNotice) 항목 타입 */
export interface DepartmentNotice {
  departmentNoticeUuid: string;
  title: string;
  publishedAt: string;
  link: string;
}

/** 학과 공지사항 목록 조회 응답 데이터 타입 (페이징) */
export interface DepartmentNoticesData {
  content: DepartmentNotice[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: { empty: boolean; sorted: boolean; unsorted: boolean };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: { empty: boolean; sorted: boolean; unsorted: boolean };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

/**
 * 학과 공지사항 목록 조회 API
 * College + (optional) DepartmentName 조합으로 학과 공지사항을 페이징 형태로 조회합니다.
 * department를 생략하면 단과대(학부) 레벨 공지를 조회합니다.
 * @param college - 단과대학 (필수)
 * @param department - 학과명 (생략 시 단과대 레벨)
 * @param page - 페이지 번호 (기본값: 0)
 * @param size - 페이지 크기 (기본값: 5)
 * @param sort - 정렬 기준 (기본값: "date,desc")
 * @returns 학과 공지사항 목록 (페이징)
 */
export const getDepartmentNotices = async (
  college: College,
  department: Department | null,
  page = 0,
  size = 5,
  sort = 'date,desc',
) => {
  const { data } = await apiClient.get<ApiResponse<DepartmentNoticesData>>('/departments/notices', {
    params: {
      college,
      department: department ?? undefined,
      page,
      size,
      sort,
    },
  });
  return data;
};

/** 학생회 공지 항목 타입 */
export interface StudentCouncilNotice {
  noticeUuid: string;
  title: string | null;
  thumbnailUrl: string;
  authorNickname: string;
  publishedAt: string;
}

/** 학생회 공지 목록 조회 응답 데이터 타입 (페이징) */
export interface StudentCouncilNoticesData {
  content: StudentCouncilNotice[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: { empty: boolean; sorted: boolean; unsorted: boolean };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: { empty: boolean; sorted: boolean; unsorted: boolean };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

/**
 * 학생회 공지 목록 조회 API
 * @param college - 단과대학 (constants/departments의 COLLEGE_OPTIONS에서 가져온 값)
 * @param department - 학과명 (null이면 전체)
 * @param page - 페이지 번호 (기본값: 0)
 * @param size - 페이지 크기 (기본값: 5)
 * @param sort - 정렬 기준 (기본값: "publishedAt,desc")
 * @returns 학생회 공지 목록
 */
export const getStudentCouncilNotices = async (
  college: College,
  department: Department | null,
  page = 0,
  size = 10,
  sort: 'publishedAt' | 'desc' = 'publishedAt',
) => {
  const { data } = await apiClient.get<ApiResponse<StudentCouncilNoticesData>>(
    '/departments/student-council/notices',
    {
      params: {
        college,
        department: department ?? null,
        page,
        size,
        sort,
      },
    },
  );
  return data;
};

/** 학생회 공지 상세 정보 타입 */
export interface StudentCouncilNoticeDetail {
  noticeUuid: string;
  title: string;
  content: string;
  authorNickname: string;
  publishedAt: string;
  imageUrls: string[];
}

/**
 * 학생회 공지 상세 조회 API
 * @param noticeUuid - 공지 UUID
 * @returns 학생회 공지 상세 정보
 */
export const getStudentCouncilNoticeDetail = async (noticeUuid: string) => {
  const { data } = await apiClient.get<ApiResponse<StudentCouncilNoticeDetail>>(
    `/departments/student-council/notices/${noticeUuid}`,
  );
  return data;
};
