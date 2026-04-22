import type { Category } from '@/api/search';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface TabComponentProps {
  tabs: Record<string, string>;
  currentTab: string;
  setCurrentTab: (tab: Category | string) => void;
  className?: string;
}

/**
 * 탭 네비게이션 컴포넌트
 * `tabs` prop을 기반으로 클릭 가능한 탭 목록을 표시하며, 활성화된 탭 하단에 인디케이터 바가 표시됩니다.
 *
 * @param tabs - 탭을 정의하는 객체. 객체의 **키(key)**는 영문 식별자, **값(value)**은 탭에 표시될 **레이블(label)**입니다. (예: { 'all': '전체', 'in-progress': '진행 중' })
 * @param currentTab - 현재 활성화된 탭의 고유 **식별자(key)**입니다.
 * @param setCurrentTab - 탭 클릭 시 호출되는 함수. 클릭된 탭의 **식별자(key)**를 인자로 받습니다.
 * @returns JSX Element
 */
function Tabs({ tabs, currentTab, setCurrentTab, className }: TabComponentProps) {
  const tabEntries = Object.entries(tabs);

  return (
    <div
      className={twMerge(
        'border-grey-10 no-scrollbar flex gap-1.5 overflow-x-auto border-b-1',
        'md:text-title02 text-body02',
        className,
      )}
    >
      {tabEntries.map(([key, label]) => {
        const isSelected = currentTab === key;
        return (
          <button
            key={key}
            role='tab'
            aria-selected={isSelected}
            aria-controls={`tab-panel-${key}`}
            onClick={() => setCurrentTab(key)}
            className={`flex-1 cursor-pointer p-1 px-3 whitespace-nowrap md:p-3 ${isSelected ? 'text-blue-35 border-blue-35 border-b-2' : 'text-grey-40'} `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * 칩 네비게이션 컴포넌트
 * `tabs` prop을 기반으로 클릭 가능한 칩 목록을 표시하고, 활성화된 칩은 색상이 변경됩니다.
 * 선택된 칩이 왼쪽에 오도록 스크롤됩니다.
 *
 * @param tabs - 탭을 정의하는 객체. 객체의 **키(key)**는 영문 식별자, **값(value)**은 탭에 표시될 **레이블(label)**입니다. (예: { 'all': '전체', 'in-progress': '진행 중' })
 * @param currentTab - 현재 활성화된 탭의 고유 **식별자(key)**입니다.
 * @param setCurrentTab - 탭 클릭 시 호출되는 함수. 클릭된 탭의 **식별자(key)**를 인자로 받습니다.
 * @returns JSX Element
 */
const CHIP_TABS_LEFT_OFFSET = 0;

function ChipTabs({ tabs, currentTab, setCurrentTab }: TabComponentProps) {
  const tabEntries = Object.entries(tabs);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const container = scrollContainerRef.current;
    const selectedEl = tabRefs.current[currentTab];
    if (!container || !selectedEl) return;
    const targetScrollLeft = selectedEl.offsetLeft - CHIP_TABS_LEFT_OFFSET;
    container.scrollTo({
      left: Math.max(0, targetScrollLeft),
      behavior: 'smooth',
    });
  }, [currentTab]);

  return (
    <div className='overflow-x-hidden' style={{ contain: 'layout' }}>
      <div
        ref={scrollContainerRef}
        className='no-scrollbar swiper-no-swiping flex gap-1.5 overflow-x-auto scroll-smooth'
      >
        {tabEntries.map(([key, label]) => {
          const isSelected = currentTab === key;
          return (
            <button
              key={key}
              ref={(el) => {
                tabRefs.current[key] = el;
              }}
              role='tab'
              aria-selected={isSelected}
              aria-controls={`tab-panel-${key}`}
              onClick={() => setCurrentTab(key)}
              className={clsx`text-body05 shrink-0 cursor-pointer rounded-full px-3 py-1.5 whitespace-nowrap ${isSelected ? 'bg-blue-35 text-white' : 'border-grey-10 text-grey-40 border'} `}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 칩 네비게이션 컴포넌트
 * `tabs` prop을 기반으로 클릭 가능한 칩 목록을 표시하고, 활성화된 칩은 색상이 변경됩니다.
 *
 * @param tabs - 탭을 정의하는 객체. 객체의 **키(key)**는 영문 식별자, **값(value)**은 탭에 표시될 **레이블(label)**입니다. (예: { 'all': '전체', 'in-progress': '진행 중' })
 * @param currentTab - 현재 활성화된 탭의 고유 **식별자(key)**입니다.
 * @param setCurrentTab - 탭 클릭 시 호출되는 함수. 클릭된 탭의 **식별자(key)**를 인자로 받습니다.
 * @returns JSX Element
 */
function SegmentedControlTabs({ tabs, currentTab, setCurrentTab }: TabComponentProps) {
  const tabEntries = Object.entries(tabs);

  return (
    <div className='bg-grey-02 mb-3 flex w-full overflow-x-auto pt-2'>
      {tabEntries.map(([key, label]) => {
        const isSelected = currentTab === key;
        return (
          <button
            key={key}
            role='tab'
            aria-selected={isSelected}
            aria-controls={`tab-panel-${key}`}
            onClick={() => setCurrentTab(key)}
            className={clsx`text-body04 w-1/2 cursor-pointer rounded-t-[4px] py-2 whitespace-nowrap ${isSelected ? 'border-grey-10 border-x-1 border-t-1 bg-white text-black' : 'text-grey-40 bg-grey-02 border-grey-10 border-b-1'} `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export { Tabs, ChipTabs, SegmentedControlTabs };
