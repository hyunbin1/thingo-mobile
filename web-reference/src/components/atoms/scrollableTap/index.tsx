import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface TabComponentProps {
  tabs: Record<string, string>;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  className?: string;

  //gtm 트래킹
  onTabClick?: (key: string, label: string) => void;
}

/**
 * 탭 네비게이션 컴포넌트
 * `tabs` prop을 기반으로 클릭 가능한 탭 목록을 표시하며, 활성화된 탭 하단에 인디케이터 바가 표시됩니다.
 * 선택된 탭은 스크롤 시 왼쪽 끝에 위치합니다.
 *
 * @param tabs - 탭을 정의하는 객체. 객체의 **키(key)**는 영문 식별자, **값(value)**은 탭에 표시될 **레이블(label)**입니다. (예: { 'all': '전체', 'in-progress': '진행 중' })
 * @param currentTab - 현재 활성화된 탭의 고유 **식별자(key)**입니다.
 * @param setCurrentTab - 탭 클릭 시 호출되는 함수. 클릭된 탭의 **식별자(key)**를 인자로 받습니다.
 * @returns JSX Element
 */
function ScrollableTap({
  tabs,
  currentTab,
  setCurrentTab,
  className,
  onTabClick,
}: TabComponentProps) {
  const tabEntries = Object.entries(tabs);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const selectedEl = tabRefs.current[currentTab];
    if (selectedEl) {
      selectedEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }, [currentTab]);

  return (
    <div
      className={twMerge(
        'border-grey-10 no-scrollbar flex overflow-x-auto scroll-smooth border-b-1 px-5',
        'md:text-title02 text-body04',
        className,
      )}
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
            onClick={() => {
              setCurrentTab(key);
              onTabClick?.(key, label);
            }}
            className={clsx(
              'cursor-pointer px-5 pt-2.5 pb-2 whitespace-nowrap',
              isSelected
                ? 'text-body04 text-mju-primary border-mju-primary border-b-[2px]'
                : 'text-body06 text-grey-40',
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export { ScrollableTap };
