export type BuildingCategory = '건물' | '캠퍼스 시설' | '편의시설' | '기타';

/**
 * 장소 내 상세 정보 타입 (위치, 장소명, 추가 정보)
 */
export type SubItem = {
  location: string;
  name: string;
  description?: string; // 토글 등으로 보여줄 상세 정보
};

/**
 * 건물 또는 시설 항목 타입
 */
export type Building = {
  id: string;
  name: string;
  category: BuildingCategory;
  campus: string;
  subItems?: SubItem[];
};

export type CampusData = {
  name: string;
  buildings: Building[];
};

export const MAP_DATA = {
  titles: {
    CAMPUS: '캠퍼스',
    BUILDING: '건물',
    CAMPUS_FACILITY: '캠퍼스 시설',
    AMENITY: '편의시설',
  },
  campuses: [
    {
      name: '인문캠퍼스',
      buildings: [
        // --- 건물 카테고리 ---
        {
          id: 'b-1',
          name: '종합관(구 본관)',
          category: '건물',
          campus: '인문캠퍼스',
          subItems: [
            { location: 'F10', name: '대강당(채플관)' },
            { location: 'F5-6', name: '생활관 연결 통로' },
            { location: 'F4', name: '편의점(emart24)' },
            { location: 'F2', name: '학관 구름다리(학생회관 4층 연결)' },
            { location: 'F1', name: '프린터, 증명서 발급기, 흡연부스(종합관 뒤)' },
          ],
        },
        {
          id: 'b-2',
          name: '학생회관',
          category: '건물',
          campus: '인문캠퍼스',
          subItems: [
            {
              location: 'F4',
              name: '스터디 라운지, 프린터, 학관 구름다리(종합관 2층 연결), 남/여 휴게실',
            },
            {
              location: 'F3',
              name: '학생식당, 편의점(이마트24), 카페(리에토커피), 외부 출입구, 흡연부스 (a.k.a. 담배나무)',
            },
            { location: 'F1', name: '우편취급국, 새마을금고, 소강당, 흡연부스 (a.k.a. 담배나무)' },
          ],
        },
        { id: 'b-3', name: '미래관', category: '건물', campus: '인문캠퍼스', subItems: [] },
        {
          id: 'b-4',
          name: '국제관(구 경상관)',
          category: '건물',
          campus: '인문캠퍼스',
          subItems: [
            { location: 'F4-5', name: '생활관 연결 통로' },
            { location: 'F3', name: '외부 출입구' },
            {
              location: 'F1',
              name: '학생편의시설(보건의료센터, 장애학생지원센터, 학생상담센터)',
            },
          ],
        },
        {
          id: 'b-5',
          name: '행정동',
          category: '건물',
          campus: '인문캠퍼스',
          subItems: [
            {
              location: 'F1',
              name: 'MJ대학일자리센터, 하나은행, ATM(하나은행/KB국민은행/SC제일은행/명지새마을금고), 흡연구역',
            },
          ],
        },
        {
          id: 'b-8',
          name: '생활관',
          category: '건물',
          campus: '인문캠퍼스',
          subItems: [{ location: 'F1', name: '편의점(세븐일레븐)' }],
        },
        {
          id: 'b-9',
          name: '방목학술정보관(도서관)',
          category: '건물',
          campus: '인문캠퍼스',
          subItems: [
            { location: 'F4', name: '개방형 열람실' },
            { location: 'F3', name: '프린트, 디지털정보자료실, 개방형 열람실, 구름다리' },
            { location: 'F2', name: '스터디룸, 명지-LG한국학자료관' },
            {
              location: 'F1',
              name: '국제회의장, 프린트, 자유열람실, 일반열람실1, 일반열람실2, 노트북열람실, 대학원 열람실, 흡연구역',
            },
            { location: '방목학술정보관 B2-3', name: '도서관 지하주차장' },
          ],
        },
        {
          id: 'b-10',
          name: 'MCC',
          category: '건물',
          campus: '인문캠퍼스',
          subItems: [
            { location: 'F2', name: '편의점(세븐일레븐), 애슐리, 건땀' },
            {
              location: 'F1',
              name: 'MCC관 출입구, MCC 지상 주차장(1-2층), 다목적 체육 시설(농구, 배드민턴, 탁구, 피크볼, 골프, 탈의실), 카페(스타벅스, 매머드커피), 올리브영, 베이커리랩, 이마트에브리데이(다이소), ',
            },
            { location: '지상', name: '운동장, 농구장, MCC 야외 주차장, 흡연구역(농구장 옆)' },
          ],
        },

        // --- 캠퍼스 시설 카테고리 ---
        {
          id: 'f-1',
          name: '학식당',
          category: '캠퍼스 시설',
          campus: '인문캠퍼스',
          subItems: [{ location: '학생회관 F3', name: '학식당' }],
        },
        {
          id: 'f-2',
          name: '캠퍼스 출입구',
          category: '캠퍼스 시설',
          campus: '인문캠퍼스',
          subItems: [
            { location: '인문캠퍼스 정문', name: '인문캠퍼스 정문' },
            {
              location: '인문캠퍼스 후문',
              name: '인문캠퍼스 후문',
              description: 'a.k.a. 도서관 후문',
            },
            {
              location: '생활관 후문',
              name: '생활관 후문',
              description: 'a.k.a. 담벼락 후문',
            },
            { location: '인문캠퍼스 서문', name: '인문캠퍼스 서문' },
            { location: 'MCC관 출입구', name: 'MCC관 출입구' },
          ],
        },
        {
          id: 'f-3',
          name: '건물 출입구/통로/지름길',
          category: '캠퍼스 시설',
          campus: '인문캠퍼스',
          subItems: [
            { location: '인문캠퍼스 정문', name: '바보 계단' },
            { location: '종합관 F5-6', name: '종합관-생활관 연결 통로' },
            { location: '종합관 F5-6 지상', name: '후문 지름길' },
            {
              location: '종합관 F2-학생회관 F4',
              name: '종합관-학생회관 연결 통로',
              description: 'a.k.a. 학관 구름다리',
            },
            { location: '국제관 F4-5', name: '국제관-생활관 연결 통로' },
            { location: '국제관 F3', name: '국제관 출입구' },
            { location: '학생회관 F3', name: '학생회관 출입구' },
            {
              location: '방목학술정보관 F3',
              name: '외부 연결 통로',
              description: 'a.k.a. 도서관 구름다리',
            },
          ],
        },
        {
          id: 'f-4',
          name: '운동 시설',
          category: '캠퍼스 시설',
          campus: '인문캠퍼스',
          subItems: [
            { location: 'MCC 지상', name: '운동장' },
            { location: 'MCC 지상', name: '농구장' },
            {
              location: 'MCC F1',
              name: '다목적 체육 시설',
              description: '농구, 배드민턴, 탁구, 피크볼, 골프, 탈의실',
            },
          ],
        },
        {
          id: 'f-5',
          name: '주차장',
          category: '캠퍼스 시설',
          campus: '인문캠퍼스',
          subItems: [
            {
              location: '방목학술정보관 B2-3',
              name: '도서관 지하주차장',
              description: '외부인 이용 가능, 정문 (행정동 옆)+후문 (도서관 출입구)',
            },
            {
              location: 'MCC 지상',
              name: 'MCC 주차장',
              description:
                '1-2층 지상 주차장 (1층: 외부인 이용 가능 / 2층: 정기권만 이용 가능), 4층 야외 주차장 (정기권만 이용 가능)',
            },
          ],
        },
        {
          id: 'f-6',
          name: '흡연 부스',
          category: '캠퍼스 시설',
          campus: '인문캠퍼스',
          subItems: [
            { location: '종합관 1F 후문', name: '흡연부스', description: 'a.k.a. 종합관 뒷골목' },
            { location: '학생회관 뒤', name: '흡연부스', description: 'a.k.a. 담배나무' },
            { location: 'MCC 농구장 옆', name: '흡연구역' },
            { location: '방목학술정보관 앞/행정동 옆', name: '흡연구역' },
          ],
        },

        // --- 편의시설 카테고리 ---
        {
          id: 'p-1',
          name: '편의점/마트',
          category: '편의시설',
          campus: '인문캠퍼스',
          subItems: [
            { location: '행정동 1F', name: '세븐일레븐' },
            { location: 'MCC F2', name: '세븐일레븐' },
            { location: '종합관 F4', name: '이마트24' },
            { location: '학생회관 F3', name: '이마트24_학생회관' },
            { location: '생활관 F1', name: '이마트24_생활관' },
            { location: 'MCC F1', name: '이마트에브리데이_MCC' },
            { location: 'MCC F1', name: '다이소_MCC' },
            { location: 'MCC F1', name: '올리브영' },
          ],
        },
        {
          id: 'p-2',
          name: '음식점',
          category: '편의시설',
          campus: '인문캠퍼스',
          subItems: [{ location: 'MCC F1', name: '애슐리 퀸즈' }],
        },
        {
          id: 'p-3',
          name: '카페',
          category: '편의시설',
          campus: '인문캠퍼스',
          subItems: [
            { location: 'MCC F1', name: '매머드커피' },
            { location: 'MCC F1', name: '스타벅스' },
            { location: 'MCC F1', name: '베이커리 랩(Bakery Lab)' },
            { location: '학생회관 F3', name: '리에토 커피' },
          ],
        },
        {
          id: 'p-4',
          name: '운동',
          category: '편의시설',
          campus: '인문캠퍼스',
          subItems: [
            {
              location: 'MCC F1',
              name: '다목적 체육관',
              description:
                '농구 1코트, 배드민턴 4코트, 탁구대 4대, 피클볼 2코트. 이용방법: ‘서울시 공공서비스 예약시스템’을 통해 사전 예약 후 이용 가능',
            },
            {
              location: 'MCC F1',
              name: '스크린파크골프장',
              description: '스크린 골프 4타석. 이용 방법: 현장 키오스크를 통해 당일 접수 가능',
            },
            { location: 'MCC F2', name: '건강과땀', description: '헬스장' },
          ],
        },
        {
          id: 'p-5',
          name: '야식트럭',
          category: '편의시설',
          campus: '인문캠퍼스',
          subItems: [
            {
              location: '인문캠퍼스 후문',
              name: '통닭트럭_인문캠퍼스 후문(도서관 뒤)',
              description: '도서관 뒤 (a.k.a. 통트), 매주 수/금, 22시~',
            },
            { location: '인문캠퍼스 정문', name: '꼬치트럭' },
          ],
        },
        {
          id: 'p-6',
          name: '은행/우편',
          category: '편의시설',
          campus: '인문캠퍼스',
          subItems: [
            { location: '학생회관 F1', name: '우편취급국_학생회관 1층' },
            { location: '학생회관 F1', name: '새마을금고' },
            {
              location: '행정동 F1',
              name: '하나은행, ATM(하나은행, 명지새마을금고, KB국민은행, SC제일은행)',
            },
          ],
        },
        {
          id: 'p-7',
          name: '기타',
          category: '편의시설',
          campus: '인문캠퍼스',
          subItems: [
            { location: '종합관 F1, 학생회관 F4, 방목학술정보관 F1/F3', name: '프린트' },
            { location: '학생회관 F4', name: '남/녀 휴게실' },
            { location: '종합관 F1, 학생회관 F3, MCC F3', name: '보조배터리(충전돼지)' },
            { location: '종합관 F1, 행정동 F1', name: '자동증명발급기' },
          ],
        },
      ],
    },
  ] as CampusData[],
};

export const MAP_CATEGORIES: Record<string, BuildingCategory> = {
  BUILDING: '건물',
  FACILITY: '캠퍼스 시설',
  AMENITY: '편의시설',
  ETC: '기타',
};
