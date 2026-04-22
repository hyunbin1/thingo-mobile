import apiClient from './apiClient';
import { COLLEGE_OPTIONS, DEPARTMENT_OPTIONS } from '@/constants/departments';
import type { ApiResponse } from '@/types/api';

/** College 타입 정의 - constants/departments의 COLLEGE_OPTIONS에서 추출 */
export type College = (typeof COLLEGE_OPTIONS)[number]['value'];

/** Department 타입 정의 - constants/departments의 DEPARTMENT_OPTIONS에서 추출 */
export type Department = (typeof DEPARTMENT_OPTIONS)[number]['departments'][number]['value'];

/** 학생회 공지 생성 요청 데이터 타입 */
export interface CreateStudentCouncilNoticeRequest {
  title: string;
  content: string;
  imageUrls: string[];
}

/** 학생회 공지 생성 응답 데이터 타입 */
export interface CreateStudentCouncilNoticeResponse {
  uuid: string;
  title: string;
  content: string;
  authorNickname: string;
  publishedAt: string;
  thumbnailUrl: string;
  imageUrls: string[];
}

/**
 * 학생회 공지 생성 API
 * ADMIN 또는 OPERATOR 권한이 필요합니다.
 * @param college - 단과대학 (constants/departments의 COLLEGE_OPTIONS에서 가져온 값)
 * @param department - 학과명 (constants/departments의 DEPARTMENT_OPTIONS에서 가져온 값)
 * @param noticeData - 공지 제목, 내용 및 이미지 URL 배열
 * @returns 생성된 학생회 공지 정보
 */
export const createStudentCouncilNotice = async (
  college: College,
  department: Department | null,
  noticeData: CreateStudentCouncilNoticeRequest,
) => {
  const { data } = await apiClient.post<ApiResponse<CreateStudentCouncilNoticeResponse>>(
    '/admin/departments/student-council/notices',
    noticeData,
    {
      params: {
        college,
        department,
      },
    },
  );
  return data;
};

/** 학생회 공지 수정 요청 데이터 타입 */
export type UpdateStudentCouncilNoticeRequest = CreateStudentCouncilNoticeRequest;

/** 학생회 공지 수정 응답 데이터 타입 */
export type UpdateStudentCouncilNoticeResponse = CreateStudentCouncilNoticeResponse;

/**
 * 학생회 공지 수정 API
 * ADMIN 또는 OPERATOR 권한이 필요합니다.
 * @param college - 단과대학 (constants/departments의 COLLEGE_OPTIONS에서 가져온 값)
 * @param department - 학과명 (constants/departments의 DEPARTMENT_OPTIONS에서 가져온 값)
 * @param noticeUuid - 수정할 공지 UUID
 * @param noticeData - 공지 제목, 내용 및 이미지 URL 배열
 * @returns 수정된 학생회 공지 정보
 */
export const updateStudentCouncilNotice = async (
  college: College,
  department: Department | null,
  noticeUuid: string,
  noticeData: UpdateStudentCouncilNoticeRequest,
) => {
  const { data } = await apiClient.patch<ApiResponse<UpdateStudentCouncilNoticeResponse>>(
    `/admin/departments/student-council/notices/${noticeUuid}`,
    noticeData,
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
 * 학생회 공지 삭제 API
 * ADMIN 또는 OPERATOR 권한이 필요합니다.
 * @param college - 단과대학 (constants/departments의 COLLEGE_OPTIONS에서 가져온 값)
 * @param department - 학과명 (constants/departments의 DEPARTMENT_OPTIONS에서 가져온 값)
 * @param noticeUuid - 삭제할 공지 UUID
 * @returns 삭제 성공 메시지
 */
export const deleteStudentCouncilNotice = async (
  college: College,
  department: Department | null,
  noticeUuid: string,
) => {
  const { data } = await apiClient.delete<ApiResponse<string>>(
    `/admin/departments/student-council/notices/${noticeUuid}`,
    {
      params: {
        college,
        department,
      },
    },
  );
  return data;
};
