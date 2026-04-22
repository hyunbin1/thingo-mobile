const KST = 'Asia/Seoul';

/**
 * 서버 ISO 문자열을 UTC 기준 Date로 파싱합니다.
 * 시간대 정보가 없으면 UTC로 간주합니다.
 */
function parseAsUTC(dateString: string): Date {
  const trimmed = dateString.trim();
  const hasTimezone = /[Zz]$|[+-]\d{2}:?\d{2}$/.test(trimmed);
  return new Date(hasTimezone ? trimmed : trimmed + 'Z');
}

/**
 * 서버 UTC 시간 응답값을 한국 시간대 기준 날짜-시간 형식으로 파싱합니다.
 * @param dateString 서버에서 응답받은 ISO 시간 (UTC).
 * @returns `2025-08-09 17:17`
 */
export const formatToLocalTime = (dateString: string): string => {
  const date = parseAsUTC(dateString);
  const parts = new Intl.DateTimeFormat('ko-KR', {
    timeZone: KST,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}`;
};

/**
 * 서버 UTC 시간 응답값을 한국 시간대 기준 날짜 형식으로 파싱합니다.
 * @param dateString 서버에서 응답받은 ISO 시간 (UTC).
 * @returns `2025-08-09`
 */
export const formatToLocalDate = (dateString: string): string => {
  const date = parseAsUTC(dateString);
  const parts = new Intl.DateTimeFormat('ko-KR', {
    timeZone: KST,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
};

/**
 * 서버 UTC 시간 응답값으로부터 경과시간을 파싱합니다.
 * @param dateString 서버에서 응답받은 ISO 시간 (UTC).
 * @returns `3분 전`
 */
export const formatToElapsedTime = (dateString: string): string => {
  const now = new Date();
  const past = parseAsUTC(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  const MINUTE = 60;
  const HOUR = MINUTE * 60;
  const DAY = HOUR * 24;
  const MONTH = DAY * 30;
  const YEAR = DAY * 365;

  if (diffInSeconds < 30) {
    return '방금 전';
  }
  if (diffInSeconds < MINUTE) {
    return `${diffInSeconds}초 전`;
  }
  if (diffInSeconds < HOUR) {
    return `${Math.floor(diffInSeconds / MINUTE)}분 전`;
  }
  if (diffInSeconds < DAY) {
    return `${Math.floor(diffInSeconds / HOUR)}시간 전`;
  }
  if (diffInSeconds < MONTH) {
    return `${Math.floor(diffInSeconds / DAY)}일 전`;
  }
  if (diffInSeconds < YEAR) {
    return `${Math.floor(diffInSeconds / MONTH)}달 전`;
  }
  return `${Math.floor(diffInSeconds / YEAR)}년 전`;
};
/**
 * 서버 UTC 날짜/시간을 한국 시간대 기준으로 `YYYY.MM.DD` 형식으로 변환합니다.
 * @param dateString 서버 응답 날짜 (예: `2025-11-13T10:55:57.233Z` 또는 `2025-11-13`)
 * @returns `2025.11.13`
 */
export const formatToDotDate = (dateString: string): string => {
  const date = parseAsUTC(dateString);
  const parts = new Intl.DateTimeFormat('ko-KR', {
    timeZone: KST,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('year')}.${get('month')}.${get('day')}`;
};

/** @deprecated formatToDotDate 사용 */
export const FormatToDotDate = formatToDotDate;
