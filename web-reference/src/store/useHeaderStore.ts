import { create } from 'zustand';

export type BoardCategoryNav = 'NOTICE' | 'FREE' | null;

interface HeaderState {
  activeMainSlide: number;
  setActiveMainSlide: (index: number) => void;
  selectedTab: string | null;
  setSelectedTab: (tab: string | null) => void;
  /** 사이드바 등에서 게시판 탭으로 진입 시 선택할 카테고리. BoardSection에서 적용 후 null로 초기화 */
  boardCategory: BoardCategoryNav;
  setBoardCategory: (category: BoardCategoryNav) => void;
}

export const useHeaderStore = create<HeaderState>((set) => ({
  activeMainSlide: 1, // 기본값: 중앙 메인 홈
  setActiveMainSlide: (index) => set({ activeMainSlide: index }),
  selectedTab: null,
  setSelectedTab: (tab) => set({ selectedTab: tab }),
  boardCategory: null,
  setBoardCategory: (category) => set({ boardCategory: category }),
}));
