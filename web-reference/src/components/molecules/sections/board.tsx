import type { Category } from '@/api/board';
import { CardHeader } from '@/components/atoms/Card';
import { formatToDotDate } from '@/utils/date';
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import Pagination from '@/components/molecules/common/Pagination';
import { MdChevronRight } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { ChatBubbleIcon, HeartIcon } from '@/components/atoms/Icon';
import { useHeaderStore } from '@/store/useHeaderStore';
import { useBoardQuery } from '@/hooks/queries/useBoardQuery';

const ITEM_COUNT = 10;

const BOARD_TAB_STORAGE_KEY = 'board-section-category';
const BOARD_PAGE_STORAGE_KEY_PREFIX = 'board-section-page';

function getStoredCategory(): 'NOTICE' | 'FREE' {
  if (typeof sessionStorage === 'undefined') return 'NOTICE';
  const stored = sessionStorage.getItem(BOARD_TAB_STORAGE_KEY);
  return stored === 'FREE' ? 'FREE' : 'NOTICE';
}

function getStoredPageForCategory(cat: 'NOTICE' | 'FREE'): number {
  if (typeof sessionStorage === 'undefined') return 0;
  const stored = sessionStorage.getItem(`${BOARD_PAGE_STORAGE_KEY_PREFIX}-${cat}`);
  const num = Number(stored);
  return Number.isInteger(num) && num >= 0 ? num : 0;
}

interface BoardSectionProps {
  showWriteButton?: boolean;
  all?: boolean;
  onSeeMoreClick?: () => void;
}

export default function BoardSection({
  showWriteButton = false,
  all = false,
  onSeeMoreClick,
}: BoardSectionProps) {
  const boardCategoryFromNav = useHeaderStore((s) => s.boardCategory);
  const setBoardCategory = useHeaderStore((s) => s.setBoardCategory);

  const [category, setCategory] = useState<'NOTICE' | 'FREE'>(getStoredCategory);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (boardCategoryFromNav === 'NOTICE' || boardCategoryFromNav === 'FREE') {
      setCategory(boardCategoryFromNav);
      setBoardCategory(null);
    }
  }, [boardCategoryFromNav, setBoardCategory]);

  const [pageByCategory, setPageByCategory] = useState<Record<'NOTICE' | 'FREE', number>>(() => ({
    NOTICE: getStoredPageForCategory('NOTICE'),
    FREE: getStoredPageForCategory('FREE'),
  }));

  const page = pageByCategory[category];
  const setPage = (nextPage: number) => {
    setPageByCategory((prev) => ({ ...prev, [category]: nextPage }));
    sessionStorage.setItem(`${BOARD_PAGE_STORAGE_KEY_PREFIX}-${category}`, String(nextPage));
  };

  const { data, isLoading } = useBoardQuery(category as Category, page, ITEM_COUNT);
  const contents = all ? (data?.content?.slice(0, 5) ?? []) : (data?.content ?? []);
  const totalPages = data?.totalPages ?? 0;

  useEffect(() => {
    sessionStorage.setItem(BOARD_TAB_STORAGE_KEY, category);
  }, [category]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className='relative mb-4 flex min-h-[400px] flex-col bg-white'>
      {all && (
        <CardHeader className='px-3'>
          <h2 className='text-title03 px-2 font-bold text-black'>게시판</h2>
          {onSeeMoreClick ? (
            <button
              type='button'
              onClick={onSeeMoreClick}
              className='text-grey-30 p-2'
              aria-label='게시판 탭으로 이동'
            >
              <MdChevronRight size={24} className='text-grey-60' />
            </button>
          ) : (
            <Link to='/board' className='text-grey-30 p-2'>
              <MdChevronRight size={24} className='text-grey-60' />
            </Link>
          )}
        </CardHeader>
      )}

      {!all && (
        <div className='bg-grey-02 my-0 flex items-center pt-[8px]'>
          <div className='flex flex-1 items-center overflow-hidden'>
            <button
              onClick={() => setCategory('NOTICE')}
              className={clsx(
                'flex flex-1 cursor-pointer items-center justify-center text-[14px] leading-[1.5]',
                category === 'NOTICE'
                  ? 'border-grey-10 gap-[4px] rounded-tr-[4px] border-r bg-white pt-[10px] pr-[10px] pb-[8px] pl-[12px] font-semibold text-black'
                  : 'bg-grey-02 border-grey-10 text-grey-40 border-b px-[12px] pt-[10px] pb-[8px] font-normal',
              )}
            >
              정보게시판
            </button>
            <button
              onClick={() => setCategory('FREE')}
              className={clsx(
                'flex flex-1 cursor-pointer items-center justify-center text-[14px] leading-[1.5]',
                category === 'FREE'
                  ? 'border-grey-10 gap-[4px] rounded-tl-[4px] border-l bg-white pt-[10px] pr-[10px] pb-[8px] pl-[12px] font-semibold text-black'
                  : 'bg-grey-02 border-grey-10 text-grey-40 border-b px-[12px] pt-[10px] pb-[8px] font-normal',
              )}
            >
              자유게시판
            </button>
          </div>
        </div>
      )}

      <div className='flex flex-col pt-4'>
        {contents.map((content, index) => {
          const isLast = index === contents.length - 1;
          return (
            <Link
              key={content.uuid}
              to={`/board/${content.uuid}`}
              className='active:bg-blue-05 hover:bg-blue-05'
            >
              <div className='px-5 py-2'>
                <div className='flex items-center'>
                  {content.popular && (
                    <div className='bg-blue-20 text-caption04 me-1 flex h-5 w-10 items-center justify-center rounded-full text-white'>
                      HOT
                    </div>
                  )}
                  <p className='text-body04 text-grey-80 line-clamp-1'>{content.title}</p>
                </div>
                <p className='text-body05 mt-1 line-clamp-2 text-black'>{content.previewContent}</p>
                <div className='mt-2 flex items-center justify-between'>
                  <div className='flex items-center'>
                    <HeartIcon className='text-blue-10' filled={content.liked} />
                    <span className='text-caption02 text-grey-40 ms-1'>{content.likeCount}</span>
                    <ChatBubbleIcon className='text-blue-10 ms-2' />
                    <span className='text-caption02 text-grey-40 ms-1'>{content.commentCount}</span>
                  </div>
                  <span className='text-caption02 text-grey-40'>
                    {content.publishedAt
                      ? formatToDotDate(content.publishedAt)
                      : formatToDotDate(content.createdAt)}
                  </span>
                </div>
              </div>
              {!isLast && <div className='bg-grey-02 h-px' />}
            </Link>
          );
        })}

        {!isLoading && contents.length === 0 && (
          <div className='flex flex-1 items-center justify-center py-10'>
            <span className='text-body05 text-grey-20'>등록된 게시글이 없습니다.</span>
          </div>
        )}

        {contents.length > 0 && !all && (
          <div className='pb-4'>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
      </div>

      {!all &&
        isMounted &&
        showWriteButton &&
        createPortal(
          <div className='fixed right-5 bottom-18 z-50'>
            <Link to='/board/write'>
              <div className='bg-blue-35 flex h-[56px] w-[56px] flex-col items-center justify-center rounded-full shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)] active:scale-95'>
                <img
                  src='/img/icon-boardNew.png'
                  alt='icon-boardNew'
                  className='h-[24px] w-[24px] object-contain'
                />
                <span className='mt-0.5 text-[10px] leading-[1.2] font-medium text-white'>
                  글남기기
                </span>
              </div>
            </Link>
          </div>,
          document.body,
        )}
    </section>
  );
}
