/**
 * ChipTabs / SegmentedControlTabs 탭에 따라 리스트를 필터링합니다.
 * category(섹션)와 categoryTab(현재 탭 키)을 넘기면, 해당 탭에 맞는 item.category만 남깁니다.
 *
 * 예: 게시판 - 정보 게시판(NOTICE) / 자유 게시판(FREE)
 */

export type FilterCategory = 'COMMUNITY' | 'NOTICE' | 'NEWS' | 'BROADCAST';

/** 섹션별 탭 키 → 아이템 category 값 매핑. undefined면 필터 없음(전체) */
const CATEGORY_TAB_MAP: Record<FilterCategory, Record<string, string | undefined>> = {
  COMMUNITY: {
    all: 'NOTICE', // 정보 게시판
    free: 'FREE', // 자유 게시판
  },
  NOTICE: {
    all: undefined,
    general: 'general',
    academic: 'academic',
    scholarship: 'scholarship',
    career: 'career',
    activity: 'activity',
    rule: 'rule',
  },
  // news와 broadcast는 category가 null로 넘어와서 임시로 필터 미적용
  NEWS: {
    all: undefined,
    report: undefined,
    society: undefined,
  },
  BROADCAST: {
    all: undefined,
    report: undefined,
    society: undefined,
  },
};

/** category로 필터할 수 있는 아이템 (SearchResultItemRes 등) */
export interface ItemWithCategory {
  category?: string;
}

/**
 * categoryTab이 바뀔 때마다 list를 category 기준으로 필터링합니다.
 * @param list 필터할 목록 (category 필드 있음)
 * @param category 섹션(COMMUNITY, NOTICE, MJU_CALENDAR 등)
 * @param categoryTab 현재 탭 키 (all, free, general 등)
 * @returns 필터된 목록
 */
export function filterByCategoryTab<T extends ItemWithCategory>(
  list: T[],
  category: FilterCategory,
  categoryTab: string,
): T[] {
  const tabMap = CATEGORY_TAB_MAP[category];
  if (!tabMap) return list;

  const filterValue = tabMap[categoryTab];
  if (filterValue === undefined) return list;

  return list.filter((item) => (item.category ?? '') === filterValue);
}
