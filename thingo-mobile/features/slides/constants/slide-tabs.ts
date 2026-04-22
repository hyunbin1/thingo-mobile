/**
 * 웹 slides와 모바일 slides가 같은 탭 순서를 공유하도록 단일 기준 배열을 둔다.
 * 탭 버튼, 가로 페이저, 빠른 이동 카드가 모두 이 값을 기준으로 이동한다.
 */
export const SLIDE_TABS = [
  'ALL',
  '학식',
  '게시판',
  '명지도',
  '공지사항',
  '학사일정',
  '명대신문',
  '명대뉴스',
] as const;

export type SlideTab = (typeof SLIDE_TABS)[number];

export function getSlideTabIndex(tab: SlideTab) {
  return SLIDE_TABS.indexOf(tab);
}
