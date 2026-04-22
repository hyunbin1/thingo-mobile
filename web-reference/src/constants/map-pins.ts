/**
 * 인문캠퍼스 명지도 핀 좌표 데이터 (단위: %)
 */
export const BUILDING_PINS = [
  { id: 'S1', value: '1', left: 38.64, top: 38.83, targetId: 'b-1' }, // 종합관
  { id: 'S2', value: '2', left: 60.43, top: 44.17, targetId: 'b-2' }, // 학생회관
  { id: 'S3', value: '3', left: 18.41, top: 30.17, targetId: 'b-3' }, // 미래관
  { id: 'S4', value: '4', left: 74.21, top: 23.17, targetId: 'b-4' }, // 국제관
  { id: 'S5', value: '5', left: 78.52, top: 62.5, targetId: 'b-5' }, // 행정동
  { id: 'S8', value: '8', left: 56.48, top: 18.33, targetId: 'b-8' }, // 생활관
  { id: 'S9', value: '9', left: 86.89, top: 33.33, targetId: 'b-9' }, // 도서관
  { id: 'S10', value: '10', left: 11.48, top: 52, targetId: 'b-10' }, // mcc
] as const;

export const ENTRANCE_PINS = [
  { id: 'entrance-1', left: 52.95, top: 10.67 }, // 기숙사 후문
  { id: 'entrance-2', left: 95.39, top: 16.17 }, // 도서관 후문
  { id: 'entrance-3', left: 6.82, top: 30.33 }, // mcc 후문
  { id: 'entrance-4', left: 8.18, top: 86.83 }, // 명지대 정문
  { id: 'entrance-5', left: 55.91, top: 91.33 }, // 명지대 구 정문
] as const;

/**
 * 항목 ID → 강조할 핀 ID 목록 매핑
 * - 건물: 해당 건물 핀 1개
 * - 시설/편의시설: 관련 여러 건물 핀
 */
export const BUILDING_HIGHLIGHT_MAP: Record<string, string[]> = {
  // 건물 - 각 곳 한 개 핀
  'b-1': ['S1'],
  'b-2': ['S2'],
  'b-3': ['S3'],
  'b-4': ['S4'],
  'b-5': ['S5'],
  'b-8': ['S8'],
  'b-9': ['S9'],
  'b-10': ['S10'],
  // 캠퍼스 시설
  'f-1': ['S2'], // 학식당 → 학생회관
  'f-2': ['entrance-1', 'entrance-2', 'entrance-3', 'entrance-4', 'entrance-5'], // 캠퍼스 출입구 → 모든 출입구 핀
  'f-3': ['S1', 'S2', 'S4', 'S9'], // 건물 출입구/통로/지름길
  'f-4': ['S10'], // 운동 시설 → MCC
  'f-5': ['S9', 'S10'], // 주차장 → 도서관, MCC
  'f-6': ['S1', 'S2', 'S4', 'S5', 'S9', 'S10'], // 흥연 부스
  // 편의시설
  'p-1': ['S1', 'S2', 'S4', 'S5', 'S8', 'S10'], // 편의점/마트
  'p-2': ['S10'], // 음식점 → MCC
  'p-3': ['S2', 'S10'], // 카페 → 학생회관, MCC
  'p-4': ['S10'], // 운동 → MCC
  'p-5': ['entrance-2', 'entrance-5'], // 야식트럭 → 도서관 후문
  'p-6': ['S2', 'S5'], // 은행/우편 → 학생회관, 행정동
  'p-7': ['S1', 'S2', 'S5', 'S9', 'S10'], // 기타
};
