import { Typography } from '@/components/atoms/Typography';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { IoIosHeartEmpty } from 'react-icons/io';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { formatToDotDate } from '@/utils';
import { blockNoteContentToPreview } from '@/components/organisms/BlockTextEditor/util';

interface BoardCardProps {
  id: number | string;
  title: string;
  previewContent: string;
  likeCount: number;
  commentCount: number;
  publishedAt: string;
  isPopular: boolean;
}

export default function BoardCard({
  id,
  title,
  previewContent,
  likeCount,
  commentCount,
  publishedAt,
  isPopular,
}: BoardCardProps) {
  const boardId = typeof id === 'string' ? id.replace(/^COMMUNITY:/, '') : String(id);
  return (
    <Link
      className='hover:bg-blue-05 border-grey-02 flex cursor-pointer border-b-1 px-5 py-4 transition-colors'
      to={`/board/${boardId}`}
    >
      <div
        className={clsx(
          'flex flex-1 flex-col gap-0.5',
          isPopular && 'border-blue-05 border-l-2 pl-4',
        )}
      >
        <Typography variant='body02' className='text-black'>
          {title}
        </Typography>
        <p className='text-body05 line-clamp-2 text-black'>
          {blockNoteContentToPreview(previewContent)}
        </p>
        <div className='mt-1 flex items-center justify-between'>
          <div className='text-caption02 text-grey-40 flex items-center gap-2'>
            <span className='text-blue-20 flex items-center gap-1'>
              <IoIosHeartEmpty />
              <span className='text-grey-40'>{likeCount}</span>
            </span>
            <span className='text-blue-20 flex items-center gap-1'>
              <IoChatbubbleEllipsesOutline />
              <span className='text-grey-40'>{commentCount}</span>
            </span>
          </div>
          <div className='flex min-w-[70px] items-center justify-center'>
            <Typography variant='caption02' className='text-grey-40 font-normal'>
              {formatToDotDate(publishedAt)}
            </Typography>
          </div>
        </div>
      </div>
    </Link>
  );
}
