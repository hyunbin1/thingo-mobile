import type { SlideTab } from '@/features/slides/constants/slide-tabs';

/**
 * 웹의 sessionStorage 대응으로 앱 런타임 동안 마지막 탭을 메모리에만 유지한다.
 * 저장소 의존성을 추가하지 않고도 탭 복귀 UX를 유지하기 위한 최소 구현이다.
 */
let lastSelectedSlideTab: SlideTab = 'ALL';

export function getLastSelectedSlideTab() {
  return lastSelectedSlideTab;
}

export function setLastSelectedSlideTab(tab: SlideTab) {
  lastSelectedSlideTab = tab;
}
