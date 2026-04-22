import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper';
import 'swiper/css';
import Main from '@/pages';
import Slides from './slides';
import DepartmentMainPage from './departments';
import { useHeaderStore } from '@/store/useHeaderStore';

export const HOME_SLIDER_STORAGE_KEY = 'homeSliderSlide';
const STORAGE_KEY = HOME_SLIDER_STORAGE_KEY;
type SlideIndex = 0 | 1 | 2;

function getStoredSlideIndex(): SlideIndex {
  if (typeof window === 'undefined') return 1;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (raw === '0') return 0;
  if (raw === '2') return 2;
  return 1;
}

function setStoredSlideIndex(index: SlideIndex) {
  sessionStorage.setItem(STORAGE_KEY, String(index));
}

/** 로고 클릭 시 호출 → 무조건 메인(1)으로 가도록 저장 */
export function setHomeSliderToMain() {
  sessionStorage.setItem(HOME_SLIDER_STORAGE_KEY, '1');
}

/**
 * 전역 클래스 통합 유틸리티
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Swiper 기반 메인 페이지와 슬라이드 페이지를 가로 스와이프로 연결
 * 뒤로가기로 / 에 돌아오면 sessionStorage에 저장된 슬라이드(학과/메인/슬라이드)로 복원
 */
export default function HomeSlider() {
  const location = useLocation();
  const { activeMainSlide, setActiveMainSlide } = useHeaderStore();
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  const [mounted, setMounted] = useState(false);
  const isExternalChange = useRef(false);

  // / 에 진입할 때마다(마운트·뒤로가기) sessionStorage 기준으로 복원할 인덱스 결정
  useEffect(() => {
    if (location.pathname !== '/') return;
    setMounted(true);
    const stored = getStoredSlideIndex();
    setActiveMainSlide(stored);
  }, [location.pathname, setActiveMainSlide]);

  // 1. Swiper 초기화 시 저장된 슬라이드로 점프
  useEffect(() => {
    if (!swiper || !mounted) return;
    const stored = getStoredSlideIndex();
    swiper.slideTo(stored, 0);
  }, [swiper, mounted]);

  // 2. bfcache(뒤로가기로 페이지 복원) 시 스크롤 복원
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (!e.persisted || location.pathname !== '/') return;
      if (!swiper) return;
      const stored = getStoredSlideIndex();
      swiper.slideTo(stored, 0);
      setActiveMainSlide(stored);
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, [location.pathname, swiper, setActiveMainSlide]);

  // 3. 슬라이드가 바뀔 때마다 sessionStorage에 저장
  useEffect(() => {
    if (!swiper) return;
    setStoredSlideIndex(activeMainSlide as SlideIndex);
  }, [activeMainSlide, swiper]);

  // 4. 외부 상태 변경 (로고 클릭, MainSearchSection 등) 대응 → Swiper 슬라이드 이동
  useEffect(() => {
    if (!swiper) return;
    if (swiper.activeIndex === activeMainSlide) return;
    isExternalChange.current = true;
    swiper.slideTo(activeMainSlide);
  }, [activeMainSlide, swiper]);

  const handleSlideChange = (s: SwiperClass) => {
    if (isExternalChange.current) {
      isExternalChange.current = false;
      return;
    }
    const index = s.activeIndex as SlideIndex;
    setActiveMainSlide(index);
  };

  if (!mounted) return null;

  return (
    <Swiper
      onSwiper={setSwiper}
      onSlideChange={handleSlideChange}
      initialSlide={getStoredSlideIndex()}
      className={cn('h-full w-full')}
      resistance={true}
      resistanceRatio={0}
      touchReleaseOnEdges={false}
      nested={true}
      slidesPerView={1}
      spaceBetween={0}
    >
      {/* Index 0: 학과 */}
      <SwiperSlide className='h-full'>
        <div className='h-full overflow-y-auto'>
          <DepartmentMainPage />
        </div>
      </SwiperSlide>

      {/* Index 1: 메인 홈 */}
      <SwiperSlide className='h-full'>
        <div className='h-full overflow-y-auto'>
          <Main />
        </div>
      </SwiperSlide>

      {/* Index 2: 슬라이드 */}
      <SwiperSlide className='h-full overflow-hidden'>
        <Slides />
      </SwiperSlide>
    </Swiper>
  );
}
