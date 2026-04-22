import clsx from 'clsx';
import { FaArrowUp } from 'react-icons/fa';

interface CommentFormProps {
  newComment: string;
  setNewComment: (value: string) => void;
  handleCommentUpload: () => void;
  MAX_REPLY_LEN: number;
  isLoggedin: boolean;
  isUploading?: boolean;
}

/**
 * 댓글 입력 폼 컴포넌트
 * @param newComment - 댓글 입력창의 현재 값 (state)
 * @param setNewComment - newComment state를 업데이트하는 함수
 * @param handleCommentUpload - '전송' 버튼 클릭 또는 Enter 입력 시 호출될 댓글 등록 함수
 * @param MAX_REPLY_LEN - 댓글 최대 글자 수
 * @returns 모바일/데스크탑 환경에 맞는 댓글 입력 폼 컴포넌트
 */
function CommentForm({
  newComment,
  setNewComment,
  handleCommentUpload,
  MAX_REPLY_LEN,
  isLoggedin,
  isUploading = false,
}: CommentFormProps) {
  return (
    <div className='flex flex-col gap-0.5'>
      <div className='relative w-full'>
        <input
          className='text-body05 placeholder-grey-40 bg-grey-02 w-full rounded-lg px-3 py-2.5 text-black'
          placeholder={isLoggedin ? '댓글을 작성해주세요.' : '로그인이 필요한 서비스 입니다'}
          type='text'
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCommentUpload();
            }
          }}
          disabled={!isLoggedin || isUploading}
        />
        <button
          type='button'
          onClick={handleCommentUpload}
          className={clsx(
            'absolute top-1/2 right-2.5 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full transition',
            newComment.trim() ? 'bg-blue-20 text-white' : 'bg-grey-20 text-white',
            isLoggedin && !isUploading && 'cursor-pointer',
          )}
          disabled={!isLoggedin || isUploading}
        >
          {isUploading ? (
            <span className='border-grey-20 h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-t-white' />
          ) : (
            <FaArrowUp size='16' />
          )}
        </button>
      </div>
      <span className='text-caption02 text-grey-40 self-end'>
        {`${newComment.trim().length}/${MAX_REPLY_LEN}`}
      </span>
    </div>
  );
}

export { CommentForm };
