import { useState, useEffect, useRef, useMemo } from 'react';
import { MdOutlineContentCopy } from 'react-icons/md';
import { FiHome } from 'react-icons/fi';
import { format, isValid } from 'date-fns';
import ko from 'date-fns/locale/ko';
import { Tabs } from '@/components/atoms/Tabs';
import DepartmentCalendar from '@/components/molecules/DepartmentCalendar';
import clsx from 'clsx';
import { IoIosAdd, IoIosArrowDown, IoIosCheckmark } from 'react-icons/io';
import { InstagramIcon } from '@/components/atoms/Icon';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useHeaderStore } from '@/store/useHeaderStore';
import Drawer from '@/components/molecules/Drawer';
import Pagination from '@/components/molecules/common/Pagination';
import Footer from '@/components/organisms/Footer';
import {
  COLLEGE_OPTIONS,
  collegeMap,
  DEPARTMENT_OPTIONS,
  departmentMap,
} from '@/constants/departments';
import type { College, Department, DepartmentSchedule } from '@/api/departments';
import {
  useDepartmentInfoQuery,
  useDepartmentNoticesQuery,
  useDepartmentSchedulesQuery,
  useStudentCouncilNoticesInfiniteQuery,
} from '@/hooks/queries/useDepartmentQueries';

const TABS = {
  events: '소속 일정',
  notices: '소속 공지사항',
  posts: '학생회 공지사항',
};

const TAB_KEYS = Object.keys(TABS) as (keyof typeof TABS)[];

const DEPARTMENT_STORAGE_KEY = 'department_page_selection';

type StoredSelection = { college: College; department: Department | null };

function readStoredDepartmentSelection(): StoredSelection | null {
  try {
    const raw = sessionStorage.getItem(DEPARTMENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { college?: string; department?: string | null };
    const college = parsed.college;
    const department = parsed.department ?? null;
    const validColleges = COLLEGE_OPTIONS.map((o) => o.value);
    if (!college || !validColleges.includes(college as College)) return null;
    const option = DEPARTMENT_OPTIONS.find((opt) => opt.college.value === college);
    const validDepartments = option?.departments.map((d) => d.value) ?? [];
    if (department !== null && !validDepartments.includes(department as Department)) return null;
    return { college: college as College, department: department as Department | null };
  } catch {
    return null;
  }
}

const hasAdminPermission = (role: string | undefined): boolean => {
  return role === 'OPERATOR' || role === 'ADMIN';
};

export default function DepartmentMainPage() {
  const { user } = useAuthStore();
  const { activeMainSlide } = useHeaderStore();
  const navigate = useNavigate();
  const isDepartmentSlideActive = activeMainSlide === 0;

  const [selectedCollege, setSelectedCollege] = useState<College>(() => {
    const stored = readStoredDepartmentSelection();
    return stored?.college ?? 'BUSINESS';
  });
  const [isCollegeDrawerOpen, setIsCollegeDrawerOpen] = useState(false);

  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(() => {
    const stored = readStoredDepartmentSelection();
    return stored?.department ?? null;
  });
  const [isDepartmentDrawerOpen, setIsDepartmentDrawerOpen] = useState(false);

  useEffect(() => {
    sessionStorage.setItem(
      DEPARTMENT_STORAGE_KEY,
      JSON.stringify({ college: selectedCollege, department: selectedDepartment }),
    );
  }, [selectedCollege, selectedDepartment]);

  // 로그인 사용자 소속으로 자동 설정 (기본값일 때만)
  useEffect(() => {
    if (selectedCollege !== 'BUSINESS' || selectedDepartment !== null) return;
    if (user?.departmentName) {
      for (const option of DEPARTMENT_OPTIONS) {
        const department = option.departments.find((dept) => dept.value === user.departmentName);
        if (department) {
          setSelectedCollege(option.college.value);
          setSelectedDepartment(department.value);
          break;
        }
      }
    } else if (user?.college) {
      const validCollege = COLLEGE_OPTIONS.find((opt) => opt.value === user.college);
      if (validCollege) setSelectedCollege(validCollege.value as College);
    }
  }, [user?.college, user?.departmentName, selectedCollege, selectedDepartment]);

  // --- React Query 데이터 조회 ---
  const { data: departmentInfo } = useDepartmentInfoQuery(selectedCollege, selectedDepartment);
  const { data: departmentSchedules = [] } = useDepartmentSchedulesQuery(
    selectedCollege,
    selectedDepartment,
  );

  const [noticePage, setNoticePage] = useState(0);
  const { data: noticesData } = useDepartmentNoticesQuery(
    selectedCollege,
    selectedDepartment,
    noticePage,
  );
  const departmentNotices = noticesData?.content ?? [];
  const noticeTotalPages = noticesData?.totalPages ?? 0;

  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useStudentCouncilNoticesInfiniteQuery(selectedCollege, selectedDepartment);
  const studentCouncilNotices = postsData?.pages.flatMap((p) => p?.content ?? []) ?? [];

  const postsLoadMoreRef = useRef<HTMLDivElement>(null);

  // 무한 스크롤 IntersectionObserver
  useEffect(() => {
    const el = postsLoadMoreRef.current;
    if (!el || !hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: '100px', threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const availableDepartments =
    DEPARTMENT_OPTIONS.find((option) => option.college.value === selectedCollege)?.departments ||
    [];

  const userCollege: College | undefined =
    (user?.college as College | undefined) ??
    DEPARTMENT_OPTIONS.find((opt) => opt.departments.some((d) => d.value === user?.departmentName))
      ?.college?.value;
  const userDepartment = user?.departmentName ?? null;

  const canEditDepartment =
    hasAdminPermission(user?.role) &&
    userCollege !== undefined &&
    selectedCollege === userCollege &&
    selectedDepartment === userDepartment;

  const TAB_STORAGE_KEY = 'department-tab';
  const [currentTab, setCurrentTab] = useState<string>(() => {
    const saved = sessionStorage.getItem(TAB_STORAGE_KEY);
    return saved && TAB_KEYS.includes(saved as keyof typeof TABS) ? saved : TAB_KEYS[0];
  });
  useEffect(() => {
    sessionStorage.setItem(TAB_STORAGE_KEY, currentTab);
  }, [currentTab]);

  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
    setSelectedDate(null);
  };
  const handleMonthChange = (month: number) => {
    setCurrentMonth(month);
    setSelectedDate(null);
  };

  const dayEvents = useMemo(() => {
    let list: DepartmentSchedule[];
    if (selectedDate) {
      const y = selectedDate.getFullYear();
      const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const d = String(selectedDate.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${d}`;
      list = departmentSchedules.filter((s) => {
        const start = s.startDateTime.slice(0, 10);
        const end = s.endDateTime ? s.endDateTime.slice(0, 10) : start;
        return dateStr >= start && dateStr <= end;
      });
    } else {
      const monthStart = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
      const lastDay = new Date(currentYear, currentMonth, 0).getDate();
      const monthEnd = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
      list = departmentSchedules.filter((s) => {
        const start = s.startDateTime.slice(0, 10);
        const end = s.endDateTime ? s.endDateTime.slice(0, 10) : start;
        return end >= monthStart && start <= monthEnd;
      });
    }
    return [...list].sort(
      (a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime(),
    );
  }, [departmentSchedules, selectedDate, currentYear, currentMonth]);

  const [phoneCopied, setPhoneCopied] = useState(false);
  const handleCopyPhone = async () => {
    const phone = departmentInfo?.academicOfficePhone;
    if (!phone) return;
    try {
      await navigator.clipboard.writeText(phone);
      setPhoneCopied(true);
      setTimeout(() => setPhoneCopied(false), 1500);
    } catch (e) {
      console.error('클립보드 복사 실패:', e);
    }
  };

  return (
    <section className='flex min-h-screen flex-col'>
      <div className='flex gap-2 px-5 py-4'>
        <button
          className={clsx(
            'flex cursor-pointer items-center gap-1 rounded-full px-3 py-1.5',
            'text-body06 text-mju-primary',
            'border-mju-primary border-1',
            'min-w-0',
          )}
          onClick={() => setIsCollegeDrawerOpen(true)}
        >
          <span className='overflow-hidden text-ellipsis whitespace-nowrap'>
            {collegeMap.get(selectedCollege) || '전체'}
          </span>
          <IoIosArrowDown className='text-grey-40 flex-shrink-0' />
        </button>

        <button
          className={clsx(
            'flex cursor-pointer items-center gap-1 rounded-full px-3 py-1.5',
            selectedDepartment
              ? 'text-body06 text-mju-primary border-mju-primary border-1'
              : 'text-body06 text-grey-60 border-grey-10 border-1',
            'min-w-0',
          )}
          onClick={() => setIsDepartmentDrawerOpen(true)}
        >
          <span className='overflow-hidden text-ellipsis whitespace-nowrap'>
            {selectedDepartment
              ? departmentMap.get(selectedDepartment) || '학과 필터'
              : '학과 필터'}
          </span>
          <IoIosArrowDown className='text-grey-40 flex-shrink-0' />
        </button>
      </div>

      <div className='bg-grey-02 h-2' />

      <div className='flex flex-1 flex-col'>
        <div className='flex flex-col px-5 pt-5 pb-6.5'>
          <p className='text-title03 text-black'>{collegeMap.get(selectedCollege)}</p>
          {selectedDepartment && (
            <p className='text-body04 text-grey-80 mt-0.5'>
              {departmentMap.get(selectedDepartment)}
            </p>
          )}
          <div className='mt-2.5 flex items-center gap-1'>
            <span className='text-body05 text-grey-80'>교학팀</span>
            <span className='text-body05 text-grey-30'>
              {departmentInfo?.academicOfficePhone ?? '-'}
            </span>
            <button
              type='button'
              onClick={handleCopyPhone}
              className='text-blue-15 cursor-pointer p-0.75'
              aria-label='전화번호 복사'
            >
              {phoneCopied ? (
                <IoIosCheckmark className='text-green-50' />
              ) : (
                <MdOutlineContentCopy />
              )}
            </button>
          </div>
          <div className='flex gap-3 pt-3.5'>
            {departmentInfo?.homepageUrl ? (
              <a
                href={departmentInfo.homepageUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='text-grey-80 text-caption02 border-grey-10 flex cursor-pointer items-center gap-2 rounded-sm border-1 px-2 py-1'
              >
                <FiHome className='text-blue-10' />
                홈페이지
              </a>
            ) : null}
            {departmentInfo?.instagramUrl ? (
              <a
                href={departmentInfo.instagramUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='text-grey-80 text-caption02 border-grey-10 flex cursor-pointer items-center gap-2 rounded-sm border-1 px-2 py-1'
              >
                <InstagramIcon />
                인스타그램
              </a>
            ) : null}
          </div>
        </div>

        <div className='border-grey-10 border-b-1 px-5'>
          <Tabs
            tabs={TABS}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            className='text-body04 border-b-0'
          />
        </div>

        {currentTab === 'events' && (
          <section className='relative'>
            <div className='flex flex-col'>
              <DepartmentCalendar
                className='m-5'
                schedules={departmentSchedules}
                onYearChange={handleYearChange}
                onMonthChange={handleMonthChange}
                onDateSelect={setSelectedDate}
              />
              <div className='mt-3 flex items-center justify-end px-5'>
                <p className='bg-blue-35 h-2.5 w-2.5' />
                <p className='text-caption04 text-grey-40 ms-1'>전체 (학부·대학원)</p>
                <p className='bg-blue-15 ms-4 h-2.5 w-2.5' />
                <p className='text-caption04 text-grey-40 ms-1'>학부</p>
                <p className='bg-blue-05 ms-4 h-2.5 w-2.5' />
                <p className='text-caption04 text-grey-40 ms-1'>대학원</p>
                <p className='bg-grey-02 ms-4 h-2.5 w-2.5' />
                <p className='text-caption04 text-grey-40 ms-1'>휴일</p>
              </div>
              <div className='border-grey-02 mb-2 border-b-1 px-5 py-1'>
                <span className='text-body02 text-mju-primary'>
                  {selectedDate
                    ? format(selectedDate, 'MM.dd (EEE)', { locale: ko })
                    : `${currentYear}년 ${currentMonth}월`}
                </span>
              </div>
              <div className='mb-10'>
                {dayEvents.length === 0 ? (
                  <div className='px-5 py-4'>
                    <p className='text-body05 text-grey-60 text-center'>일정 없음</p>
                  </div>
                ) : (
                  dayEvents.map((event) => {
                    const startStr = event.startDateTime.slice(0, 10);
                    const endStr = event.endDateTime ? event.endDateTime.slice(0, 10) : startStr;
                    const isOneDay = startStr === endStr;
                    return (
                      <button
                        key={event.uuid}
                        type='button'
                        className={clsx(
                          'flex w-full items-start gap-2 px-5 py-2 text-start',
                          canEditDepartment && 'cursor-pointer',
                        )}
                        onClick={() => {
                          if (canEditDepartment) navigate(`/departments/events/edit/${event.uuid}`);
                        }}
                      >
                        <span className='text-caption02 text-grey-40 w-20'>
                          {format(new Date(event.startDateTime), 'MM.dd', { locale: ko })}
                          {!isOneDay &&
                            event.endDateTime &&
                            ` - ${format(new Date(event.endDateTime), 'MM.dd', { locale: ko })}`}
                        </span>
                        <span className='text-caption02 line-clamp-2 flex-1 text-black'>
                          {event.title}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
            {canEditDepartment && isDepartmentSlideActive && (
              <button
                type='button'
                className='bg-blue-35 fixed right-5 bottom-10 flex items-center justify-center rounded-full p-2 shadow-[0_0_12px_rgba(0,0,0,0.4)]'
                onClick={() => navigate('/departments/events/new')}
              >
                <IoIosAdd className='text-4xl text-white' />
              </button>
            )}
          </section>
        )}

        {currentTab === 'notices' && (
          <section className='flex flex-1 flex-col'>
            <div className='flex flex-1 flex-col py-5'>
              {departmentNotices.length === 0 ? (
                <div className='flex flex-1 items-center justify-center py-10'>
                  <span className='text-body03'>공지사항 없음</span>
                </div>
              ) : (
                departmentNotices.map((notice, index) => (
                  <div key={notice.departmentNoticeUuid}>
                    {index > 0 && <div className='bg-grey-02 h-px' />}
                    <a
                      href={notice.link}
                      target='_blank'
                      rel='noopener noreferrer'
                      className={clsx(
                        'block cursor-pointer px-5 py-2.5',
                        'hover:bg-blue-05 transition duration-50 hover:transition-none',
                      )}
                    >
                      <p className='text-caption04 text-grey-30'>
                        {(() => {
                          const d = notice.publishedAt ? new Date(notice.publishedAt) : null;
                          return d && isValid(d) ? format(d, 'yyyy.MM.dd', { locale: ko }) : '-';
                        })()}
                      </p>
                      <p className='text-body05 mt-0.5 line-clamp-2 min-h-[3em] text-black'>
                        {notice.title}
                      </p>
                    </a>
                  </div>
                ))
              )}
              {departmentNotices.length > 0 && (
                <Pagination
                  page={noticePage}
                  totalPages={noticeTotalPages}
                  onChange={setNoticePage}
                />
              )}
            </div>
          </section>
        )}

        {currentTab === 'posts' && (
          <section>
            <div className='grid grid-cols-3 gap-1 py-5'>
              {canEditDepartment && (
                <Link
                  to='/departments/posts/new'
                  className='bg-grey-02 flex aspect-[4/5] items-center justify-center'
                >
                  <IoIosAdd className='text-grey-30 text-4xl' />
                </Link>
              )}
              {studentCouncilNotices.map((notice) => (
                <Link
                  key={notice.noticeUuid}
                  to={`/departments/posts/${notice.noticeUuid}`}
                  className='bg-grey-10 aspect-[4/5] cursor-pointer'
                >
                  <img
                    src={notice.thumbnailUrl}
                    alt={notice.title || '학생회 공지사항'}
                    className='h-full w-full object-cover'
                  />
                </Link>
              ))}
            </div>
            {hasNextPage && studentCouncilNotices.length > 0 && (
              <div
                ref={postsLoadMoreRef}
                className='flex min-h-12 items-center justify-center py-2'
                aria-hidden
              >
                {isFetchingNextPage && (
                  <span className='text-caption02 text-grey-40'>불러오는 중...</span>
                )}
              </div>
            )}
            {studentCouncilNotices.length === 0 && !isFetchingNextPage && (
              <div
                className={clsx(
                  'flex items-center justify-center',
                  canEditDepartment ? 'py-4' : 'py-10',
                )}
              >
                <span className='text-body03 text-grey-30'>서비스 준비 중입니다.</span>
              </div>
            )}
          </section>
        )}
      </div>

      <Drawer open={isCollegeDrawerOpen} onOpenChange={setIsCollegeDrawerOpen}>
        <div className='flex flex-col gap-4 py-1.5'>
          <div className='px-5'>
            <h2 className='text-title02 text-black'>단과대 필터</h2>
          </div>
          <div className='flex flex-col'>
            {COLLEGE_OPTIONS.map((college) => {
              const isSelected = selectedCollege === college.value;
              return (
                <button
                  key={college.value}
                  type='button'
                  onClick={() => {
                    setSelectedCollege(college.value);
                    setSelectedDepartment(null);
                    setNoticePage(0);
                    setIsCollegeDrawerOpen(false);
                  }}
                  className={clsx(
                    'flex w-full items-center justify-between px-5 py-2.5',
                    'text-body03 text-grey-80 cursor-pointer',
                    'hover:bg-blue-05 transition duration-50 hover:transition-none',
                    isSelected && 'text-mju-primary',
                  )}
                >
                  {college.label}
                  {isSelected && <IoIosCheckmark className='text-2xl' />}
                </button>
              );
            })}
          </div>
        </div>
      </Drawer>

      <Drawer open={isDepartmentDrawerOpen} onOpenChange={setIsDepartmentDrawerOpen}>
        <div className='flex flex-col gap-4 py-1.5'>
          <div className='px-5'>
            <h2 className='text-title02 text-black'>학과 필터</h2>
          </div>
          <div className='flex flex-col'>
            <button
              type='button'
              onClick={() => {
                setSelectedDepartment(null);
                setNoticePage(0);
                setIsDepartmentDrawerOpen(false);
              }}
              className={clsx(
                'flex w-full items-center justify-between px-5 py-2.5',
                'text-body03 text-grey-80 cursor-pointer',
                'hover:bg-blue-05 transition duration-50 hover:transition-none',
                !selectedDepartment && 'text-mju-primary',
              )}
            >
              전체
              {!selectedDepartment && <IoIosCheckmark className='text-2xl' />}
            </button>
            {availableDepartments.map((department) => {
              const isSelected = selectedDepartment === department.value;
              return (
                <button
                  key={department.value}
                  type='button'
                  onClick={() => {
                    setSelectedDepartment(department.value);
                    setNoticePage(0);
                    setIsDepartmentDrawerOpen(false);
                  }}
                  className={clsx(
                    'flex w-full items-center justify-between px-5 py-2.5',
                    'text-body03 text-grey-80 cursor-pointer',
                    'hover:bg-blue-05 transition duration-50 hover:transition-none',
                    isSelected && 'text-mju-primary',
                  )}
                >
                  {department.label}
                  {isSelected && <IoIosCheckmark className='text-2xl' />}
                </button>
              );
            })}
          </div>
        </div>
      </Drawer>

      <div className='mt-auto'>
        <Footer />
      </div>
    </section>
  );
}
