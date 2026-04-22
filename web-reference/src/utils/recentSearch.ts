// 최근 검색어 관련 유틸리티
// scope(예: user uuid)별로 키를 나누어 모바일 등에서 사용자마다 목록이 공유되지 않도록 함
const RECENT_SEARCH_KEY_PREFIX = 'recent_search_keywords_v1';
const DEFAULT_MAX = 10;
const ANONYMOUS_SCOPE = 'anonymous';

function getStorageKey(scope?: string): string {
  return `${RECENT_SEARCH_KEY_PREFIX}_${scope ?? ANONYMOUS_SCOPE}`;
}

// localStorage에서 받은 문자열을 json으로 파싱, 문자열로 반환
// 런타임 에러 방지
function safeParseList(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === 'string');
  } catch {
    return [];
  }
}

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/**
 * 최근 검색어 로드
 * @param scope 사용자 구분자(예: user.uuid). 없으면 anonymous(비로그인 공용)
 */
export function loadRecentKeywords(scope?: string): string[] {
  if (!canUseStorage()) return [];
  return safeParseList(window.localStorage.getItem(getStorageKey(scope)));
}

/**
 * 최신 검색어 저장 (내부용)
 */
function saveRecentKeywords(list: string[], scope?: string) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(getStorageKey(scope), JSON.stringify(list));
}

/**
 * 최신 검색어에 추가
 * @param scope 사용자 구분자(예: user.uuid). 없으면 anonymous
 */
export function addRecentKeyword(keyword: string, max: number = DEFAULT_MAX, scope?: string) {
  const k = keyword.trim();
  if (!k) return;
  const prev = loadRecentKeywords(scope);
  const next = [k, ...prev.filter((x) => x !== k)].slice(0, max);
  saveRecentKeywords(next, scope);
}

/**
 * 최신 검색어에서 keyword 삭제
 * @param scope 사용자 구분자. 없으면 anonymous
 */
export function removeRecentKeyword(keyword: string, scope?: string) {
  const k = keyword.trim();
  if (!k) return;
  const next = loadRecentKeywords(scope).filter((x) => x !== k);
  saveRecentKeywords(next, scope);
}

/**
 * 최신 검색어에서 모두 제거
 * @param scope 사용자 구분자. 없으면 anonymous
 */
export function clearRecentKeywords(scope?: string) {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(getStorageKey(scope));
}
