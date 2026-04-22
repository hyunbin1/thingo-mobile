import type { SlideTab } from '@/features/slides/constants/slide-tabs';

export type SlideBannerItem = {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  pageLabel: string;
  imageUrl: string;
  overlayTone?: string;
  bordered?: boolean;
  overlayImageUrl?: string;
};

export type SlideQuickLink = {
  id: string;
  label: string;
  caption?: string;
  icon: 'map' | 'meal' | 'notice' | 'schedule' | 'board' | 'dDay';
  iconUrl?: string;
  targetTab: SlideTab;
};

export type SlideMealSummary = {
  dateLabel: string;
  mealType: string;
  timeLabel: string;
  location: string;
  tags: string[];
  emptyMessage: string;
};

export type SlideListItem = {
  id: string;
  category?: string;
  title: string;
  metaLeft?: string;
  metaRight?: string;
  counts?: {
    likes?: number;
    comments?: number;
  };
};

export type SlideScheduleItem = {
  id: string;
  dateLabel: string;
  title: string;
  timeLabel: string;
};

export type SlideNewspaperItem = {
  id: string;
  title: string;
  summary: string;
  publisher: string;
  dateLabel: string;
};

export type SlideVideoItem = {
  id: string;
  title: string;
  dateLabel: string;
  channelLabel: string;
};

const BANNER_IMAGE_1 = 'https://www.figma.com/api/mcp/asset/0246d649-40f1-4ed5-a2af-36ff86b24f25';
const BANNER_IMAGE_2 = 'https://www.figma.com/api/mcp/asset/47c85a67-49a2-4c35-9c47-fb4ad00d673e';
const BANNER_IMAGE_2_OVERLAY = 'https://www.figma.com/api/mcp/asset/e79a5453-9ace-4ec2-b5a3-9529c7ae209b';
const BANNER_IMAGE_3 = 'https://www.figma.com/api/mcp/asset/5b4cb116-8a23-48ef-a060-f2592d8e6a56';

const QUICK_ICON_MAP = 'https://www.figma.com/api/mcp/asset/23c329a9-a61c-4ffa-8e65-be166752380e';
const QUICK_ICON_MEAL = 'https://www.figma.com/api/mcp/asset/0aab3204-90ad-4d4f-98ba-abec33853a57';
const QUICK_ICON_SCHEDULE = 'https://www.figma.com/api/mcp/asset/ff8e5b28-b7c7-4a30-ad22-af839297a389';
const QUICK_ICON_NOTICE = 'https://www.figma.com/api/mcp/asset/6c621ef9-1f79-4ae8-87ed-06ec69d7179b';
const QUICK_ICON_BOARD = 'https://www.figma.com/api/mcp/asset/7d44062f-fdd5-4383-9252-05bcba3adccb';

export const slideBannerItems: SlideBannerItem[] = [
  {
    id: 'main-banner',
    title: '배너 메인 카피\n2줄 형식 작성',
    subtitle: '배너 서브 카피 (최대 20글자)',
    badge: '띵고 소식',
    pageLabel: '1/5',
    imageUrl: BANNER_IMAGE_1,
    overlayTone: 'rgba(37, 135, 255, 0.28)',
  },
  {
    id: 'sub-banner',
    title: '배너 메인 카피\n2줄 형식 작성',
    subtitle: '배너 서브 카피 (최대 20글자)',
    badge: '띵고 소식',
    pageLabel: '2/5',
    imageUrl: BANNER_IMAGE_1,
    overlayTone: 'rgba(37, 135, 255, 0.28)',
  },
  {
    id: 'third-banner',
    title: '배너 메인 카피\n2줄 형식 작성',
    subtitle: '배너 서브 카피 (최대 20글자)',
    badge: '띵고 소식',
    pageLabel: '3/5',
    imageUrl: BANNER_IMAGE_1,
    overlayTone: 'rgba(37, 135, 255, 0.28)',
  },
  {
    id: 'banner-4',
    title: '諛곕꼫 硫붿씤 移댄뵾\n2以??뺤떇 ?묒꽦',
    subtitle: '諛곕꼫 ?쒕툕 移댄뵾 (理쒕? 20湲??',
    badge: '?듦퀬 ?뚯떇',
    pageLabel: '4/5',
    imageUrl: BANNER_IMAGE_1,
    overlayTone: 'rgba(37, 135, 255, 0.28)',
  },
  {
    id: 'banner-5',
    title: '諛곕꼫 硫붿씤 移댄뵾\n2以??뺤떇 ?묒꽦',
    subtitle: '諛곕꼫 ?쒕툕 移댄뵾 (理쒕? 20湲??',
    badge: '?듦퀬 ?뚯떇',
    pageLabel: '5/5',
    imageUrl: BANNER_IMAGE_1,
    overlayTone: 'rgba(37, 135, 255, 0.28)',
  },
];

export const slideQuickLinks: SlideQuickLink[] = [
  { id: 'quick-map', label: '명지도', icon: 'map', iconUrl: QUICK_ICON_MAP, targetTab: '명지도' },
  { id: 'quick-meal', label: '학식', icon: 'meal', iconUrl: QUICK_ICON_MEAL, targetTab: '학식' },
  {
    id: 'quick-schedule',
    label: '학사일정',
    icon: 'schedule',
    iconUrl: QUICK_ICON_SCHEDULE,
    targetTab: '학사일정',
  },
  {
    id: 'quick-notice',
    label: '공지사항',
    icon: 'notice',
    iconUrl: QUICK_ICON_NOTICE,
    targetTab: '공지사항',
  },
  {
    id: 'quick-board',
    label: '게시판',
    icon: 'board',
    iconUrl: QUICK_ICON_BOARD,
    targetTab: '게시판',
  },
  {
    id: 'quick-d-day',
    label: 'D-1',
    caption: '중간고사 강의 평가기간',
    icon: 'dDay',
    targetTab: '학사일정',
  },
];

export const slideMealSummary: SlideMealSummary = {
  dateLabel: '1월 21일 (화) 점심',
  mealType: '학생식당',
  timeLabel: '11:30 - 13:30',
  location: '학생회관 학생식당',
  tags: ['유부우엉밥', '스크램블드에그', '해쉬브라운&케찹', '그린샐러드&드레싱', '캔파인애플'],
  emptyMessage: '등록된 식단 내용이 없습니다.',
};

export const hotNoticeItems: SlideListItem[] = [
  {
    id: 'hot-notice-1',
    category: '일반',
    title: '2025학년도 명지대학교 청소년 홍보기자 모집 안내',
    metaRight: '5분전',
  },
  {
    id: 'hot-notice-2',
    category: '일반',
    title: '2025학년도 명지대학교 청소년 홍보기자단 모집',
    metaRight: '10분전',
  },
  {
    id: 'hot-notice-3',
    category: '장학',
    title: '글자수세기 글자수세기 글자수세기 글자수세기 글자수세기',
    metaRight: '11분전',
  },
  {
    id: 'hot-notice-4',
    category: '진로',
    title: '글자수세기 글자수세기 글자수세기 글자수세기',
    metaRight: '1일전',
  },
  {
    id: 'hot-notice-5',
    category: '학생활동',
    title: '글자수세기 글자수세기 글자수세기 글자수세기',
    metaRight: '25.08.25',
  },
];

export const hotBoardItems: SlideListItem[] = [
  {
    id: 'hot-board-1',
    category: '정보게시판',
    title: '게시판 제목 예시는 최대 한 줄입니다. 게시판 제목 게시판 제목 게시판 제목',
    metaLeft: '2025.XX.XX',
    counts: { likes: 0, comments: 0 },
  },
  {
    id: 'hot-board-2',
    category: '자유게시판',
    title: '게시판 제목 예시는 최대 한 줄입니다. 게시판 제목 게시판 제목 게시판 제목',
    metaLeft: '2025.XX.XX',
    counts: { likes: 0, comments: 0 },
  },
];

export const noticeFilterLabels = ['전체', '일반', '장학', '진로', '학생활동', '학사/학업'] as const;

export const noticeItems: SlideListItem[] = [
  {
    id: 'notice-1',
    category: '일반',
    title: '2025학년도 명지대학교 청소년 홍보기자 모집 안내',
    metaRight: '5분전',
  },
  {
    id: 'notice-2',
    category: '일반',
    title: '2025학년도 명지대학교 청소년 홍보기자단 모집',
    metaRight: '10분전',
  },
  {
    id: 'notice-3',
    category: '일반',
    title: '글자수세기 글자수세기 글자수세기 글자수세기 글자수세기',
    metaRight: '11분전',
  },
  {
    id: 'notice-4',
    category: '일반',
    title: '글자수세기 글자수세기 글자수세기 글자수세기',
    metaRight: '25.08.25',
  },
  {
    id: 'notice-5',
    category: '일반',
    title: '2025학년도 자연캠퍼스 사랑봉사단 모집',
    metaRight: '25.08.25',
  },
];

export const scheduleItems: SlideScheduleItem[] = [
  {
    id: 'schedule-1',
    dateLabel: '01.21 (화)',
    title: '[학부·대학원] 학기 개시일, 2학기 개강 학기 개시일, 2학기 개강',
    timeLabel: '01.05',
  },
  {
    id: 'schedule-2',
    dateLabel: '01.21 (화)',
    title: '[학부·대학원] 학기 개시일, 2학기 개강 학기 개시일',
    timeLabel: '01.05',
  },
  {
    id: 'schedule-3',
    dateLabel: '01.21 (화)',
    title: '[학부·대학원] 수강신청 변경 기간 수강신청 변경 기간수강신청 변경 기간수강신청 변경 기간',
    timeLabel: '01.05 - 01.09',
  },
];

export const boardItems: SlideListItem[] = [
  {
    id: 'board-1',
    title: '정보게시판 게시판 제목은 최대 한 줄입니다. 게시판 제목 게시판 제목',
    metaLeft: '2025.XX.XX',
    counts: { likes: 0, comments: 0 },
  },
  {
    id: 'board-2',
    title: '정보게시판 게시판 제목은 최대 한 줄입니다. 게시판 제목 게시판 제목',
    metaLeft: '2025.XX.XX',
    counts: { likes: 0, comments: 0 },
  },
  {
    id: 'board-3',
    title: '정보게시판 게시판 제목',
    metaLeft: '2025.XX.XX',
    counts: { likes: 0, comments: 0 },
  },
  {
    id: 'board-4',
    title: '정보게시판 게시판 제목',
    metaLeft: '2025.XX.XX',
    counts: { likes: 0, comments: 0 },
  },
];

export const newspaperFilterLabels = ['전체', '보도', '사회'] as const;

export const newspaperItems: SlideNewspaperItem[] = [
  {
    id: 'newspaper-1',
    title: '서대문구청 발표 학보사 기...',
    summary: '22일, 서대문구청(구청장 이성헌, 이하 이 구청장)은 서대문구 관내...',
    publisher: '서성운 편집장',
    dateLabel: '2025-08-15',
  },
  {
    id: 'newspaper-2',
    title: '학생처와 사무지원처, 두 처장...',
    summary: '대학 본부에 다양한 부처의 존재합니다. 그리고 각 부서는 저마다의 기...',
    publisher: '서성운 편집장, 최관현 대학 보도부장',
    dateLabel: '2025-08-15',
  },
  {
    id: 'newspaper-3',
    title: '사회봉사단과 함께하는 ESG...',
    summary: '20일부터 21일까지 양일간 명지서명 봉사단이 찾아 “2025학년도 1학기...',
    publisher: '권지민 수습기자',
    dateLabel: '2025-08-15',
  },
  {
    id: 'newspaper-4',
    title: '사회봉사단과 함께하는 ESG...',
    summary: '20일부터 21일까지 양일간 명지서명 봉사단이 찾아 “2025학년도 1학기...',
    publisher: '권지민 수습기자',
    dateLabel: '2025-08-15',
  },
];

export const newsVideoItems: SlideVideoItem[] = [
  {
    id: 'video-1',
    title: '명대뉴스 제목 예시 1-2줄 표시합니다. 명대뉴스 명대뉴스 명대뉴스 명대뉴스 명...',
    dateLabel: '2025.07.25',
    channelLabel: '명대신문',
  },
  {
    id: 'video-2',
    title: '명대뉴스 제목 예시 1-2줄 표시합니다.',
    dateLabel: '2025.07.25',
    channelLabel: '명대신문',
  },
];

export const campusMapSpots = ['학생회관', '인문도서관', '국제관', '정문', '버스정류장'];
