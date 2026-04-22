import { EMAIL_DOMAIN } from '../constants/common';

/**
 * 아이디만 입력된 이메일에 @mju.ac.kr을 붙여 full email로 변환합니다.
 * 이미 '@'가 포함된 경우 그대로 반환합니다.
 *
 * @example
 * toFullEmail("mju") // "mju@mju.ac.kr"
 * toFullEmail("mju@mju.ac.kr") // "mju@mju.ac.kr"
 */
export const toFullEmail = (email: string): string => {
  return email.includes('@') ? email : `${email}${EMAIL_DOMAIN}`;
};
