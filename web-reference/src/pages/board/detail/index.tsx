import { type CommentRes } from '@/api/board';
import NavigationUp from '@/components/molecules/NavigationUp';
import BlockTextEditor from '@/components/organisms/BlockTextEditor';
import GlobalErrorPage from '@/pages/error';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Comment from '@/components/organisms/Comment';
import { Skeleton, SkeletonCard, SkeletonProfile } from '@/components/atoms/Skeleton';
import { CommentForm } from '@/components/atoms/CommentForm';
import { useAuthStore } from '@/store/useAuthStore';
import { handleError } from '@/utils/error';
import { ChatBubbleIcon, HeartIcon } from '@/components/atoms/Icon';
import { formatToDotDate } from '@/utils/date';
import { useQueryClient } from '@tanstack/react-query';
import {
  useBoardCommentsQuery,
  useBoardDetailQuery,
  useDeletePostMutation,
  useLikePostMutation,
  usePostCommentMutation,
} from '@/hooks/queries/useBoardDetailQueries';

const MAX_REPLY_LEN = 100;

/**
 * 게시판 상세 페이지
 *
 * 게시글의 상세 내용과 댓글을 표시하는 페이지입니다.
 * 게시글 조회, 댓글 작성, 좋아요, 수정, 삭제 기능을 제공합니다.
 * 화면 크기에 따라 레이아웃이 조정됩니다.
 */
export default function BoardDetail() {
  const navigate = useNavigate();
  const { uuid } = useParams<{ uuid: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isCommentUploading, setIsCommentUploading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isError, setIsError] = useState(false);
  const { isLoggedIn } = useAuthStore();
  const queryClient = useQueryClient();
  const contentQuery = useBoardDetailQuery(uuid);
  const commentsQuery = useBoardCommentsQuery(uuid, isLoggedIn);
  const postCommentMutation = usePostCommentMutation(uuid);
  const likePostMutation = useLikePostMutation(uuid);
  const deletePostMutation = useDeletePostMutation(uuid);
  const content = contentQuery.data ?? null;
  const comments: CommentRes[] | null = isLoggedIn ? (commentsQuery.data ?? []) : null;
  const isContentLoading = contentQuery.isLoading;
  const isCommentsLoading = isLoggedIn ? commentsQuery.isLoading : false;

  useEffect(() => {
    if (contentQuery.isError || commentsQuery.isError) {
      setIsError(true);
    }
  }, [contentQuery.isError, commentsQuery.isError]);

  // 댓글 작성 요청
  const handleCommentUpload = async () => {
    if (!uuid || isContentLoading || isCommentUploading) return;

    if (newComment.trim().length < 2) {
      toast.error('댓글을 2글자 이상 작성해 주세요');
      return;
    } else if (newComment.trim().length > 100) {
      toast.error('100자 이내로 작성해주세요');
      return;
    }

    try {
      setIsCommentUploading(true);
      await postCommentMutation.mutateAsync(newComment);
      setNewComment('');
    } catch (err) {
      handleError(err, '댓글 작성에 실패했습니다.');
    } finally {
      setIsCommentUploading(false);
    }
  };

  // 게시글 좋아요 표시 요청
  const handleLikePost = async () => {
    if (!uuid || !content || isContentLoading) return;
    if (!isLoggedIn) {
      toast.error('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }
    setIsLoading(true);
    try {
      const wasLiked = content.isLiked;
      await likePostMutation.mutateAsync();
      await queryClient.invalidateQueries({ queryKey: ['board-detail', uuid] });
      if (!wasLiked) {
        toast.success('좋아요를 표시했습니다.');
      }
    } catch (err) {
      handleError(err, '좋아요 처리에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 게시글 삭제
  const handleDeletePost = async () => {
    if (!uuid || isLoading) return;
    if (!window.confirm('게시글을 삭제하시겠습니까?')) return;
    try {
      setIsLoading(true);
      await deletePostMutation.mutateAsync();
      toast.success('게시글이 삭제되었습니다.');
      navigate(-1);
    } catch (err) {
      handleError(err, '게시글 삭제에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isError) return <GlobalErrorPage />;

  return (
    <div>
      <header className='border-grey-02 flex h-15 items-center border-b px-5'>
        <NavigationUp onClick={() => navigate(-1)} />
      </header>

      {/* 로딩 화면 */}
      {isContentLoading ? (
        <div className='flex flex-1 flex-col gap-4 px-5'>
          <SkeletonProfile /> <Skeleton /> <SkeletonCard /> <Skeleton /> <SkeletonCard />
        </div>
      ) : (
        // 콘텐츠 표시
        content && (
          <div>
            {/* 제목 */}
            <p className='text-body02 mt-5 px-5 text-black'>{content.title}</p>

            <div className='mt-1 flex items-center justify-between px-5'>
              <div className='text-body05 text-grey-40 flex gap-3'>
                <span>{formatToDotDate(content.publishedAt)}</span>
                <span>|</span>
                <span>{content.author}</span>
              </div>
              <div className='text-body05 text-grey-40 flex items-center'>
                <HeartIcon className='text-blue-10' filled={content.isLiked} />
                <span>{content.likeCount}</span>
                <span className='ms-2'>|</span>
                <ChatBubbleIcon className='text-blue-10 ms-1' />
                <span>{content.commentCount}</span>
              </div>
            </div>

            {/* 본문 */}
            <div className='my-15 px-5'>
              <BlockTextEditor readOnly initialContent={content.content} />
            </div>

            <div className='border-grey-02 flex items-center justify-between border-b px-5 pb-5'>
              {/* 좋아요 버튼 */}
              <button className='flex cursor-pointer items-center' onClick={handleLikePost}>
                <span className='text-body04 text-grey-40'>좋아요</span>
                {!isLoggedIn ? (
                  <HeartIcon className='text-grey-20' filled />
                ) : content.isLiked ? (
                  <HeartIcon className='text-blue-10' filled />
                ) : (
                  <HeartIcon className='text-blue-10' />
                )}
              </button>

              {/* 수정 및 삭제 버튼 (본인 게시글일 때만 표시) */}
              {(content.canEdit || content.canDelete) && (
                <div className='flex items-center'>
                  {content.canEdit && (
                    <button
                      type='button'
                      className='text-body05 text-grey-40 cursor-pointer px-2 py-1'
                      onClick={() => uuid && navigate(`/board/edit/${uuid}`)}
                    >
                      수정
                    </button>
                  )}
                  {content.canDelete && (
                    <button
                      type='button'
                      className='text-body05 text-grey-40 ms-1 cursor-pointer px-2 py-1 disabled:opacity-50'
                      onClick={handleDeletePost}
                      disabled={isLoading}
                    >
                      삭제
                    </button>
                  )}
                </div>
              )}
            </div>

            <p className='text-body02 ms-5 mt-5 text-black'>댓글</p>

            {isLoggedIn ? (
              <>
                {/* 댓글 입력기 */}
                <div className='mt-1.5 px-5'>
                  <CommentForm
                    newComment={newComment}
                    setNewComment={setNewComment}
                    handleCommentUpload={handleCommentUpload}
                    MAX_REPLY_LEN={MAX_REPLY_LEN}
                    isLoggedin={isLoggedIn}
                    isUploading={isCommentUploading}
                  />
                </div>

                {/* 댓글 조회 */}
                <div className='mt-5 mb-10 flex flex-col gap-8 px-5'>
                  {isCommentsLoading ? (
                    <div className='flex flex-col gap-4'>
                      {[...Array(8)].map((_, index) => (
                        <SkeletonProfile key={index} />
                      ))}
                    </div>
                  ) : (
                    comments &&
                    comments.map((comment) => (
                      <Comment
                        key={comment.commentUUID}
                        commentUuid={comment.commentUUID}
                        boardUuid={uuid!}
                        authorName={comment.nickname}
                        content={comment.content}
                        createdAt={comment.createdAt}
                        profileImageUrl={comment.profileImageUrl}
                        likeCount={comment.likeCount}
                        liked={comment.liked}
                        replies={comment.replies}
                        isAuthor={comment.commentIsAuthor}
                        isLoggedin={isLoggedIn}
                      />
                    ))
                  )}

                  {comments?.length === 0 && <p className='text-center'>작성된 댓글이 없습니다</p>}
                </div>
              </>
            ) : (
              <div className='p-5'>
                <div className='border-grey-10 flex h-25 items-center justify-center rounded-sm border'>
                  <p className='text-body05 text-grey-30'>로그인 후 이용 가능합니다.</p>
                </div>
                <Link
                  to='/login'
                  className='bg-blue-35 text-body05 mt-5 flex h-10 w-full items-center justify-center rounded-md text-white'
                >
                  Thingo 로그인하기
                </Link>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
