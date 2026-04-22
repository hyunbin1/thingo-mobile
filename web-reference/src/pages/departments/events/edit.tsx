import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { IoIosArrowBack } from 'react-icons/io';
import { FaRegCalendarAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import DatePickerDrawer from '@/components/molecules/DatePickerDrawer';
import {
  updateDepartmentSchedule,
  deleteDepartmentSchedule,
  type College,
  type Department,
} from '@/api/departments-admin-schedules';
import { useAuthStore } from '@/store/useAuthStore';
import { DEPARTMENT_OPTIONS } from '@/constants/departments';

const DATE_DISPLAY_FORMAT = 'yyyy. MM. dd';
const DATE_API_FORMAT = 'yyyy-MM-dd';

export default function DepartmentEventsEditPage() {
  const navigate = useNavigate();
  const { uuid: scheduleUuid } = useParams<{ uuid: string }>();
  const { user, isLoggedIn } = useAuthStore();

  // user.college 필드를 우선 사용하고, 없을 경우 departmentName으로 유추
  const college: College | null =
    (user?.college as College | null | undefined) ??
    (user?.departmentName
      ? (DEPARTMENT_OPTIONS.find((opt) =>
          opt.departments.some((d) => d.value === user.departmentName),
        )?.college.value ?? null)
      : null);
  const department: Department | null = (user?.departmentName as Department) ?? null;

  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
  const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const isComplete =
    scheduleUuid != null && title.trim() !== '' && startDate != null && endDate != null;

  if (!isLoggedIn) {
    return null;
  }

  const handleSave = async () => {
    if (!college) {
      toast.error('소속 단과대 정보를 찾을 수 없습니다. 로그인 후 다시 시도해 주세요.');
      return;
    }
    if (!scheduleUuid || !isComplete) return;

    setIsSaving(true);
    try {
      await updateDepartmentSchedule(college, department, scheduleUuid, {
        title: title.trim(),
        startDate: format(startDate, DATE_API_FORMAT),
        endDate: format(endDate, DATE_API_FORMAT),
      });
      toast.success('일정이 수정되었습니다.');
      navigate(-1);
    } catch (error) {
      console.error('일정 수정 실패:', error);
      toast.error('일정 수정에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!college || !scheduleUuid) {
      toast.error('소속 단과대 정보를 찾을 수 없습니다.');
      return;
    }
    if (!window.confirm('일정을 삭제하시겠습니까?')) return;

    setIsDeleting(true);
    try {
      await deleteDepartmentSchedule(college, department, scheduleUuid);
      toast.success('일정이 삭제되었습니다.');
      navigate(-1);
    } catch (error) {
      console.error('일정 삭제 실패:', error);
      toast.error('일정 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const isBusy = isSaving || isDeleting;

  return (
    <section className='flex flex-1 flex-col'>
      {/* 헤더 */}
      <header className='border-grey-10 relative flex h-15 items-center justify-center border-b'>
        <button
          type='button'
          className='absolute left-2 cursor-pointer p-2'
          aria-label='뒤로 가기'
          onClick={() => navigate(-1)}
        >
          <IoIosArrowBack className='text-2xl text-black' />
        </button>
        <p className='text-body02 text-black'>일정 편집</p>
      </header>

      {/* 제목 입력 칸 */}
      <div className='m-5'>
        <input
          type='text'
          placeholder='제목'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='border-grey-10 text-body03 placeholder:text-grey-30 w-full rounded-lg border px-4 py-3 text-black'
          aria-label='제목'
        />
      </div>

      {/* 날짜 입력 칸 */}
      <div className='flex items-center gap-3 px-5'>
        <span className='text-body05 text-grey-40 shrink-0'>시작</span>
        <div className='border-grey-10 flex flex-1 items-center justify-between rounded-lg border'>
          <span className='text-body06 p-3 text-black'>
            {format(startDate, DATE_DISPLAY_FORMAT)}
          </span>
          <button
            className='cursor-pointer p-3'
            aria-label='시작 날짜 선택'
            onClick={() => setIsStartDatePickerOpen(true)}
          >
            <FaRegCalendarAlt className='text-grey-40 shrink-0 text-lg' aria-hidden />
          </button>
        </div>
      </div>
      <div className='mt-2 flex items-center gap-3 px-5'>
        <span className='text-body05 text-grey-40 shrink-0'>종료</span>
        <div className='border-grey-10 flex flex-1 items-center justify-between rounded-lg border'>
          <span className='text-body06 p-3 text-black'>{format(endDate, DATE_DISPLAY_FORMAT)}</span>
          <button
            className='cursor-pointer p-3'
            aria-label='종료 날짜 선택'
            onClick={() => setIsEndDatePickerOpen(true)}
          >
            <FaRegCalendarAlt className='text-grey-40 shrink-0 text-lg' aria-hidden />
          </button>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className='mt-auto p-5'>
        <button
          type='button'
          className='text-body05 bg-grey-02 text-grey-40 w-full cursor-pointer rounded-lg p-2.5 disabled:cursor-not-allowed disabled:opacity-50'
          aria-label='일정 삭제'
          disabled={isBusy}
          onClick={handleDelete}
        >
          {isDeleting ? '삭제 중...' : '일정 삭제'}
        </button>
        <button
          type='button'
          className={`text-body05 mt-3 w-full rounded-lg p-2.5 ${isComplete && !isBusy ? 'bg-mju-primary cursor-pointer text-white' : 'bg-grey-02 text-grey-40 cursor-not-allowed'}`}
          aria-label='저장'
          disabled={!isComplete || isBusy}
          onClick={handleSave}
        >
          {isSaving ? '저장 중...' : '저장'}
        </button>
      </div>

      {/* 시작 날짜 선택 Drawer */}
      <DatePickerDrawer
        open={isStartDatePickerOpen}
        onOpenChange={setIsStartDatePickerOpen}
        value={startDate}
        onChange={setStartDate}
      />

      {/* 종료 날짜 선택 Drawer */}
      <DatePickerDrawer
        open={isEndDatePickerOpen}
        onOpenChange={setIsEndDatePickerOpen}
        value={endDate}
        onChange={setEndDate}
      />
    </section>
  );
}
