import type { CalendarMonthlyRes } from '@/api/main/calendar';
import { useMemo, useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { twMerge } from 'tailwind-merge';
import { CalendarItem } from './calendar-item';

interface CalendarProps {
  className?: string;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  events: CalendarMonthlyRes | null;
  onDateSelect: (date: Date | null) => void;
}

export default function Calendar({
  className,
  onYearChange,
  onMonthChange,
  events,
  onDateSelect,
}: CalendarProps) {
  const date = new Date();
  const dayMap = ['일', '월', '화', '수', '목', '금', '토'];
  const [currentYear, setCurrentYear] = useState(date.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(date.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 시스템 현재 날짜값 보관
  const today = new Date();
  const actualCurrentYear = today.getFullYear();
  const actualCurrentMonth = today.getMonth() + 1;
  const actualCurrentDayOfWeek = today.getDay();
  const actualCurrentDay = today.getDate();

  // 두 Date 객체가 같은 날짜인지 비교
  const isSameDate = (date1: Date | null, date2: Date | null) => {
    if (!date1 || !date2) return false;
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // 날짜 클릭 핸들러 (같은 날짜 재클릭 시 선택 해제)
  const handleDateClick = (date: Date) => {
    const next = isSameDate(date, selectedDate) ? null : date;
    setSelectedDate(next);
    onDateSelect?.(next);
  };

  // 달 이동 시 선택 날짜 초기화
  const clearSelection = () => {
    setSelectedDate(null);
    onDateSelect?.(null);
  };

  // 이전 달 버튼 핸들러
  const handlePrevMonth = () => {
    clearSelection();
    if (currentMonth === 1) {
      const newYear = currentYear - 1;
      const newMonth = 12;
      setCurrentYear(newYear);
      setCurrentMonth(newMonth);
      onYearChange(newYear);
      onMonthChange(newMonth);
    } else {
      const newMonth = currentMonth - 1;
      setCurrentMonth(newMonth);
      onMonthChange(newMonth);
    }
  };

  // 다음 달 버튼 핸들러
  const handleNextMonth = () => {
    clearSelection();
    if (currentMonth === 12) {
      const newYear = currentYear + 1;
      const newMonth = 1;
      setCurrentYear(newYear);
      setCurrentMonth(newMonth);
      onYearChange(newYear);
      onMonthChange(newMonth);
    } else {
      const newMonth = currentMonth + 1;
      setCurrentMonth(newMonth);
      onMonthChange(newMonth);
    }
  };

  // 이벤트 카테고리별 색상을 지정합니다
  const allEvents = useMemo(() => {
    if (!events) {
      return [];
    } else {
      return [
        ...events.all.map((e) => ({
          ...e,
          category: 'all',
          color: 'bg-blue-35',
        })),
        ...events.undergrad.map((e) => ({
          ...e,
          category: 'undergrad',
          color: 'bg-blue-15',
        })),
        ...events.graduate.map((e) => ({
          ...e,
          category: 'graduate',
          color: 'bg-blue-05',
        })),
        ...events.holiday.map((e) => ({
          ...e,
          category: 'holiday',
          color: 'bg-grey-02',
        })),
      ];
    }
  }, [events]);

  // 캘린더 표시 로직
  const calendarDays = useMemo(() => {
    const days = [];

    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startDayOfWeek = firstDayOfMonth.getDay();
    const lastDayOfPrevMonth = new Date(currentYear, currentMonth - 1, 0).getDate();

    const getEventsForDate = (dateStr: string) => {
      return allEvents.filter((event) => dateStr >= event.startDate && dateStr <= event.endDate);
    };

    const formatDate = (date: Date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    // 이전 달
    for (let i = startDayOfWeek; i > 0; i--) {
      const day = lastDayOfPrevMonth - i + 1;
      const dayOfWeek = startDayOfWeek - i;
      const date = new Date(currentYear, currentMonth - 2, day);
      const currentDateStr = formatDate(date);

      days.push({
        day: day,
        outdated: true,
        weekend: dayOfWeek === 0 || dayOfWeek === 6,
        events: getEventsForDate(currentDateStr),
        fullDate: date,
      });
    }

    // 현재 달
    for (let i = 1; i <= daysInMonth; i++) {
      const dayOfWeek = (startDayOfWeek + i - 1) % 7;
      const date = new Date(currentYear, currentMonth - 1, i);
      const currentDateStr = formatDate(date);
      const isToday =
        currentYear === actualCurrentYear &&
        currentMonth === actualCurrentMonth &&
        i === actualCurrentDay;

      days.push({
        day: i,
        outdated: false,
        weekend: dayOfWeek === 0 || dayOfWeek === 6,
        events: getEventsForDate(currentDateStr),
        fullDate: date,
        isToday: isToday,
      });
    }

    // 캘린더 주(week) 갯수 계산
    const totalCellsNeeded = startDayOfWeek + daysInMonth;
    const totalGridCells = totalCellsNeeded > 35 ? 42 : totalCellsNeeded > 28 ? 35 : 28;
    const remainingCells = totalGridCells - totalCellsNeeded;

    // 다음 달
    for (let i = 1; i <= remainingCells; i++) {
      const dayOfWeek = (startDayOfWeek + daysInMonth + i - 1) % 7;
      const date = new Date(currentYear, currentMonth, i);
      const currentDateStr = formatDate(date);

      days.push({
        day: i,
        outdated: true,
        weekend: dayOfWeek === 0 || dayOfWeek === 6,
        events: getEventsForDate(currentDateStr),
        fullDate: date,
      });
    }

    return days;
  }, [
    currentYear,
    currentMonth,
    allEvents,
    actualCurrentYear,
    actualCurrentMonth,
    actualCurrentDay,
  ]);

  return (
    <section>
      <div
        className={twMerge(
          'flex flex-col gap-2.5 px-2 py-3',
          'border-grey-10 rounded-sm border-1',
          className,
        )}
      >
        <div className='flex flex-col items-center gap-4'>
          {/* 날짜 표시 및 변경 버튼 */}
          <div className='flex w-fit items-center gap-3'>
            <button className='text-grey-40 cursor-pointer p-2' onClick={handlePrevMonth}>
              <IoIosArrowBack size={20} />
            </button>
            <span className='text-body02'>{`${currentYear}년 ${currentMonth}월`}</span>
            <button className='text-grey-40 cursor-pointer p-2' onClick={handleNextMonth}>
              <IoIosArrowForward size={20} />
            </button>
          </div>

          {/* 요일 표시 */}
          <div className='flex w-full gap-0.5'>
            {dayMap.map((day, index) => {
              const isCurrentMonthAndYear =
                currentYear === actualCurrentYear && currentMonth === actualCurrentMonth;
              const isToday = index === actualCurrentDayOfWeek;
              const style =
                isCurrentMonthAndYear && isToday
                  ? 'bg-blue-15 text-white'
                  : 'bg-grey-02 text-grey-30';

              return (
                <div
                  key={index}
                  className={`text-caption03 h-4.5 flex-1 rounded-sm text-center ${style} `}
                >
                  {day}
                </div>
              );
            })}
          </div>

          {/* 이벤트 표시 */}
          <div className='grid w-full grid-cols-7'>
            {calendarDays.map((item, index) => {
              // 선택한 날짜가 있을 때만 해당 날짜를 highlight (선택값이 없으면 아무 날짜도 선택 표시 안 함)
              const isSelected = isSameDate(item.fullDate, selectedDate);
              const isHighlighted = selectedDate !== null && isSelected;

              return (
                <CalendarItem
                  key={index}
                  day={item.day}
                  outdated={item.outdated}
                  weekend={item.weekend}
                  events={item.events}
                  onClick={() => handleDateClick(item.fullDate)}
                  isHighlighted={isHighlighted}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
