import { Link } from 'react-router-dom';
import { IoIosHeartEmpty } from 'react-icons/io';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { RxDividerVertical } from 'react-icons/rx';
import Divider from '../../atoms/Divider';

export interface MyListItemProps {
  id: string;
  title: string;
  contentPreview: string;
  commentCount: number;
  likeCount: number;
  publishedDate: string;
  commentPreview?: string | string[];
  isLast?: boolean;
}

const MyListItem = ({
  id,
  title,
  contentPreview,
  commentCount,
  likeCount,
  publishedDate,
  commentPreview,
  isLast = false,
}: MyListItemProps) => {
  const commentList =
    commentPreview == null ? [] : Array.isArray(commentPreview) ? commentPreview : [commentPreview];

  const hasComments = commentList.length > 0;

  return (
    <div className='group hover:bg-blue-05 active:bg-blue-05 not-hover:transition'>
      <Link to={`/board/${id}`} className='flex w-full flex-col md:gap-3'>
        <div className='flex h-fit w-full items-center p-2 md:gap-6 md:p-3'>
          <div className='flex h-fit flex-1 flex-col gap-1'>
            <p className='text-body02 font-semibold'>{title}</p>
            <p className='text-body05 line-clamp-1 md:line-clamp-2'>{contentPreview}</p>

            {!hasComments && (
              <div className='flex justify-between gap-2'>
                <div>
                  <p className='text-grey-40 text-caption02 flex items-center gap-1'>
                    <IoIosHeartEmpty className='text-blue-10' />
                    {likeCount}
                    <RxDividerVertical />
                    <IoChatbubbleEllipsesOutline className='text-blue-10' />
                    {commentCount}
                  </p>
                </div>
                <div className='flex h-fit w-fit items-center px-3'>
                  <p className='text-grey-40 text-caption02'>{publishedDate}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {hasComments && (
          <div className='h-fit w-full px-2 pb-2 md:px-3 md:pb-3'>
            <div className='mt-2 flex h-fit w-full flex-col gap-3'>
              {commentList.map((comment, idx) => (
                <div
                  key={idx}
                  className='border-blue-10 flex h-fit w-full flex-col gap-4 border-l-2 pl-2'
                >
                  <div className='flex justify-between'>
                    <span className='bg-blue-05 w-fit rounded-sm px-2 py-1 group-hover:bg-white'>
                      <p className='text-blue-20 text-body05'>나의 댓글</p>
                    </span>
                    <div className='flex items-center px-3'>
                      <p className='text-grey-20 text-caption02 leading-4'>{publishedDate}</p>
                    </div>
                  </div>
                  <p className='text-caption02'>{comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Link>

      {!isLast && <Divider variant='thin' />}
    </div>
  );
};

export default MyListItem;
