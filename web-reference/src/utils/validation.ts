import { EMAIL_DOMAIN } from '../constants/common';

/**
 * 비밀번호 유효성 검사
 * - 8~127자
 * - 영문, 숫자, 특수문자 각각 1개 이상 포함
 *
 * @param password - 검증할 비밀번호
 * @returns 유효한 비밀번호인지 여부
 */
export const isValidPassword = (password: string): boolean => {
  if (!password) return false;
  if (password.length < 8 || password.length > 127) return false;
  if (!/[a-zA-Z]/.test(password)) return false;
  if (!/\d/.test(password)) return false;
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) return false;

  return true;
};

/**
 * 학번 유효성 검사
 * - 8자리 숫자
 *
 * @param code - 검증할 학번
 * @returns 유효한 학번인지 여부
 */
export const validateStudentCode = (code: string): boolean => {
  return /^\d{8}$/.test(code.trim());
};

/**
 * 명지대 이메일 유효성 검사 (완전 일치)
 * - @mju.ac.kr 도메인 포함
 * - 전체 이메일 형식 검증
 *
 * @param email - 검증할 이메일
 * @returns 유효한 명지대 이메일인지 여부
 */
export const validateMjuEmail = (email: string): boolean => {
  const escapedDomain = EMAIL_DOMAIN.replace('.', '\\.');
  return new RegExp(`^[\\w.-]+${escapedDomain}$`).test(email);
};

/**
 * 이메일 도메인 검사 (부분 일치)
 * - 대소문자 구분 없음
 * - 도메인 부분만 확인
 *
 * @param email - 검증할 이메일
 * @returns 명지대 도메인을 포함하는지 여부
 */
export const isMjuEmailDomain = (email: string): boolean => {
  const escapedDomain = EMAIL_DOMAIN.replace('.', '\\.');
  return new RegExp(`${escapedDomain}$`, 'i').test(email);
};
