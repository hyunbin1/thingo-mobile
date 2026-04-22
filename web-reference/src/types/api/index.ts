export interface RegisterReq {
  name: string;
  email: string;
  password: string;
  gender: string;
  nickname: string;
  departmentName: string;
  studentNumber: number;
  profileImageUrl: string | null;
}

export interface ApiResponse<T = unknown> {
  status?: 'SUCCESS' | 'ERROR';
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

// 이메일 인증 발송 응답 (data는 메시지 문자열)
export type EmailVerifyResponse = ApiResponse<string>;

// 코드 검증 응답 (data는 matched 결과)
export interface CheckCodeData {
  email: string;
  matched: boolean;
}
export type CheckCodeResponse = ApiResponse<CheckCodeData>;

// 비밀번호 재설정 응답 (data는 메시지 문자열)
export type ResetPasswordResponse = ApiResponse<string>;
