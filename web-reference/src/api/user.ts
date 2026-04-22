import apiClient from './apiClient';
import { accessTokenStore } from './token';
import { HAS_SESSION_KEY } from '@/constants/auth';

import type {
  ApiResponse,
  EmailVerifyResponse,
  ResetPasswordResponse,
  RegisterReq,
} from '../types/api';
import type { UserInfo } from '../types/auth';

/** 로그인 */
interface LoginResponse {
  accessToken: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', { email, password });
  const accessToken = data.accessToken;
  if (accessToken) {
    accessTokenStore.set(accessToken);
    localStorage.setItem(HAS_SESSION_KEY, '1');
  }

  return data;
};

/** 로그아웃 */
export interface LogoutResponse {
  message: string;
}

export const logout = async (): Promise<LogoutResponse> => {
  try {
    const { data } = await apiClient.post<LogoutResponse>('/auth/logout', {});
    return data;
  } finally {
    accessTokenStore.clear();
    localStorage.removeItem(HAS_SESSION_KEY);
  }
};

/** 회원정보 조회 */
export const saveUserInfo = async (): Promise<UserInfo> => {
  const { data } = await apiClient.get<ApiResponse<UserInfo>>('/members/info');
  if (!data.data) throw new Error('유저 데이터를 찾을 수 없습니다.');
  return data.data;
};

/** 앱 부팅 시 세션 시도 */
export const trySession = async (): Promise<UserInfo | null> => {
  try {
    const { data } = await apiClient.post<ApiResponse<{ accessToken: string }>>(
      '/auth/reissue',
      {},
    );
    const newAT = data.data?.accessToken ?? null;
    if (!newAT) {
      accessTokenStore.clear();
      localStorage.removeItem(HAS_SESSION_KEY);
      return null;
    }
    accessTokenStore.set(newAT);
    const me = await saveUserInfo();
    return me;
  } catch {
    accessTokenStore.clear();
    localStorage.removeItem(HAS_SESSION_KEY);
    return null;
  }
};
/** 회원가입 **/
export const registerMember = async (userData: RegisterReq): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.post<ApiResponse<unknown>>('/members', userData);
  return response.data;
};

/** 이메일 중복 및 도메인 유효성 검사 **/
export const checkEmailValidation = async (email: string): Promise<ApiResponse<boolean>> => {
  const response = await apiClient.get<ApiResponse<boolean>>('/members/validation/email', {
    params: { email },
  });
  return response.data;
};

/** 닉네임 중복 검증 **/
export const checkNicknameValidation = async (nickname: string): Promise<ApiResponse<boolean>> => {
  const response = await apiClient.get<ApiResponse<boolean>>('/members/validation/nickname', {
    params: { nickname },
  });
  return response.data;
};

/** 학번 중복 검증 **/
export const checkStuCodeValidation = async (
  studentCode: string,
): Promise<ApiResponse<boolean>> => {
  const response = await apiClient.get<ApiResponse<boolean>>('/members/validation/student-number', {
    params: { studentNumber: studentCode },
  });
  return response.data;
};

/** 이메일 인증코드 발송 **/
export const emailVerification = async (email: string): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.post<ApiResponse<null>>('/member/email/verify', { email });
  return data;
};

/** 이메일 인증 코드 체크 **/
export const verifyEmailCode = async (email: string, code: string): Promise<boolean> => {
  const { data } = await apiClient.post<ApiResponse<{ matched: boolean }>>('/member/email/check', {
    email,
    code,
  });
  return data.data?.matched ?? false;
};

/** 프로필 이미지 업로드 API */
export const uploadProfileImage = async (imageFile: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await apiClient.post<ApiResponse<string>>('/members/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: false,
  });
  return response.data.data ?? '';
};

/** 회원 탈퇴 **/
export const deleteUser = async (password: string): Promise<number> => {
  const res = await apiClient.delete('/members/info', {
    data: { password },
  });
  return res.status;
};

/** 비밀번호 찾기 - 이메일 인증코드 발송 */
export const sendEmailExists = async (email: string): Promise<boolean> => {
  const { data } = await apiClient.post<EmailVerifyResponse>('/member/email/verify', { email });
  return !!data.data;
};

/** 회원 계정 복구 - 코드 검증 */
export const sendAuthority = async (email: string, code: string): Promise<boolean> => {
  const payload = { email, code };
  const res = await apiClient.post<ApiResponse<string>>('/members/recovery/verify-code', payload);
  return (
    res.status === 200 &&
    (!!res.data.data || ['SUCCESS', 'API 요청 성공'].includes(res.data.status as string))
  );
};

/** 회원 계정 복구 - 비밀번호 재설정 */
export const changePassword = async (email: string, newPassword: string): Promise<boolean> => {
  const { data } = await apiClient.post<ResetPasswordResponse>('/members/recovery/reset', {
    email,
    newPassword,
  });
  return data.status === 'SUCCESS';
};
