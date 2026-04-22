import { useState } from 'react';
import Button from '../../components/atoms/Button';
import MyListItem from '../../components/molecules/MyListItem';
import LoadingIndicator from '../../components/atoms/LoadingIndicator';
import Pagination from '../../components/molecules/common/Pagination';
import { FormatToDotDate } from '../../utils';
import { useMyLikedPostsQuery } from '@/hooks/queries/useMyPageQueries';

/**
 * 찜한 글 페이지
 *
 * 사용자가 좋아요를 누른 게시글 목록을 표시하는 페이지입니다.
 * 게시글 제목, 미리보기, 댓글 수, 좋아요 수, 작성 시간을 보여줍니다.
 */
const ViewLikedPosts = () => {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError } = useMyLikedPostsQuery(page, 10);
  const contents = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

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
        <Button shape='rounded'>다시 시도하기</Button>
      </div>
    );

  return (
    <div className='flex w-full flex-1 flex-col bg-white p-4 md:gap-2 md:p-8'>
      <p className='text-title03 text-grey-80 md:text-4xl'>찜한 게시물</p>
      {contents && contents.length > 0 ? (
        <div className='bg-white'>
          {contents.map((content, index) => (
            <MyListItem
              key={content.uuid}
              id={content.uuid}
              title={content.title}
              contentPreview={content.previewContent}
              commentCount={content.commentCount}
              likeCount={content.likeCount}
              publishedDate={FormatToDotDate(content.publishedAt)}
              isLast={index === contents.length - 1}
            />
          ))}

          <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
        </div>
      ) : (
        <p className='text-body01'>아직 찜한 게시글이 없습니다</p>
      )}
    </div>
  );
};

export default ViewLikedPosts;
