import type { ApiResponse } from '@/types/api';

type AxiosLikeError<T = unknown> = {
  isAxiosError?: boolean;
  response?: {
    status?: number;
    data?: T;
  };
};

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
 * 대상이 AxiosError인지 확인
 */
export function isAxiosErrorResponse(
  error: unknown
): error is AxiosLikeError<ApiResponse<unknown>> {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosLikeError).isAxiosError === true
  );
}

/**
 * 대상이 닉네임 중복 에러인지 확인
 */
export function isDuplicateNicknameError(
  error: unknown
): error is AxiosLikeError<DuplicateNicknameErrorResponse> {
  if (!isAxiosErrorResponse(error)) return false;
  return (
    error.response?.status === 400 &&
    error.response?.data?.error === 'DUPLICATE_NICKNAME'
  );
}
