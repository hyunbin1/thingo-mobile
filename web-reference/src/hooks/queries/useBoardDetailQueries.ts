import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deletePost, getBoardComments, getBoardDetail, likePost, postComment } from '@/api/board';
import { BOARD_COMMENTS_STALE_TIME_MS, BOARD_DETAIL_STALE_TIME_MS } from '@/constants/common';

export function useBoardDetailQuery(uuid?: string) {
  return useQuery({
    queryKey: ['board-detail', uuid] as const,
    queryFn: () => getBoardDetail(uuid!),
    enabled: !!uuid,
    staleTime: BOARD_DETAIL_STALE_TIME_MS,
  });
}

export function useBoardCommentsQuery(uuid?: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['board-comments', uuid] as const,
    queryFn: () => getBoardComments(uuid!),
    enabled: !!uuid && enabled,
    staleTime: BOARD_COMMENTS_STALE_TIME_MS,
  });
}

export function usePostCommentMutation(uuid?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => postComment(uuid!, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board-comments', uuid] });
      queryClient.invalidateQueries({ queryKey: ['board-detail', uuid] });
    },
  });
}

export function useLikePostMutation(uuid?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => likePost(uuid!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board-detail', uuid] });
    },
  });
}

export function useDeletePostMutation(uuid?: string) {
  return useMutation({
    mutationFn: () => deletePost(uuid!),
  });
}
