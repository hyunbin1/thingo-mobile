import type { NavGroup } from '@/types/gtm';

/**
 * 구글애널리틱스 상수
 * SidebarV2 기준으로 nav_group 분류를 통일하기 위한 상수/함수
 * - information: 학과별 정보, 명지도, 공지사항, 학사일정, 학식, 명대신문, 명대뉴스
 * - community: 정보게시판, 자유게시판, 게시판
 * - 그 외: etc
 */
export const NAV_GROUP_INFORMATION_LABELS = new Set([
  '학과별 정보',
  '명지도',
  '공지사항',
  '학사일정',
  '학식',
  '명대신문',
  '명대뉴스',
]);

export const NAV_GROUP_COMMUNITY_LABELS = new Set(['정보게시판', '자유게시판', '게시판']);

export function resolveNavGroupByLabel(
  label: string,
): Extract<NavGroup, 'information' | 'community' | 'etc'> {
  if (NAV_GROUP_INFORMATION_LABELS.has(label)) return 'information';
  if (NAV_GROUP_COMMUNITY_LABELS.has(label)) return 'community';
  return 'etc';
}
