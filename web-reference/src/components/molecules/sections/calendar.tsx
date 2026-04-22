import Divider from '@/components/atoms/Divider';
import { Skeleton } from '@/components/atoms/Skeleton';
import { useEffect, useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

export default function AcademicCalendarSection() {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [events] = useState([]);

  useEffect(() => {
    fetchData();
  }, [currentYear, currentMonth]);

  async function fetchData() {
    try {
      setIsLoading(true);
      setIsError(false);
    } catch (e) {
      setIsError(true);
      console.error('calendar.tsx::AcademicCalendarSection()::useEffect()', e);
    } finally {
      setIsLoading(false);
    }
  }

  function handlePreviousMonth() {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((prevYear) => prevYear - 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth - 1);
    }
  }

  function handleNextMonth() {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((prevYear) => prevYear + 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth + 1);
    }
  }

  return (
    <section>
      <div className='w-full flex flex-col gap-3'>
        <div className='px-3'>
          <h2 className='text-title02 text-mju-primary'>학사일정</h2>
        </div>
        <div className='px-6 py-4 flex flex-col gap-2 border-2 rounded-xl border-grey-05'>
          <div className='flex justify-between items-center'>
            <button
              className='p-2 cursor-pointer items-center text-blue-10 text-title02'
              onClick={handlePreviousMonth}
            >
              <IoIosArrowBack />
            </button>
            <p className='text-title02'>{`${currentYear}년 ${currentMonth}월`}</p>
            <button
              className='p-2 cursor-pointer items-center text-blue-10 text-title02'
              onClick={handleNextMonth}
            >
              <IoIosArrowForward />
            </button>
          </div>
          <Divider variant='thin' />
          {isError && (
            <div className='py-4 flex flex-col gap-3 items-center'>
              <p className='text-body02'>문제가 발생했습니다</p>
              <button
                className='bg-grey-05 px-2 py-1 cursor-pointer rounded-xl text-caption01'
                onClick={fetchData}
              >
                다시 시도하기
              </button>
            </div>
          )}
          {isLoading && [...Array(4)].map((_, index) => <Skeleton key={index} className='h-12' />)}
          {!isLoading && events.length === 0 && (
            <p className='p-4 text-center text-body04'>등록된 일정이 없습니다</p>
          )}
        </div>
      </div>
    </section>
  );
}
