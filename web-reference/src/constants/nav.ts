import type { NavItem } from '../types/nav/item';

export const NAV_ITEMS: NavItem[] = [
  { key: 'notice', label: '공지사항', path: '/notice' },
  { key: 'department', label: '학과별정보', path: '/department' },
  { key: 'board', label: '게시판', path: '/board' },
  { key: 'meal', label: '식단', path: '/menu' },
  { key: 'calendar', label: '학사일정', path: '/academic-calendar' },
  {
    key: 'wiki',
    label: '띵지위키',
    href: 'https://namu.wiki/w/%EB%AA%85%EC%A7%80%EB%8C%80%ED%95%99%EA%B5%90',
  },
  {
    key: 'sso',
    label: 'SSO',
    href: 'https://sso.mju.ac.kr/sso/auth?client_id=portal&response_type=code&state=1772023996586&rd_c_p=loginparam&tkn_type=normal&redirect_uri=https%3A%2F%2Fportal.mju.ac.kr%2Fsso%2Fresponse.jsp',
  },
];
