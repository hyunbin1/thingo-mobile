import { HighlightedText } from '@/components/atoms/HighlightedText';
import { formatToDotDate } from '@/utils';

interface NoticeItemProps {
  id: number;
  category: string;
  title: string;
  date: string;
  link: string;
}

const categoryLabel: Record<string, string> = {
  general: '일반',
  academic: '학사',
  scholarship: '장학',
  career: '진로',
  activity: '학생활동',
  law: '학칙개정',
  rule: '학칙개정',
  REPORT: '보도',
  SOCIETY: '사회',
  FREE: '자유',
  NOTICE: '정보',
};

export default function NoticeItem({ id, category, title, date, link }: NoticeItemProps) {
  return (
    <div className='flex flex-col'>
      <a key={id} href={link} target='_blank' rel='noopener noreferrer'>
        <div
          className={`border-grey-02 hover:bg-blue-05 h-fit w-full cursor-pointer border-b-1 px-5 py-2.5 transition-colors`}
        >
          <div className='flex flex-col gap-0.5'>
            <span className='text-caption03 text-blue-10'>
              {categoryLabel[category] ?? category}
            </span>
            <HighlightedText className='text-body05 text-black'>{title}</HighlightedText>
            {date && <span className='text-caption04 text-grey-30'>{formatToDotDate(date)}</span>}
          </div>
        </div>
      </a>
    </div>
  );
}
