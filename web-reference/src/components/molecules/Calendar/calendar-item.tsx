import clsx from 'clsx';

export interface CalendarEvent {
  id: number;
  startDate: string;
  endDate: string;
  description: string;
  category: string;
  color: string;
}

interface CalendarItemProps {
  day: number;
  outdated?: boolean;
  weekend?: boolean;
  events?: CalendarEvent[];
  onClick: () => void;
  isHighlighted?: boolean;
}

export function CalendarItem({
  day,
  outdated = false,
  weekend = false,
  events = [],
  onClick,
  isHighlighted = false,
}: CalendarItemProps) {
  return (
    <button onClick={onClick} disabled={outdated}>
      <div
        className={clsx(
          'flex min-h-15 flex-col py-1',
          !outdated &&
            'hover:bg-blue-05 cursor-pointer transition duration-50 hover:transition-none',
          isHighlighted && !outdated && 'bg-blue-05',
        )}
      >
        <span
          className={clsx(
            'text-caption04 mx-1 text-start text-black',
            outdated && 'text-grey-10',
            weekend && 'text-error',
          )}
        >
          {String(day).padStart(2, '0')}
        </span>

        {/* 이벤트 막대(bar) 렌더링 영역 */}
        <div className='mt-1 flex flex-col gap-0.5'>
          {events.map((event) => (
            <div
              key={event.id}
              title={event.description} // 마우스 호버 시 툴팁으로 설명 표시
              className={clsx('h-1 w-full', event.color)}
            />
          ))}
        </div>
      </div>
    </button>
  );
}
