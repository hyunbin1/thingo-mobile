import { clsx, type ClassValue } from 'clsx';
import { useState, useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import AcademicScheduleWidget from '@/components/molecules/sections/academic-schedule-widget';
import BoardSection from '@/components/molecules/sections/board';
import BroadcastSection from '@/components/molecules/sections/broadcast';
import CampusMap from '@/components/molecules/sections/campus-map';
import MealSection from '@/components/molecules/sections/meal';
import NewsSection from '@/components/molecules/sections/news';
import { NoticeSlideSection } from '@/components/molecules/sections/notice';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper';
import 'swiper/css';
import NoticeSection from '@/components/molecules/sections/notice';
import FilteringMealSection from '@/components/molecules/sections/filtering-meal';
import { useHeaderStore } from '@/store/useHeaderStore';

import { useNavTracking } from '@/hooks/gtm/useNavTracking';
import { resolveNavGroupByLabel } from '@/constants/gtm.ts';

/**
 * 전역 클래스 통합 유틸리티
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 8개 주요 카테고리(탭) 정의
 */
const TABS = [
  'ALL',
  '학식',
  '게시판',
  '명지도',
  '공지사항',
  '학사일정',
  '명대신문',
  '명대뉴스',
] as const;

type TabType = (typeof TABS)[number];

const SLIDES_TAB_STORAGE_KEY = 'slidesActiveTab';

// function getStoredSlidesTab(): TabType {
//   if (typeof window === 'undefined') return 'ALL';
//   const raw = sessionStorage.getItem(SLIDES_TAB_STORAGE_KEY);
//   const found = TABS.find((t) => t === raw);
//   return (found as TabType) ?? 'ALL';
// }
interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  /** 패널이 보일 때만 scrollIntoView 실행 (메인/학과 슬라이드에선 미실행) */
  isPanelVisible?: boolean;
}

const TabBar = ({ activeTab, onTabChange, isPanelVisible = true }: TabBarProps) => {
  const tabRefs = useRef<Partial<Record<TabType, HTMLButtonElement | null>>>({});
  // 탭바 스크롤 컨테이너 ref
  const scrollRef = useRef<HTMLDivElement>(null);

  const { trackNavClick } = useNavTracking();

  useEffect(() => {
    if (!isPanelVisible) return;
    const el = tabRefs.current[activeTab];
    const container = scrollRef.current;
    if (!el || !container) return;
    // 탭 중앙이 컨테이너 중앙에 오도록 scrollLeft 직접 계산
    const targetScrollLeft = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2;
    container.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
  }, [activeTab, isPanelVisible]);

  return (
    <div
      ref={scrollRef}
      className='border-grey-10 no-scrollbar swiper-no-swiping sticky top-0 z-10 w-full overflow-x-auto scroll-smooth border-b bg-white'
    >
      <div className='flex h-[39px] min-w-max items-center px-5'>
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              ref={(el) => {
                tabRefs.current[tab] = el;
              }}
              onClick={() => {
                onTabChange(tab);
                trackNavClick({
                  item_name: `top_tab:${tab}`,
                  item_label: tab,
                  nav_group: resolveNavGroupByLabel(tab),
                });
              }}
              className={cn(
                'relative flex h-full items-center justify-center px-5 pt-2.5 pb-2',
                isActive ? 'text-body04 text-mju-primary' : 'text-body06 text-grey-40',
              )}
            >
              <span className='text-body06 whitespace-nowrap'>{tab}</span>

              {/* 활성화된 탭 하단의 파란색 바 */}
              {isActive && (
                <div className='bg-mju-primary absolute right-0 bottom-0 left-0 h-[2px]' />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

type TabContentProps = {
  activeTab: TabType;
  onNavigateToNoticeTab?: () => void;
  onNavigateToBroadcastTab?: () => void;
  onNavigateToNewsTab?: () => void;
  onNavigateToBoardTab?: () => void;
  onNavigateToAcademicTab?: () => void;
};

/**
 * 'ALL' 탭 컨텐츠 컴포넌트
 */
const AllTab = ({
  onNavigateToNoticeTab,
  onNavigateToBroadcastTab,
  onNavigateToNewsTab,
  onNavigateToBoardTab,
  onNavigateToAcademicTab,
}: TabContentProps) => (
  <div className='bg-grey-02 flex flex-col gap-2'>
    {/* 식단 섹션 */}
    <div className='flex flex-col gap-4 bg-white py-4'>
      <FilteringMealSection />
    </div>

    {/* 공지사항 섹션 */}
    <div className='flex flex-col gap-4 bg-white py-4'>
      <NoticeSlideSection all={true} onSeeMoreClick={onNavigateToNoticeTab} />
    </div>

    {/* 학사일정 섹션 */}
    <div className='flex flex-col gap-4 bg-white py-4'>
      <AcademicScheduleWidget all={true} onSeeMoreClick={onNavigateToAcademicTab} />
    </div>

    {/* 게시판 섹션 */}
    <div className='flex flex-col gap-4 bg-white py-4'>
      <BoardSection all={true} onSeeMoreClick={onNavigateToBoardTab} />
    </div>

    {/* 명대신문 섹션 */}
    <div className='flex flex-col gap-4 bg-white pt-4'>
      <NewsSection all={true} onSeeMoreClick={onNavigateToNewsTab} />
    </div>

    {/* 명대뉴스 섹션 */}
    <div className='flex flex-col gap-4 bg-white py-4'>
      <BroadcastSection all={true} onSeeMoreClick={onNavigateToBroadcastTab} />
    </div>
  </div>
);

/**
 * 개별 탭 컨텐츠를 위한 공통 래퍼 컴포넌트
 */
const TabWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className='flex h-full flex-col gap-2 py-2'>{children}</div>
);

/**
 * 탭 타입별 렌더링 컴포넌트 매핑 객체
 * 컴포넌트들을 미리 정의 (Lazy Loading으로 성능 최적화)
 */
const TAB_CONTENT: Record<TabType, React.ComponentType<TabContentProps>> = {
  ALL: AllTab,
  명지도: () => <CampusMap />,
  공지사항: () => (
    <TabWrapper>
      <NoticeSection />
    </TabWrapper>
  ),
  학사일정: () => (
    <div>
      <AcademicScheduleWidget />
    </div>
  ),
  학식: () => (
    <TabWrapper>
      <MealSection />
    </TabWrapper>
  ),
  게시판: () => <BoardSection all={false} />,
  명대신문: () => (
    <TabWrapper>
      <NewsSection />
    </TabWrapper>
  ),
  명대뉴스: () => (
    <TabWrapper>
      <BroadcastSection />
    </TabWrapper>
  ),
};

/**
 * 슬라이드 메인 페이지 컴포넌트
 * 탭 상태는 전역 HeaderStore 및 세션 스토리지와 동기화하여
 * 메인 아이콘 클릭/새로고침 후에도 현재 탭을 유지한다.
 * 패널이 보일 때만 푸터/탭 스크롤 적용(IntersectionObserver).
 */
const Slides = () => {
  const { selectedTab, setSelectedTab, activeMainSlide, setActiveMainSlide } = useHeaderStore();
  const TAB_STORAGE_KEY = 'slides-active-tab';

  const getInitialTab = (): TabType => {
    if (selectedTab && TABS.includes(selectedTab as TabType)) {
      return selectedTab as TabType;
    }
    if (typeof window !== 'undefined') {
      const saved = window.sessionStorage.getItem(TAB_STORAGE_KEY);
      if (saved && TABS.includes(saved as TabType)) {
        return saved as TabType;
      }
    }
    return 'ALL';
  };

  const [activeTab, setActiveTab] = useState<TabType>(getInitialTab);
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  // stale closure 방지용 activeTab ref
  const activeTabRef = useRef<TabType>(activeTab);
  // HomeSlider 부모 스크롤 이동용 터치 시작 X 좌표
  const edgeTouchStartX = useRef<number | null>(null);

  useEffect(() => {
    activeTabRef.current = activeTab;
    try {
      sessionStorage.setItem(SLIDES_TAB_STORAGE_KEY, activeTab);
    } catch {
      // ignore
    }
  }, [activeTab]);

  // ALL 탭 경계에서 오른쪽 스와이프 → HomeSlider 부모 스크롤 이동
  // Swiper가 React 합성이벤트를 막으므로 네이티브 리스너(capture) 사용
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      if (activeTabRef.current === 'ALL') {
        edgeTouchStartX.current = e.touches[0].clientX;
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (edgeTouchStartX.current === null) return;
      const deltaX = e.changedTouches[0].clientX - edgeTouchStartX.current;
      edgeTouchStartX.current = null;
      // 오른쪽으로 60px 이상 스와이프 → HomeSlider(부모 Swiper) 메인으로 이동
      if (deltaX > 60 && activeTabRef.current === 'ALL') {
        // const homeSlider = el.parentElement?.parentElement;
        // if (homeSlider) {
        //   homeSlider.scrollTo({
        //     left: homeSlider.scrollLeft - homeSlider.clientWidth,
        //     behavior: 'smooth',
        //   });
        // }
        setActiveMainSlide(1);
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true, capture: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true, capture: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart, { capture: true });
      el.removeEventListener('touchend', onTouchEnd, { capture: true });
    };
  }, [setActiveMainSlide]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsPanelVisible(entry.isIntersecting),
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const syncTab = (tab: TabType, shouldSlide: boolean) => {
    setActiveTab(tab);
    setSelectedTab(tab);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(TAB_STORAGE_KEY, tab);
    }

    if (shouldSlide && swiper) {
      const index = TABS.indexOf(tab);
      if (index >= 0 && swiper.activeIndex !== index) {
        swiper.slideTo(index);
      }
    }
  };

  const handleTabChange = (tab: TabType) => {
    syncTab(tab, true);
  };

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!isPanelVisible) {
      if (footer) footer.style.display = 'block';
      document.body.style.overflow = 'auto';
      return;
    }
    if (activeTab === '명지도') {
      if (footer) footer.style.display = 'none';
      document.body.style.overflow = 'hidden';
    } else {
      if (footer) footer.style.display = 'block';
      document.body.style.overflow = 'auto';
    }
    return () => {
      if (footer) footer.style.display = 'block';
      document.body.style.overflow = 'auto';
    };
  }, [activeTab, isPanelVisible]);

  // 외부에서 selectedTab 이 변경된 경우(메인 아이콘 클릭 등) Slides 상태와 동기화
  useEffect(() => {
    if (!selectedTab || !TABS.includes(selectedTab as TabType)) return;
    const next = selectedTab as TabType;
    if (next === activeTab) return;
    syncTab(next, true);
  }, [selectedTab, activeTab]);

  return (
    <div
      ref={rootRef}
      className={cn('flex h-[calc(100dvh-39px)] flex-col overflow-hidden bg-white')}
    >
      <TabBar activeTab={activeTab} onTabChange={handleTabChange} isPanelVisible={isPanelVisible} />

      {/* 탭 메인 컨텐츠 영역 */}
      <main className='flex-1 overflow-hidden'>
        <Swiper
          initialSlide={TABS.indexOf(activeTab)}
          onSwiper={setSwiper}
          onSlideChange={(s) => syncTab(TABS[s.activeIndex], false)}
          className='h-full w-full'
          resistance={true}
          resistanceRatio={0}
          nested={true}
          touchReleaseOnEdges={true}
          simulateTouch={true}
        >
          {TABS.map((tab) => {
            const Content = TAB_CONTENT[tab];
            return (
              <SwiperSlide key={tab} className='h-full w-full overflow-y-auto'>
                {tab === '게시판' ? (
                  <BoardSection showWriteButton={activeMainSlide === 2 && activeTab === '게시판'} />
                ) : (
                  <Content
                    activeTab={activeTab}
                    onNavigateToNoticeTab={() => syncTab('공지사항', true)}
                    onNavigateToBroadcastTab={() => syncTab('명대뉴스', true)}
                    onNavigateToNewsTab={() => syncTab('명대신문', true)}
                    onNavigateToBoardTab={() => syncTab('게시판', true)}
                    onNavigateToAcademicTab={() => syncTab('학사일정', true)}
                  />
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </main>
    </div>
  );
};

export default Slides;
