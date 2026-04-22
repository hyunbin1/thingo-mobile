import Divider from '../../components/atoms/Divider';
import SearchBar from '../../components/atoms/SearchBar';
import { Typography } from '../../components/atoms/Typography';
import SearchResultItem from '../../components/molecules/SearchResultItem';
import { useEffect, useState } from 'react';
import { getSearchResult, type SearchResultItemRes } from '../../api/search';
import { Link, useSearchParams } from 'react-router-dom';

/**
 * 검색 페이지
 *
 * 통합 검색 결과를 표시하는 페이지입니다.
 * 공지사항, 자유게시판, 명대신문 검색 결과를 한 번에 보여줍니다.
 */
export default function Search() {
  const [searchParams] = useSearchParams();
  const [noticeItems, setNoticeItems] = useState<SearchResultItemRes[]>([]);
  const [boardItems, setBoardItems] = useState<SearchResultItemRes[]>([]);
  const [newsItems, setNewsItems] = useState<SearchResultItemRes[]>([]);
  const [initialContent, setInitialContent] = useState('');

  const keyword = searchParams.get('keyword');

  /**
   * 검색어 초기값 반영 (search parameter 반영)
   */
  useEffect(() => {
    (async () => {
      if (!keyword) return;
      setInitialContent(keyword);
      try {
        await handleSearch(keyword);
      } catch {
        // 에러는 상위에서 처리
      }
    })();
  }, [keyword]);

  /**
   * 검색 요청 function
   */
  const filterByType = (content: SearchResultItemRes[], type: string) =>
    content.filter((item) => item.type?.toLowerCase() === type.toLowerCase()).slice(0, 5);

  async function handleSearch(text: string) {
    const res = await getSearchResult(text, 'all', 'all', 'relevance');
    const content = res.content as unknown as SearchResultItemRes[];
    setNoticeItems(filterByType(content, 'notice'));
    setBoardItems(filterByType(content, 'community'));
    setNewsItems(filterByType(content, 'news'));
  }

  return (
    <div className='flex flex-col gap-4 p-4 md:gap-12 md:p-8'>
      <SearchBar initialContent={initialContent} />
      <Divider variant='default' />
      <div className='flex flex-col gap-12 md:gap-24'>
        {/*
         * 공지사항 검색결과 binding
         */}
        <div className='flex flex-col gap-3'>
          <Typography variant='heading02' className='text-mju-primary'>
            공지사항
          </Typography>
          <div className='border-grey-05 flex flex-col gap-3 rounded-lg border-2 p-3'>
            {noticeItems.map((notice, idx) => (
              <div key={idx}>
                <SearchResultItem
                  key={notice.id}
                  variant='notice'
                  category={notice.category}
                  title={notice.highlightedTitle}
                  link={notice.link}
                />
                {idx < noticeItems.length - 1 && <Divider variant='thin' />}
              </div>
            ))}
            {noticeItems.length === 0 && (
              <div className='flex min-h-20 items-center justify-center'>
                <Typography>검색 결과가 없습니다</Typography>
              </div>
            )}
          </div>
          {noticeItems.length === 5 && (
            <Link
              to={{
                pathname: `/notice`,
                search: `?keyword=${initialContent}`,
              }}
              className='bg-grey-05 w-fit cursor-pointer gap-2.5 self-center rounded-lg px-4 py-2'
            >
              <Typography variant='body03'>더보기</Typography>
            </Link>
          )}
        </div>
        {/*
         * 자유게시판 검색결과 binding
         */}
        <div className='flex flex-col gap-3'>
          <Typography variant='heading02' className='text-mju-primary'>
            자유게시판
          </Typography>
          <div className='border-grey-05 flex flex-col gap-3 rounded-lg border-2 p-3'>
            {boardItems.map((board, idx) => (
              <div key={idx}>
                <SearchResultItem
                  key={board.id}
                  variant='community'
                  category={board.category}
                  imageUrl={board.imageUrl}
                  title={board.highlightedTitle}
                  link={board.link}
                />
                {idx < boardItems.length - 1 && <Divider variant='thin' />}
              </div>
            ))}
            {boardItems.length === 0 && (
              <div className='flex min-h-20 items-center justify-center'>
                <Typography>검색 결과가 없습니다</Typography>
              </div>
            )}
          </div>
          {boardItems.length === 5 && (
            <Link
              to={{
                pathname: `/board`,
                search: `?keyword=${initialContent}`,
              }}
              className='bg-grey-05 w-fit gap-2.5 self-center rounded-lg px-4 py-2'
            >
              <Typography variant='body03'>더보기</Typography>
            </Link>
          )}
        </div>
        {/*
         * 명대신문 검색결과 binding
         */}
        <div className='flex flex-col gap-3'>
          <Typography variant='heading02' className='text-mju-primary'>
            명대신문
          </Typography>
          <div className='border-grey-05 flex flex-col gap-3 rounded-lg border-2 p-3'>
            {newsItems.map((news, idx) => (
              <div key={idx}>
                <SearchResultItem
                  key={news.id}
                  variant='news'
                  imageUrl={news.imageUrl}
                  category={news.category}
                  title={news.highlightedTitle}
                  content={news.highlightedContent}
                  link={news.link}
                />
                {idx < newsItems.length - 1 && <Divider variant='thin' />}
              </div>
            ))}
            {newsItems.length === 0 && (
              <div className='flex min-h-20 items-center justify-center'>
                <Typography>검색 결과가 없습니다</Typography>
              </div>
            )}
          </div>
          {newsItems.length === 5 && (
            <Link
              to={{
                pathname: `/news`,
                search: `?keyword=${initialContent}`,
              }}
              className='bg-grey-05 w-fit gap-2.5 self-center rounded-lg px-4 py-2'
            >
              <Typography variant='body03'>더보기</Typography>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
