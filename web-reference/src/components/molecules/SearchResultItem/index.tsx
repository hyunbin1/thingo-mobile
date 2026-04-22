import DOMPurify from 'dompurify';
import { Typography } from '../../atoms/Typography';
import Chip from '../../atoms/Chip';

interface NoticeItemProps {
  variant: 'notice' | 'community' | 'news';
  title: string;
  imageUrl?: string;
  category?: string;
  content?: string;
  link: string;
}

const CATEGORY_MAP = {
  all: '전체',
  general: '일반공지',
  academic: '학사공지',
  scholarship: '장학공지',
  career: '진로공지',
  activity: '학생활동',
  rule: '학칙개정',
  REPORT: '리포트',
  SOCIETY: '사회',
};

export default function SearchResultItem({
  variant = 'notice',
  title,
  imageUrl,
  category,
  content,
  link,
}: NoticeItemProps) {
  const koreanCategory = CATEGORY_MAP[category as keyof typeof CATEGORY_MAP] || category;

  /**
   * 검색어 highlight를 위해 텍스트를 sanitize 하고, em 태그를 허용합니다.
   */
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

  if (variant === 'news')
    return (
      <a
        className='hover:bg-grey-05 flex cursor-pointer items-center gap-3 rounded-lg p-1 md:gap-6 md:p-3'
        target='_blank'
        rel='noopener noreferrer'
        href={link}
      >
        <img
          className='border-grey-10 h-18 w-24 rounded-lg border-1 object-cover md:h-36 md:w-46'
          src={imageUrl ?? '/default-thumbnail.png'}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/default-thumbnail.png';
          }}
        />
        <div className='flex flex-1 flex-col items-start gap-2 py-3 md:gap-3'>
          <Chip selected variant='caption02'>
            {koreanCategory}
          </Chip>
          {renderText(safeTitle, 'title02')}
          {renderText(safeContent, 'body02')}
        </div>
      </a>
    );
  else
    return (
      <a
        className='hover:bg-grey-05 flex cursor-pointer items-center gap-3 rounded-lg p-1 md:gap-6 md:p-3'
        target='_blank'
        rel='noopener noreferrer'
        href={link}
      >
        {category && (
          <Chip selected variant='caption02'>
            {koreanCategory}
          </Chip>
        )}
        {renderText(safeTitle, 'body03')}
      </a>
    );
}
