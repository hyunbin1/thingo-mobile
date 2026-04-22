import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { formatToLocalDate } from '@/utils';
import { type BroadcastItem } from '@/api/main/broadcast-api';
import LoadingIndicator from '@/components/atoms/LoadingIndicator';
import Pagination from '@/components/molecules/common/Pagination';
import { useResponsive } from '@/hooks/useResponse';
import SearchBar from '@/components/atoms/SearchBar';
import { HighlightedText } from '@/components/atoms/HighlightedText';
import { BROADCAST_PAGE_SIZE } from '@/constants/common';
import {
  useBroadcastListQuery,
  useBroadcastSearchQuery,
} from '@/hooks/queries/useBroadcastPageQuery';

/**
 * 명대방송 페이지
 *
 * 명지대학교 방송국 영상 목록을 표시하는 페이지입니다.
 * 검색 기능을 제공하며, 데스크톱에서는 그리드 형태, 모바일에서는 리스트 형태로 표시됩니다.
 */
export default function Broadcast() {
  // 반응형 처리: useResponsive 훅으로 화면 크기 분기점 관리
  const { isDesktop } = useResponsive();

  const [searchParams, setSearchParams] = useSearchParams();
  const [initialKeyword, setInitialKeyword] = useState('');
  const keyword = searchParams.get('keyword');
  const page = Number(searchParams.get('page') || '0');
  const normalizedKeyword = (keyword ?? '').trim();
  const hasKeyword = normalizedKeyword.length > 0;

  /**
   * 페이지 번호를 url에 반영합니다
   */
  const handlePageChange = (newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', String(newPage));
    setSearchParams(newSearchParams);
  };

  /**
   * 주소에 search parameter 값이 있으면 검색바에 반영합니다
   */
  useEffect(() => {
    if (keyword) setInitialKeyword(keyword);
    else setInitialKeyword('');
  }, [keyword]);

  const listQuery = useBroadcastListQuery(page, BROADCAST_PAGE_SIZE);
  const searchQuery = useBroadcastSearchQuery(normalizedKeyword, page, BROADCAST_PAGE_SIZE);

  const isLoading = hasKeyword ? searchQuery.isLoading : listQuery.isLoading;
  const contents: BroadcastItem[] = hasKeyword
    ? (searchQuery.data?.data ?? [])
    : (listQuery.data?.content ?? []);
  const totalPage = hasKeyword
    ? (searchQuery.data?.totalPages ?? 1)
    : (listQuery.data?.totalPages ?? 1);

  /**
   * 로딩 페이지
   */
  if (isLoading) return <LoadingIndicator />;

  /**
   * 데스크톱 페이지
   */
  if (isDesktop)
    return (
      <div className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>
        <Link to='/broadcast'>
          <h2 className='text-heading01 text-mju-primary'>명대방송</h2>
        </Link>
        <SearchBar domain='broadcast' initialContent={initialKeyword} />
        <div className='w-full flex-1'>
          <section className='grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-6'>
            {contents.map((content) => (
              <article
                key={content.url}
                className='overflow-hidden rounded-md border bg-white shadow-sm transition-shadow hover:shadow'
              >
                <div className='relative aspect-video w-full'>
                  <iframe
                    className='h-54 w-full rounded-t-xl'
                    src={`https://www.youtube.com/embed/${extractYoutubeId(content.url)}`}
                    title={content.title}
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                  />
                </div>
                <div className='p-3'>
                  <HighlightedText className='line-clamp-2 text-sm font-semibold md:text-base'>
                    {content.title}
                  </HighlightedText>
                  <p className='mt-1 text-xs text-gray-500'>
                    {formatToLocalDate(content.publishedAt)}
                  </p>
                </div>
              </article>
            ))}
          </section>
        </div>
        <Pagination page={page} totalPages={totalPage} onChange={handlePageChange} />
      </div>
    );

  /**
   * 모바일 페이지
   */
  if (!isDesktop)
    return (
      <div className='flex flex-1 flex-col gap-6 p-5'>
        <div className='flex flex-col gap-3'>
          <Link to='/broadcast'>
            <h2 className='text-title01 text-blue-35'>명대뉴스</h2>
          </Link>
          <SearchBar domain='broadcast' initialContent={initialKeyword} />
        </div>

        {/* 방송국 목록 표시 */}
        <div className='flex flex-1 flex-col gap-2'>
          {contents.map((content) => {
            return (
              <article key={content.url} className='flex flex-col gap-1'>
                <iframe
                  className='h-54 w-full rounded-lg'
                  src={`https://www.youtube.com/embed/${extractYoutubeId(content.url)}`}
                  title={content.title}
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                />
                <div className='border-grey-10 rounded-lg border px-4 py-2'>
                  <div className='flex flex-col gap-1'>
                    <HighlightedText className='text-body04 text-black'>
                      {content.title}
                    </HighlightedText>
                    {content.playlistTitle && (
                      <HighlightedText className='text-body05 text-grey-40'>
                        {content.playlistTitle}
                      </HighlightedText>
                    )}
                    <span className='text-caption04 text-grey-40'>
                      {formatToLocalDate(content.publishedAt)}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}

          {/* 검색 결과 없음 표시 */}
          {!isLoading && keyword && contents.length === 0 && (
            <div className='flex flex-1 items-center justify-center'>
              <span className='text-body05 text-grey-40'>{`"${keyword}"에 대한 검색 결과가 없습니다`}</span>
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        {!isLoading && contents.length > 0 && (
          <Pagination page={page} totalPages={totalPage} onChange={handlePageChange} />
        )}
      </div>
    );
}

/**
 *
 * @param url
 * @returns
 */
export const extractYoutubeId = (url: string): string => {
  let match = url.match(/v=([^&]+)/);
  if (match) return match[1];
  match = url.match(/youtu\.be\/([^?]+)/);
  if (match) return match[1];
  return '';
};
