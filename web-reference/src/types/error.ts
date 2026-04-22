import type { AxiosError } from 'axios';
import type { ApiResponse } from './api';

/**
 * 에러 타입 정의
 */

/**
 * Axios 에러 응답 데이터 구조
 */
export interface AxiosErrorResponseData {
  message?: string;
  status?: string | number;
  error?: string;
}

/**
 * 닉네임 중복 에러 응답 구조
 */
export interface DuplicateNicknameErrorResponse {
  status?: number;
  error?: string;
  message?: string;
}

/**
 * 타입 가드: AxiosError인지 확인
 */
export function isAxiosErrorResponse(error: unknown): error is AxiosError<ApiResponse<unknown>> {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosError).isAxiosError === true
  );
}

/**
 * 타입 가드: 닉네임 중복 에러인지 확인
 */
export function isDuplicateNicknameError(
  error: unknown,
): error is AxiosError<DuplicateNicknameErrorResponse> {
  if (!isAxiosErrorResponse(error)) return false;
  return error.response?.status === 400 && error.response?.data?.error === 'DUPLICATE_NICKNAME';
}
