import { IoIosArrowBack } from 'react-icons/io';
import { IoIosClose } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

import SearchBar from '@/components/atoms/SearchBar';
import { useEffect, useState } from 'react';
import {
  addRecentKeyword,
  clearRecentKeywords,
  loadRecentKeywords,
  removeRecentKeyword,
} from '@/utils/recentSearch';
import { useAuthStore } from '@/store/useAuthStore';
import { useRealtimeKeywordQuery } from '@/hooks/queries/useRealtimeKeywordQuery';

function goToSearch(navigate: ReturnType<typeof useNavigate>, keyword: string, scope?: string) {
  addRecentKeyword(keyword, undefined, scope);
  navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
}

export default function SearchOverlay() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const recentSearchScope = user?.uuid ?? undefined;
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const recommendedKeywords = ['장학금', '명대신문', '학번', '중간고사', '축제'];
  const { data: hotKeywordData } = useRealtimeKeywordQuery(6);
  const hotKeywords = hotKeywordData?.data ?? [];

  useEffect(() => {
    setSearchHistory(loadRecentKeywords(recentSearchScope));
  }, [recentSearchScope]);

  return (
    <div className='fixed inset-0 z-50 flex justify-center bg-black/30'>
      <div className='flex h-full w-full flex-col bg-white'>
        {/* 검색 헤더 */}
        <header className='flex h-[60px] min-w-0 items-center gap-4 px-4'>
          <button
            type='button'
            onClick={() => navigate(-1)}
            aria-label='검색 닫기'
            className='hover:bg-grey-05 flex shrink-0 cursor-pointer items-center justify-center rounded-full'
          >
            <IoIosArrowBack size={22} className='h-6 w-6' />
          </button>

          <div className='min-w-0 flex-1'>
            <SearchBar
              className='bg-grey-02 w-full rounded-full border-none px-[15px] py-[9px]'
              iconClassName='text-grey-30'
            />
          </div>
        </header>

        <main className='flex-1 overflow-y-auto pl-5'>
          {/* 최근 검색어 */}
          <section className='mt-8'>
            <div className='mb-2.5 flex items-center justify-between'>
              <h2 className='text-body02 font-semibold text-black'>최근 검색어</h2>
              <button
                type='button'
                onClick={() => {
                  clearRecentKeywords(recentSearchScope);
                  setSearchHistory([]);
                }}
                className='text-caption02 text-grey-60 cursor-pointer pr-5 hover:underline'
              >
                전체 삭제
              </button>
            </div>
            <div className='no-scrollbar flex gap-2 overflow-x-auto scroll-smooth'>
              {searchHistory.map((label, index) => (
                <button
                  key={`${label}-${index}`}
                  type='button'
                  onClick={() => goToSearch(navigate, label, recentSearchScope)}
                  className='border-grey-10 text-body05 text-grey-40 flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border bg-white px-3 py-1.5'
                >
                  <span>{label}</span>
                  <IoIosClose
                    size={16}
                    className='text-grey-20 shrink-0 cursor-pointer'
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRecentKeyword(label, recentSearchScope);
                      setSearchHistory(loadRecentKeywords(recentSearchScope));
                    }}
                    aria-label='삭제'
                  />
                </button>
              ))}
              {searchHistory.length === 0 && (
                <span className='text-caption02 text-grey-30 py-1.5'>최근 검색어가 없습니다</span>
              )}
            </div>
          </section>

          {/* 추천 검색어 */}
          <section className='mt-8'>
            <h2 className='text-body02 mb-3 font-semibold text-black'>추천 검색어</h2>
            <div className='no-scrollbar flex gap-2 overflow-x-auto scroll-smooth'>
              {recommendedKeywords.map((label, index) => (
                <button
                  key={`${label}-${index}`}
                  type='button'
                  onClick={() => goToSearch(navigate, label)}
                  className='bg-blue-05 text-body05 text-blue-35 flex shrink-0 cursor-pointer rounded-full px-3 py-1.5'
                >
                  {label}
                </button>
              ))}
              {recommendedKeywords.length === 0 && (
                <span className='text-caption02 text-grey-30 py-1.5'>추천 검색어가 없습니다</span>
              )}
            </div>
          </section>

          {/* 인기 검색어 */}
          <section className='mt-8 pr-5'>
            <h2 className='text-body02 mb-3 font-semibold text-black'>인기 검색어</h2>
            <div className='text-caption01 grid grid-cols-2 gap-y-2'>
              {hotKeywords.map((keyword, index) => (
                <button
                  key={keyword + index}
                  type='button'
                  onClick={() => goToSearch(navigate, keyword)}
                  className='flex w-full items-start justify-start gap-2 text-left'
                >
                  <span className='text-blue-35 text-body04 w-4 shrink-0'>{index + 1}</span>
                  <span className='text-grey-40 text-body05 cursor-pointer text-left'>
                    {keyword}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
