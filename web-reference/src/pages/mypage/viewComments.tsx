import { useEffect, useState } from 'react';
import LoadingIndicator from '../../components/atoms/LoadingIndicator';
import Button from '../../components/atoms/Button';
import MyListItem from '../../components/molecules/MyListItem';
import Pagination from '@/components/molecules/common/Pagination';
import { FormatToDotDate } from '../../utils';
import { useMyCommentsQuery } from '@/hooks/queries/useMyPageQueries';

interface GroupedCommentPost {
  boardUuid: string;
  boardTitle: string;
  boardPreviewContent: string;
  boardViewCount: number;
  boardLikeCount: number;
  boardCreatedAt: string;
  comments: string[];
}

const PAGE_SIZE = 10;

/**
 * 내가 쓴 댓글 페이지
 *
 * 사용자가 작성한 댓글이 포함된 게시글 목록을 표시하는 페이지입니다.
 * 댓글 미리보기와 해당 게시글 정보를 함께 보여줍니다.
 */
const ViewComments = () => {
  const [contents, setContents] = useState<GroupedCommentPost[]>([]);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { data, isLoading, isError } = useMyCommentsQuery(page, PAGE_SIZE);

  useEffect(() => {
    if (!data) {
      setContents([]);
      setTotalPages(0);
      return;
    }
    const grouped = data.content.reduce<Record<string, GroupedCommentPost>>((acc, cur) => {
      const id = cur.boardUuid;

      if (!acc[id]) {
        acc[id] = {
          boardUuid: cur.boardUuid,
          boardTitle: cur.boardTitle,
          boardPreviewContent: cur.boardPreviewContent,
          boardViewCount: cur.boardViewCount,
          boardLikeCount: cur.boardLikeCount,
          boardCreatedAt: cur.boardCreatedAt,
          comments: [],
        };
      }

      if (cur.commentPreviewContent) {
        acc[id].comments.push(cur.commentPreviewContent);
      }

      return acc;
    }, {});

    setContents(Object.values(grouped));
    setTotalPages(data.totalPages);
  }, [data]);

  const handlePageChange = (nextPage: number) => {
    if (nextPage === page) return;
    setPage(nextPage);
  };

  if (isLoading)
    return (
      <div className='flex w-full flex-1 items-center justify-center'>
        <LoadingIndicator />
      </div>
    );

  if (isError)
    return (
      <div className='flex flex-1 flex-col items-center justify-center gap-4'>
        <p className='text-body01'>문제가 발생했습니다</p>
        <Button shape='rounded' onClick={() => window.location.reload()}>
          다시 시도하기
        </Button>
      </div>
    );

  const hasContents = contents.length > 0;

  return (
    <div className='flex w-full flex-1 flex-col bg-white p-4 md:gap-2 md:p-8'>
      <p className='text-title03 text-grey-80 md:text-4xl'>내가 쓴 댓글</p>
      {hasContents ? (
        <div className='bg-white'>
          {contents.map((content, index) => (
            <MyListItem
              key={content.boardUuid}
              id={content.boardUuid}
              title={content.boardTitle}
              contentPreview={content.boardPreviewContent}
              commentCount={content.boardViewCount}
              likeCount={content.boardLikeCount}
              publishedDate={FormatToDotDate(content.boardCreatedAt)}
              commentPreview={content.comments}
              isLast={index === contents.length - 1}
            />
          ))}
          <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
        </div>
      ) : (
        <p className='text-body01'>아직 작성한 댓글이 없습니다</p>
      )}
    </div>
  );
};

export default ViewComments;
