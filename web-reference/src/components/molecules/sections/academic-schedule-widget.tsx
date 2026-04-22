import {
  getAcademicCalendar,
  type CalendarMonthlyRes,
  type CalendarScheduleItem,
} from '@/api/main/calendar';
import { fetchNotionInfo } from '@/api/main/notice-api';
import Calendar from '@/components/molecules/Calendar';
import { Skeleton } from '@/components/atoms/Skeleton';
import type { NoticeItem } from '@/types/notice/noticeInfo';
import clsx from 'clsx';
import { useCallback, useState, useEffect, useMemo } from 'react';
import Pagination from '@/components/molecules/common/Pagination';
import { ScheduleList } from './academic-schedule-list';
import { CardHeader } from '@/components/atoms/Card';
import { Link } from 'react-router-dom';
import { MdChevronRight } from 'react-icons/md';
import { formatToDotDate } from '@/utils/date';

/**
 * 학사 일정 카테고리 정의
 */
type CategoryKey = 'all' | 'undergrad' | 'graduate' | 'holiday';
const categoryMap: Record<CategoryKey, string> = {
  all: '전체',
  undergrad: '학부',
  graduate: '대학원',
  holiday: '휴일',
};

interface AcademicScheduleWidgetProps {
  all?: boolean;
  className?: string;
  /** 제공 시 더보기 클릭으로 호출(예: 슬라이드 학사일정 탭으로 이동), 미제공 시 /academic-schedule로 이동 */
  onSeeMoreClick?: () => void;
}

export default function AcademicScheduleWidget({
  all = false,
  className,
  onSeeMoreClick,
}: AcademicScheduleWidgetProps) {
  const [activeTab, setActiveTab] = useState<'calendar' | 'notice'>('calendar');
  const [viewDate, setViewDate] = useState(new Date()); // 현재 달력 뷰 기준일
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // 사용자가 명시적으로 선택한 날짜
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState<CalendarMonthlyRes | null>(null);

  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [isNoticeLoading, setIsNoticeLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const getCalendarData = useCallback(async (year: number, month: number) => {
    try {
      setIsLoading(true);
      const res = await getAcademicCalendar(year, month);
      setScheduleData(res);
    } catch (e) {
      console.error('calendar-fetch-error', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 학사공지 탭 데이터 조회
   */
  const getNoticeData = useCallback(async () => {
    try {
      setIsNoticeLoading(true);
      const res = await fetchNotionInfo('academic', page, 10);
      setNotices(res.content);
      setTotalPages(res.totalPages);
    } catch (e) {
      console.error('notice-fetch-error', e);
    } finally {
      setIsNoticeLoading(false);
    }
  }, [page]);

  /**
   * 캘린더 데이터 조회 (viewDate의 연/월 기준)
   */
  useEffect(() => {
    if (activeTab === 'calendar') {
      getCalendarData(viewDate.getFullYear(), viewDate.getMonth() + 1);
    }
  }, [activeTab, viewDate, getCalendarData]);

  /**
   * 학사공지 탭 데이터 조회
   */
  useEffect(() => {
    if (activeTab === 'notice') {
      getNoticeData();
    }
  }, [activeTab, page, getNoticeData]);

  /** 캘린더 연/월 변경 시 viewDate 동기화 → 해당 월 데이터 재조회, 선택 날짜·카테고리 초기화 */
  const handleYearChange = (year: number) => {
    setSelectedDate(null);
    setSelectedCategory('all');
    setViewDate((prev) => new Date(year, prev.getMonth(), 1));
  };
  const handleMonthChange = (month: number) => {
    setSelectedDate(null);
    setSelectedCategory('all');
    setViewDate((prev) => new Date(prev.getFullYear(), month - 1, 1));
  };

  /** 날짜 선택 시 카테고리 초기화 */
  const handleDateSelect = useCallback((date: Date | null) => {
    setSelectedDate(date);
    setSelectedCategory('all');
  }, []);

  /**
   * 하단 일정 리스트에 보여줄 일정들 (선택된 날짜가 있으면 해당 날짜 기준, 없으면 현재 달 전체)
   */
  const dailyScheduleList = useMemo(() => {
    if (!scheduleData) return [];

    // 선택한 필터에 따라 표시할 소스: 전체→all+undergrad+graduate+holiday, 학부→all+undergrad, 대학원→all+graduate, 휴일→holiday
    const allEventsWithCategory: (CalendarScheduleItem & { categoryLabel: string })[] = [];

    const includeAll =
      selectedCategory === 'all' ||
      selectedCategory === 'undergrad' ||
      selectedCategory === 'graduate';
    const includeUndergrad = selectedCategory === 'all' || selectedCategory === 'undergrad';
    const includeGraduate = selectedCategory === 'all' || selectedCategory === 'graduate';
    const includeHoliday = selectedCategory === 'all' || selectedCategory === 'holiday';

    if (includeAll) {
      scheduleData.all.forEach((e) =>
        allEventsWithCategory.push({ ...e, categoryLabel: '학부·대학원' }),
      );
    }
    if (includeUndergrad) {
      scheduleData.undergrad.forEach((e) =>
        allEventsWithCategory.push({ ...e, categoryLabel: categoryMap.undergrad }),
      );
    }
    if (includeGraduate) {
      scheduleData.graduate.forEach((e) =>
        allEventsWithCategory.push({ ...e, categoryLabel: categoryMap.graduate }),
      );
    }
    if (includeHoliday) {
      scheduleData.holiday.forEach((e) =>
        allEventsWithCategory.push({ ...e, categoryLabel: categoryMap.holiday }),
      );
    }

    // 선택된 날짜가 없으면 현재 달 전체 일정, 있으면 해당 날짜에 포함되는 일정만
    if (selectedDate === null) {
      return allEventsWithCategory;
    }
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    return allEventsWithCategory.filter((e) => dateStr >= e.startDate && dateStr <= e.endDate);
  }, [scheduleData, selectedDate, selectedCategory]);

  return (
    <section className='flex flex-col bg-white'>
      {all && (
        <CardHeader className='px-3'>
          <h2 className='text-title03 px-2 font-bold text-black'>학사일정</h2>
          {onSeeMoreClick ? (
            <button
              type='button'
              onClick={onSeeMoreClick}
              className='text-grey-30 p-2'
              aria-label='학사일정 탭으로 이동'
            >
              <MdChevronRight size={24} className='text-grey-60' />
            </button>
          ) : (
            <Link to='/academic-schedule' className='text-grey-30 p-2'>
              <MdChevronRight size={24} className='text-grey-60' />
            </Link>
          )}
        </CardHeader>
      )}
      {/* 탭 네비게이션 */}
      {/* <div className='bg-grey-02 my-0 flex items-center pt-[8px]'>
        <div className='flex flex-1 items-center overflow-hidden'>
          <button
            onClick={() => setActiveTab('calendar')}
            className={clsx(
              'flex flex-1 items-center justify-center text-[14px] leading-[1.5] transition-colors',
              activeTab === 'calendar'
                ? 'border-grey-10 gap-[4px] rounded-tr-[4px] border-r bg-white pt-[10px] pr-[10px] pb-[8px] pl-[12px] font-semibold text-black'
                : 'bg-grey-02 border-grey-10 text-grey-40 border-b px-[12px] pt-[10px] pb-[8px] font-normal',
            )}
          >
            캘린더
          </button>
          <button
            onClick={() => {
              setActiveTab('notice');
              setPage(0);
            }}
            className={clsx(
              'flex flex-1 items-center justify-center text-[14px] leading-[1.5] transition-colors',
              activeTab === 'notice'
                ? 'border-grey-10 gap-[4px] rounded-tl-[4px] border-l bg-white pt-[10px] pr-[10px] pb-[8px] pl-[12px] font-semibold text-black'
                : 'bg-grey-02 border-grey-10 text-grey-40 border-b px-[12px] pt-[10px] pb-[8px] font-normal',
            )}
          >
            학사공지
          </button>
        </div>
      </div> */}
      {!all && (
        <div className='bg-grey-02 my-0 flex items-center pt-[8px]'>
          <div className='flex flex-1 items-center overflow-hidden'>
            <button
              onClick={() => setActiveTab('calendar')}
              className={clsx(
                'flex flex-1 items-center justify-center text-[14px] leading-[1.5] transition-colors',
                activeTab === 'calendar'
                  ? 'border-grey-10 gap-[4px] rounded-tr-[4px] border-r bg-white pt-[10px] pr-[10px] pb-[8px] pl-[12px] font-semibold text-black'
                  : 'bg-grey-02 border-grey-10 text-grey-40 border-b px-[12px] pt-[10px] pb-[8px] font-normal',
              )}
            >
              캘린더
            </button>
            <button
              onClick={() => setActiveTab('notice')}
              className={clsx(
                'flex flex-1 items-center justify-center text-[14px] leading-[1.5] transition-colors',
                activeTab === 'notice'
                  ? 'border-grey-10 gap-[4px] rounded-tl-[4px] border-l bg-white pt-[10px] pr-[10px] pb-[8px] pl-[12px] font-semibold text-black'
                  : 'bg-grey-02 border-grey-10 text-grey-40 border-b px-[12px] pt-[10px] pb-[8px] font-normal',
              )}
            >
              학사공지
            </button>
          </div>
        </div>
      )}

      <div className={clsx('mt-4 flex flex-col', className)}>
        {activeTab === 'calendar' ? (
          <div className={clsx('flex flex-col gap-4 pb-0', !all && 'pb-10')}>
            {/* 달력 컴포넌트 */}
            {!all && (
              <div className='p-4'>
                <Calendar
                  events={scheduleData}
                  onDateSelect={handleDateSelect}
                  onYearChange={handleYearChange}
                  onMonthChange={handleMonthChange}
                />

                {/* 캘린더 범례 */}
                <div className='mt-3 flex items-center justify-end'>
                  <p className='bg-blue-35 h-2.5 w-2.5' />
                  <p className='text-caption04 text-grey-40 ms-1'>전체 (학부·대학원)</p>
                  <p className='bg-blue-15 ms-4 h-2.5 w-2.5' />
                  <p className='text-caption04 text-grey-40 ms-1'>학부</p>
                  <p className='bg-blue-05 ms-4 h-2.5 w-2.5' />
                  <p className='text-caption04 text-grey-40 ms-1'>대학원</p>
                  <p className='bg-grey-02 ms-4 h-2.5 w-2.5' />
                  <p className='text-caption04 text-grey-40 ms-1'>휴일</p>
                </div>
              </div>
            )}

            {/* 일정 리스트 컴포넌트 */}
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
              all={all}
            />
          </div>
        ) : (
          /* 학사공지 탭 - 일반 공지 탭과 동일한 디자인 */
          <div className='flex flex-col'>
            {isNoticeLoading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className='border-blue-05 h-fit w-full border-b'>
                  <div className='flex flex-col gap-0.5 px-5 py-2.5'>
                    <Skeleton className='h-3 w-16' />
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-3 w-20' />
                  </div>
                </div>
              ))
            ) : notices.length > 0 ? (
              notices.map((notice, index) => {
                const isEnd = notices.length - 1 === index;

                return (
                  <a
                    key={index}
                    href={notice.link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hover:bg-blue-05 active:bg-blue-10 transition-colors'
                  >
                    <div className={`h-fit w-full ${!isEnd && 'border-blue-05 border-b'}`}>
                      <div className='flex flex-col gap-0.5 px-5 py-2.5'>
                        <span className='text-caption03 text-blue-10'>학사공지</span>
                        <span className='text-body05 line-clamp-2 text-black'>{notice.title}</span>
                        {notice.date && (
                          <span className='text-caption04 text-grey-20'>
                            {formatToDotDate(notice.date)}
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                );
              })
            ) : (
              <div className='flex flex-1 items-center justify-center py-20'>
                <span className='text-body05 text-grey-20'>등록된 학사 공지사항이 없습니다.</span>
              </div>
            )}

            {/* 페이지네이션 */}
            {!isNoticeLoading && totalPages > 1 && (
              <div className='pb-4'>
                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
