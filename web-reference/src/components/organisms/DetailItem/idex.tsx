import DOMPurify from 'dompurify';
import Badge from '../../atoms/Badge';
import { Typography } from '../../atoms/Typography';

export interface ListItemProps {
  id: number;
  category: string;
  title: string;
  content: string;
  date?: string;
  link: string;
  imgSrc?: string;
  variant?: 'notice' | 'news';
}

const categoryLabel: Record<string, string> = {
  general: '일반공지',
  academic: '학사공지',
  scholarship: '장학공지',
  career: '진로공지',
  activity: '학생활동',
  rule: '학칙개정',
};

const formatDate = (d?: string) => {
  if (!d) return '';
  if (d.includes('T')) return d.split('T')[0];
  return d.replace(/\./g, '-');
};

const DetailItem = ({
  id,
  category,
  title,
  content,
  date,
  link,
  imgSrc,
  variant,
}: ListItemProps) => {
  // 검색 하이라이트 보존
  const safeTitle = DOMPurify.sanitize(title, {
    ALLOWED_TAGS: ['em', 'strong', 'u'],
    ALLOWED_ATTR: [],
  });
  const safeContent = DOMPurify.sanitize(content ?? '', {
    ALLOWED_TAGS: ['em', 'strong', 'u'],
    ALLOWED_ATTR: [],
  });

  const renderText = (html: string, variant: Parameters<typeof Typography>[0]['variant']) => (
    <Typography
      variant={variant}
      className='search-result__highlight line-clamp-2'
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );

  const layout: 'notice' | 'news' = variant ?? (date ? 'notice' : 'news');

  // 명대신문(뉴스)
  if (layout === 'news') {
    return (
      <div>
        <a
          href={link}
          target='_blank'
          rel='noopener noreferrer'
          className='flex md:gap-4 py-6 cursor-pointer'
        >
          {imgSrc && (
            <img
              src={imgSrc || '/default-thumbnail.png'}
              alt={title}
              className='md:min-w-[152px] h-[114px] object-cover rounded-xl'
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/default-thumbnail.png';
              }}
            />
          )}

          <div className='flex flex-col gap-2'>
            {renderText(safeTitle, 'title02')}
            {renderText(safeContent, 'body02')}
          </div>
        </a>
        <hr className='border-grey-20' />
      </div>
    );
  }

  // 공지사항
  return (
    <>
      <a
        className='flex justify-between items-center gap-2 py-6 cursor-pointer'
        href={link}
        target='_blank'
        rel='noopener noreferrer'
      >
        <div>
          <span className='md:w-[1000px] flex items-center mb-4 md:mb-6'>
            <p className='font-light mr-4'>{String(id).padStart(2, '0')}</p>
            <Badge text={layout === 'notice' ? categoryLabel[category] || category : category} />
          </span>
          <div className='flex flex-col gap-2 cursor-pointer'>
            {renderText(safeTitle, 'body02')}
          </div>
        </div>
        <p className='text-xs md:text-sm text-grey-40 flex'>{formatDate(date)}</p>
      </a>
      <hr className='border-grey-20' />
    </>
  );
};

export default DetailItem;
