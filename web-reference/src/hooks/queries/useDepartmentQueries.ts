import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
  getDepartmentInfo,
  getDepartmentNotices,
  getDepartmentSchedules,
  getStudentCouncilNotices,
  type College,
  type Department,
} from '@/api/departments';
import {
  DEPARTMENT_INFO_STALE_TIME_MS,
  DEPARTMENT_NOTICE_STALE_TIME_MS,
  DEPARTMENT_SCHEDULE_STALE_TIME_MS,
} from '@/constants/common';

const NOTICE_PAGE_SIZE = 5;
const POSTS_PAGE_SIZE = 12;

export function useDepartmentInfoQuery(college: College, department: Department | null) {
  return useQuery({
    queryKey: ['department-info', college, department],
    queryFn: () => getDepartmentInfo(college, department),
    staleTime: DEPARTMENT_INFO_STALE_TIME_MS,
    select: (res) => res.data ?? null,
  });
}

export function useDepartmentSchedulesQuery(college: College, department: Department | null) {
  return useQuery({
    queryKey: ['department-schedules', college, department],
    queryFn: () => getDepartmentSchedules(college, department),
    staleTime: DEPARTMENT_SCHEDULE_STALE_TIME_MS,
    select: (res) => res.data?.schedules ?? [],
  });
}

export function useDepartmentNoticesQuery(
  college: College,
  department: Department | null,
  page: number,
) {
  return useQuery({
    queryKey: ['department-notices', college, department, page],
    queryFn: () =>
      getDepartmentNotices(college, department, page, NOTICE_PAGE_SIZE, 'date,desc'),
    staleTime: DEPARTMENT_NOTICE_STALE_TIME_MS,
    placeholderData: (prev) => prev,
    select: (res) => res.data,
  });
}

export function useStudentCouncilNoticesInfiniteQuery(
  college: College,
  department: Department | null,
) {
  return useInfiniteQuery({
    queryKey: ['student-council-notices', college, department],
    queryFn: ({ pageParam }) =>
      getStudentCouncilNotices(college, department, pageParam, POSTS_PAGE_SIZE, 'publishedAt').then(
        (r) => r.data,
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage?.last ? undefined : (lastPage?.number ?? 0) + 1,
    staleTime: DEPARTMENT_NOTICE_STALE_TIME_MS,
  });
}
