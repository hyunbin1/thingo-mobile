import { fetchNotionInfo } from '@/api/main/notice-api';
import { Skeleton } from '@/components/atoms/Skeleton';
import type { NoticeItem } from '@/types/notice/noticeInfo';
import { formatToElapsedTime } from '@/utils';
import { handleError } from '@/utils/error';
import { useEffect, useState, useRef } from 'react';
import Pagination from '@/components/molecules/common/Pagination';
import clsx from 'clsx';

const CATEGORIES = {
  all: '전체',
  general: '일반',
  scholarship: '장학',
  career: '진로',
  activity: '학생활동',
  rule: '학칙개정',
} as const;

type CategoryKey = keyof typeof CATEGORIES;

/**
 * 칩 컴포넌트
 */
const Chip = ({
  label,
  isSelected,
  onClick,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={clsx(
      'flex shrink-0 items-center justify-center rounded-[20px] px-3 py-1.5 whitespace-nowrap transition-colors',
      isSelected
        ? 'bg-[#1778ff] font-semibold text-white'
        : 'border border-[#e3e6e6] bg-white font-normal text-[#909499]',
    )}
  >
    <span className='text-[14px] leading-[1.5]'>{label}</span>
  </button>
);

/**
 * 공지 카드 컴포넌트
 */
const NoticeCard = ({
  info,
  isClicked,
  onClick,
}: {
  info: NoticeItem;
  isClicked: boolean;
  onClick: () => void;
}) => (
  <a
    href={info.link}
    target='_blank'
    rel='noopener noreferrer'
    onClick={onClick}
    className={clsx(
      'flex flex-col gap-[3px] border-b border-[#f0f2f5] px-5 py-[10px] transition-colors',
      isClicked ? 'bg-[#e8f1ff]' : 'bg-white',
    )}
  >
    <span className='text-[12px] font-semibold text-[#5dabff]'>
      {CATEGORIES[info.category as CategoryKey] || info.category}
    </span>
    <p className='line-clamp-2 text-[14px] leading-[1.5] font-normal text-[#17171b]'>
      {info.title}
    </p>
    <span className='text-[11px] font-normal text-[#aeb2b6]'>{formatToElapsedTime(info.date)}</span>
  </a>
);

export function NoticeTabSection() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [clickedLink, setClickedLink] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadNotices = async () => {
      try {
        setIsLoading(true);
        const response = await fetchNotionInfo(activeCategory, page, 15, 'desc');
        setNotices(response.content);
        setTotalPages(response.totalPages);
      } catch (error) {
        handleError(error, '공지사항을 불러오던 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    loadNotices();
  }, [activeCategory, page]);

  return (
    <div className='flex flex-col bg-white'>
      <div className='no-scrollbar flex gap-2 overflow-x-auto px-5 py-4' ref={scrollContainerRef}>
        {Object.entries(CATEGORIES).map(([key, label]) => (
          <Chip
            key={key}
            label={label}
            isSelected={activeCategory === key}
            onClick={() => {
              setActiveCategory(key as CategoryKey);
              setPage(0); // 페이지 초기화
              setClickedLink(null); // 클릭 상태 초기화
            }}
          />
        ))}
      </div>

      {/* 공지 리스트 */}
      <div className='flex flex-col'>
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className='border-b border-[#f0f2f5] px-5 py-[10px]'>
              <Skeleton className='mb-1 h-3 w-12' />
              <Skeleton className='mb-2 h-5 w-full' />
              <Skeleton className='h-3 w-16' />
            </div>
          ))
        ) : notices.length > 0 ? (
          notices.map((notice, index) => (
            <NoticeCard
              key={`${notice.link}-${index}`}
              info={notice}
              isClicked={clickedLink === notice.link}
              onClick={() => setClickedLink(notice.link)}
            />
          ))
        ) : (
          <div className='py-20 text-center text-[#909499]'>
            해당 카테고리의 공지사항이 없습니다.
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {!isLoading && totalPages > 1 && (
        <div className='pb-4'>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      )}
    </div>
  );
}

export default NoticeTabSection;
