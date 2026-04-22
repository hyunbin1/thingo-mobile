export type NavKey = 'notice' | 'department' | 'board' | 'meal' | 'calendar' | 'wiki' | 'sso';

/**
 * 네비게이션 아이템 정의 타입
 *
 * @property {NavKey} key - 메뉴 고유 식별자
 * @property {string} label - 메뉴명
 * @property {string} [path] - 앱 내부 라우팅 경로
 * @property {string} [href] - 외부 링크 url
 * @property {boolean} [requiresAuth] - 로그인 시 접근 가능한 메뉴 여부
 */
export type NavItem = {
  key: NavKey;
  label: string;
  path?: string;
  href?: string;
  requiresAuth?: boolean;
};
