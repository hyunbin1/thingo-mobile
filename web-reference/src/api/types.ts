/**
 * 표준 응답 반환 형식을 정의합니다
 */
export interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
  timestamp: string;
}

/**
 * 페이지네이션 반환 형식을 정의합니다
 */
export interface Paginated<T> {
  content: T[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number; // 현재 페이지 인덱스
  sort: Sort;
  numberOfElements: number; // 현재 페이지 내 아이템 수
  first: boolean;
  empty: boolean;
}

/**
 * 정렬정보 형식을 정의합니다
 */
export interface Sort {
  sorted: boolean;
  empty: boolean;
  unsorted: boolean;
}

/**
 * 페이징 요청, 응답 메타데이터를 정의합니다
 */
export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}
