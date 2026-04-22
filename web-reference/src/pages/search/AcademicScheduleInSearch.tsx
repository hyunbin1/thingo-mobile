import {
  getAcademicCalendar,
  type CalendarMonthlyRes,
  type CalendarScheduleItem,
} from '@/api/main/calendar';
import Calendar from '@/components/molecules/Calendar';
import { ScheduleList } from '@/components/molecules/sections/academic-schedule-list';
import { useEffect, useMemo, useState } from 'react';

type CategoryKey = 'all' | 'undergrad' | 'graduate' | 'holiday';
const categoryMap: Record<CategoryKey, string> = {
  all: '전체',
  undergrad: '학부',
  graduate: '대학원',
  holiday: '휴일',
};

/**
 * 검색 페이지 학사일정 탭에서 쓰는 캘린더 + 일정 리스트 컴포넌트
 * (academic-schedule-widget의 캘린더 영역만 분리)
 */
export default function AcademicScheduleInSearch() {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState<CalendarMonthlyRes | null>(null);

  useEffect(() => {
    getCalendarData(viewDate.getFullYear(), viewDate.getMonth() + 1);
  }, [viewDate]);

  const getCalendarData = async (year: number, month: number) => {
    try {
      setIsLoading(true);
      const res = await getAcademicCalendar(year, month);
      setScheduleData(res);
    } catch (e) {
      console.error('calendar-fetch-error', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleYearChange = (year: number) =>
    setViewDate((prev) => new Date(year, prev.getMonth(), 1));
  const handleMonthChange = (month: number) =>
    setViewDate((prev) => new Date(prev.getFullYear(), month - 1, 1));

  const dailyScheduleList = useMemo(() => {
    if (!scheduleData) return [];
    const targetDate = selectedDate || new Date();
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const allEventsWithCategory: (CalendarScheduleItem & { categoryLabel: string })[] = [];
    if (selectedCategory === 'all' || selectedCategory === 'undergrad') {
      scheduleData.undergrad.forEach((e) =>
        allEventsWithCategory.push({ ...e, categoryLabel: categoryMap.undergrad }),
      );
    }
    if (selectedCategory === 'all' || selectedCategory === 'graduate') {
      scheduleData.graduate.forEach((e) =>
        allEventsWithCategory.push({ ...e, categoryLabel: categoryMap.graduate }),
      );
    }
    if (selectedCategory === 'all' || selectedCategory === 'holiday') {
      scheduleData.holiday.forEach((e) =>
        allEventsWithCategory.push({ ...e, categoryLabel: categoryMap.holiday }),
      );
    }
    return allEventsWithCategory.filter((e) => dateStr >= e.startDate && dateStr <= e.endDate);
  }, [scheduleData, selectedDate, selectedCategory]);

  return (
    <div className='flex flex-col gap-4 pb-10'>
      <div className='p-4'>
        <Calendar
          events={scheduleData}
          onDateSelect={setSelectedDate}
          onYearChange={handleYearChange}
          onMonthChange={handleMonthChange}
        />
      </div>
      <ScheduleList
        viewDate={viewDate}
        selectedDate={selectedDate}
        selectedCategory={selectedCategory}
        onCategoryToggle={() => setIsCategoryOpen(!isCategoryOpen)}
        isCategoryOpen={isCategoryOpen}
        onCategorySelect={(key) => {
          setSelectedCategory(key);
          setIsCategoryOpen(false);
        }}
        isLoading={isLoading}
        dailyScheduleList={dailyScheduleList}
      />
    </div>
  );
}
