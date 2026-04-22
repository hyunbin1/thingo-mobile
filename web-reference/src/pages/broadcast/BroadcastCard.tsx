import { HighlightedText } from '@/components/atoms/HighlightedText';
import { formatToDotDate } from '@/utils';
import { extractYoutubeId } from '.';

interface BroadcastCardProps {
  title: string;
  url: string;
  playlistTitle: string | null;
  publishedAt: string;
}

export default function BroadcastCard({
  title = '',
  url = '',
  playlistTitle = null,
  publishedAt = '',
}: BroadcastCardProps) {
  const youtubeId = typeof url === 'string' ? extractYoutubeId(url) : '';
  const hasValidEmbed = Boolean(youtubeId);

  return (
    <div className='flex flex-1 flex-col gap-4 p-5'>
      <article key={url || 'broadcast'} className='flex flex-col'>
        {hasValidEmbed ? (
          <iframe
            className='h-54 w-full rounded-t-[8px] rounded-b-none'
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={title}
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
          />
        ) : (
          <div className='border-grey-10 bg-grey-05 flex h-54 w-full items-center justify-center rounded-t-[8px] rounded-b-none border'>
            <span className='text-caption02 text-grey-40'>영상 링크 없음</span>
          </div>
        )}
        <div className='border-grey-10 rounded-t-none rounded-b-[8px] border px-4 py-2'>
          <div className='flex flex-col gap-1'>
            <HighlightedText className='text-body04 text-black'>{title}</HighlightedText>
            {playlistTitle && (
              <HighlightedText className='text-body05 text-grey-40'>
                {playlistTitle}
              </HighlightedText>
            )}
            {publishedAt && (
              <span className='text-caption04 text-grey-40'>{formatToDotDate(publishedAt)}</span>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
