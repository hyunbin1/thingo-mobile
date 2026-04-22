import { useQuery } from '@tanstack/react-query';
import {
  getMyComments,
  getMyLikedPosts,
  getMyPosts,
  getProfileStats,
  type MyCommentedPostItem,
  type MyPostItem,
  type ProfileStatsRes,
} from '@/api/mypage';
import { MYPAGE_STALE_TIME_MS } from '@/constants/common';
import type { Paginated } from '@/api/types';

export function useProfileStatsQuery() {
  return useQuery<ProfileStatsRes>({
    queryKey: ['mypage', 'stats'] as const,
    queryFn: getProfileStats,
    staleTime: MYPAGE_STALE_TIME_MS,
  });
}

export function useMyPostsQuery(page: number, size: number = 10) {
  return useQuery<Paginated<MyPostItem>>({
    queryKey: ['mypage', 'posts', page, size] as const,
    queryFn: () => getMyPosts(page, size),
    staleTime: MYPAGE_STALE_TIME_MS,
    placeholderData: (prev) => prev,
  });
}

export function useMyCommentsQuery(page: number, size: number = 10) {
  return useQuery<Paginated<MyCommentedPostItem>>({
    queryKey: ['mypage', 'comments', page, size] as const,
    queryFn: () => getMyComments(page, size),
    staleTime: MYPAGE_STALE_TIME_MS,
    placeholderData: (prev) => prev,
  });
}

export function useMyLikedPostsQuery(page: number, size: number = 10) {
  return useQuery<Paginated<MyPostItem>>({
    queryKey: ['mypage', 'likes', page, size] as const,
    queryFn: () => getMyLikedPosts(page, size),
    staleTime: MYPAGE_STALE_TIME_MS,
    placeholderData: (prev) => prev,
  });
}
