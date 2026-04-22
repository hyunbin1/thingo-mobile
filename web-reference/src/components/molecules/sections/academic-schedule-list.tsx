import type { CalendarScheduleItem } from '@/api/main/calendar';
import clsx from 'clsx';

type CategoryKey = 'all' | 'undergrad' | 'graduate' | 'holiday';

const categoryMap: Record<CategoryKey, string> = {
  all: '전체',
  undergrad: '학부',
  graduate: '대학원',
  holiday: '휴일',
};

interface ScheduleListProps {
  viewDate: Date;
  selectedDate: Date | null;
  selectedCategory: CategoryKey;
  onCategoryToggle: () => void;
  isCategoryOpen: boolean;
  onCategorySelect: (category: CategoryKey) => void;
  isLoading: boolean;
  dailyScheduleList: (CalendarScheduleItem & { categoryLabel: string })[];
  all?: boolean;
}

/**
 * 학사일정 리스트 컴포넌트
 */
export function ScheduleList({
  viewDate,
  selectedDate,
  selectedCategory,
  onCategoryToggle,
  isCategoryOpen,
  onCategorySelect,
  isLoading,
  dailyScheduleList,
  all = false,
}: ScheduleListProps) {
  const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];
  const titleText =
    selectedDate === null
      ? `${viewDate.getFullYear()}년 ${(viewDate.getMonth() + 1).toString().padStart(2, '0')}월`
      : `${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}.${selectedDate.getDate().toString().padStart(2, '0')} (${dayLabels[selectedDate.getDay()]})`;

  return (
    <div className='flex flex-col gap-[8px]'>
      {/* 타이틀 영역 - 배경색과 테두리 추가 */}
      <div className='flex items-center justify-between border-b border-solid border-[#f0f2f5] bg-white py-[4px] pr-[18px] pl-[20px]'>
        <h4 className='text-body02 text-mju-primary'>{titleText}</h4>

        {/* 카테고리 필터 */}
        {!all && (
          <div className='relative'>
            <button
              onClick={onCategoryToggle}
              className='flex items-center gap-[4px] text-[12px] leading-[1.5] font-normal text-[#aeb2b6] transition-colors outline-none hover:text-black'
            >
              {categoryMap[selectedCategory]}
              {/* 왼쪽 화살표 아이콘 (90도 회전) */}
              <div
                className={clsx(
                  'flex h-[16px] w-[16px] items-center justify-center transition-transform',
                  isCategoryOpen ? '-rotate-90' : 'rotate-90',
                )}
              >
                <svg width='4.8' height='9.6' viewBox='0 0 4.8 9.6' fill='none'>
                  <path
                    d='M0.8 1.6L3.2 4.8L0.8 8'
                    stroke='currentColor'
                    strokeWidth='1.6'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
            </button>
            {isCategoryOpen && (
              <>
                <div className='fixed inset-0 z-10' onClick={onCategoryToggle} />
                <div className='border-grey-10 absolute top-full right-0 z-20 mt-1 flex w-20 flex-col overflow-hidden border bg-white pt-1 shadow-[0_4px_12px_0_rgba(0,0,0,0.08)]'>
                  {(Object.keys(categoryMap) as CategoryKey[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => onCategorySelect(key)}
                      className={clsx(
                        'hover:bg-blue-05 text-caption02 w-full px-3 py-2 text-center transition-colors',
                        selectedCategory === key ? 'text-blue-35 bg-blue-05' : 'text-grey-30',
                      )}
                    >
                      {categoryMap[key]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* 일정 리스트 */}
      <div className='flex flex-col'>
        {isLoading ? (
          <div className='bg-grey-02 h-24 w-full animate-pulse rounded-md' />
        ) : dailyScheduleList.length > 0 ? (
          dailyScheduleList.map((event, i) => (
            <div key={`${event.id}-${i}`} className='flex gap-2 px-5 py-2'>
              <span className='text-caption02 text-grey-40 w-20'>
                {formatDateRange(event.startDate, event.endDate)}
              </span>
              <p className='text-caption02 line-clamp-2 flex-1 text-black'>
                <span className='font-bold'>[{event.categoryLabel}] </span>
                {removeBracketedContent(event.description)}
              </p>
            </div>
          ))
        ) : (
          <div className='flex flex-col items-center justify-center gap-2 py-12'>
            <p className='text-grey-20 text-[12px]'>표시할 일정이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const formatDateRange = (startDate: string, endDate: string) => {
  // YYYY-MM-DD 형식의 문자열을 MM.DD 형식으로 변환
  const formatDate = (dateStr: string) => {
    const [, month, day] = dateStr.split('-');
    return `${month}.${day}`;
  };

  return startDate === endDate
    ? formatDate(startDate)
    : `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

function removeBracketedContent(str: string): string {
  return str.replace(/\[.*?\]/g, '').trim();
}
