// 공지 카테고리 (전체 포함)
export type NoticeCategory =
  | 'all'
  | 'general'
  | 'academic'
  | 'scholarship'
  | 'career'
  | 'activity'
  | 'rule';

// ── API 요청 파라미터
export interface NoticeQueryParams {
  category: NoticeCategory;
  page: number; // 0-base
  size: number;
  sort: 'asc' | 'desc';
  year?: number; // (연도 제한 필요 시만 사용)
}

// ── API 응답(항목)
export interface NoticeItem {
  category: Exclude<NoticeCategory, 'all'>;
  date: string; // 예: '2025.04.08'
  link: string;
  title: string;
}

// ── API 응답(pageable)
export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

// ── API 응답(최상위)
export interface NoticeResponse {
  content: NoticeItem[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
