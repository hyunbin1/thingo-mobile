import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useHeaderStore } from '@/store/useHeaderStore';
import { IoMdLink, IoIosArrowUp, IoIosArrowDown, IoIosClose, IoIosMenu } from 'react-icons/io';
import type { Category } from '@/api/search';
import { setHomeSliderToMain } from '@/pages/HomeSlider';
import { ScrollableTap } from '@/components/atoms/scrollableTap/index';
import { type Sort } from '@/components/molecules/SortButtons';
import ListEntry, { type SearchTabKey } from './ListEntry';
import { Skeleton } from '@/components/atoms/Skeleton';
import SidebarV2 from '@/components/organisms/SidebarV2';
import SearchBar from '../../components/atoms/SearchBar';
import { useNavTracking } from '@/hooks/gtm/useNavTracking';
import { resolveNavGroupByLabel } from '@/constants/gtm.ts';
import {
  useAllSearchQueries,
  useAiSummaryQuery,
  useSearchQuery,
} from '@/hooks/queries/useSearchQueries';
import type { SearchResultItemRes } from '@/api/search';

type SearchResultType =
  | 'NOTICE'
  | 'MJU_CALENDAR'
  | 'DEPARTMENT_NOTICE'
  | 'COMMUNITY'
  | 'NEWS'
  | 'BROADCAST'
  | 'ALL';

const tapLabel: Record<string, SearchResultType | 'ALL'> = {
  ALL: 'ALL',
  공지사항: 'NOTICE',
  학사일정: 'MJU_CALENDAR',
  학사공지: 'DEPARTMENT_NOTICE',
  게시판: 'COMMUNITY',
  명대신문: 'NEWS',
  명대뉴스: 'BROADCAST',
};

function getNoticeSectionMorePath() {
  return '/search';
}

function getNoticeSectionMoreSearch(tab: SearchTabKey, keyword: string) {
  const params = new URLSearchParams();
  params.set('keyword', keyword);
  if (tab !== 'ALL') params.set('tab', tab);
  return `?${params.toString()}`;
}

function isValidTab(tab: string | null): tab is SearchTabKey {
  return tab !== null && tapLabel[tab] !== undefined;
}

function sliceByType(
  content: SearchResultItemRes[] | undefined,
  type: string,
  limit: number,
): SearchResultItemRes[] {
  if (!content) return [];
  return content.filter((item) => item.type?.toLowerCase() === type.toLowerCase()).slice(0, limit);
}

export default function SearchDetail() {
  const navigate = useNavigate();
  const { setActiveMainSlide } = useHeaderStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentTab, setCurrentTab] = useState<SearchTabKey>(() => {
    const tab = searchParams.get('tab');
    return (isValidTab(tab) ? tab : 'ALL') as SearchTabKey;
  });
  const [categoryTab, setCategoryTab] = useState<Category | string>('all');
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [sort, setSort] = useState<Sort>('relevance');
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((p) => !p);
  const closeMenu = () => setIsOpen(false);

  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const page = pageFromUrl > 0 ? pageFromUrl - 1 : 0;

  const keyword = searchParams.get('keyword');

  const { trackNavClick } = useNavTracking();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (isValidTab(tab) && tab !== currentTab) setCurrentTab(tab);
  }, [searchParams]);

  const handleSetCurrentTab = (tab: string) => {
    if (!isValidTab(tab)) return;
    setCurrentTab(tab);
    setSort('relevance');
    if (tab !== '게시판' && tab !== '학사일정') setCategoryTab('all');
    else if (tab === '게시판') setCategoryTab('NOTICE');
    else if (tab === '학사일정') setCategoryTab('MJU_CALENDAR');
    const next = new URLSearchParams(searchParams);
    if (tab === 'ALL') next.delete('tab');
    else next.set('tab', tab);
    next.set('page', '1');
    setSearchParams(next, { replace: true });
  };

  useEffect(() => {
    setSort('relevance');
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', '1');
    setSearchParams(newParams);
  }, [keyword]);

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', '1');
    setSearchParams(newParams);
  }, [sort, categoryTab]);

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(newPage + 1));
    setSearchParams(newParams);
  };

  const isAllTab = currentTab === 'ALL';

  // ALL 탭: 4가지 타입 병렬 조회
  const allQueries = useAllSearchQueries(keyword, sort);
  const [noticeQuery, communityQuery, newsQuery, broadcastQuery] = allQueries;

  const noticeItems = sliceByType(
    noticeQuery.data?.content as unknown as SearchResultItemRes[],
    'notice',
    5,
  );
  const boardItems = sliceByType(
    communityQuery.data?.content as unknown as SearchResultItemRes[],
    'community',
    5,
  );
  const newsItems = sliceByType(
    newsQuery.data?.content as unknown as SearchResultItemRes[],
    'news',
    5,
  );
  const broadcastItems = sliceByType(
    broadcastQuery.data?.content as unknown as SearchResultItemRes[],
    'broadcast',
    2,
  );

  // 개별 탭: 단일 타입 조회
  const singleTabType = (() => {
    if (isAllTab) return 'NOTICE' as const; // enabled=false이므로 실제 호출 안 됨
    let type = tapLabel[currentTab] as Exclude<SearchResultType, 'ALL'>;
    if (currentTab === '학사일정' && categoryTab === 'academic') type = 'NOTICE';
    return type;
  })();
  const singleCategory =
    currentTab === '명대뉴스' || categoryTab === 'MJU_CALENDAR' ? 'all' : categoryTab;

  const singleQuery = useSearchQuery(keyword, singleTabType, singleCategory, sort, page, !isAllTab);
  const items = (singleQuery.data?.content as unknown as SearchResultItemRes[]) ?? [];
  const totalPages = singleQuery.data?.totalPages ?? 1;

  // AI 요약
  const aiSummaryQuery = useAiSummaryQuery(keyword);
  const aiSummary = aiSummaryQuery.data ?? {
    query: '',
    summary: '',
    document_count: 0,
    sources: [],
  };
  const isAiSummaryLoading = aiSummaryQuery.isLoading;

  return (
    <div className='fixed inset-0 z-50 flex justify-center bg-black/30'>
      <div className='flex h-full w-full flex-col bg-white'>
        {/* 검색바 */}
        <header className='flex h-[60px] min-w-0 items-center gap-4 px-4'>
          <div
            className='h-12 w-12 shrink-0 cursor-pointer'
            onClick={() => {
              setHomeSliderToMain();
              setActiveMainSlide(1);
              if (location.pathname !== '/') navigate('/');
            }}
          >
            <img src='/logo/ThingoSmallLogo.svg' className='h-full w-full object-contain' />
          </div>

          <div className='min-w-0 flex-1 py-2'>
            <SearchBar
              initialContent={keyword ?? undefined}
              className='bg-grey-02 w-full rounded-full border-none px-[15px] py-[9px]'
              iconClassName='text-grey-30'
            />
          </div>
          <button
            type='button'
            className='hover:bg-grey-10/50 mr-3 cursor-pointer rounded-md text-xl text-black transition'
            onClick={toggleMenu}
            aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
          >
            {isOpen ? <IoIosClose /> : <IoIosMenu />}
          </button>
        </header>
        <SidebarV2 isOpen={isOpen} onClose={closeMenu} />

        {/* 탭 */}
        <section>
          <ScrollableTap
            tabs={{
              ALL: 'ALL',
              게시판: '게시판',
              공지사항: '공지사항',
              학사일정: '학사일정',
              명대신문: '명대신문',
              명대뉴스: '명대뉴스',
            }}
            currentTab={currentTab}
            setCurrentTab={handleSetCurrentTab}
            onTabClick={(key, label) => {
              trackNavClick({
                item_name: `top_tab:${key}`,
                item_label: label,
                nav_group: resolveNavGroupByLabel(label),
              });
            }}
          />
        </section>

        <div className='no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto'>
          {/* AI 요약 */}
          {currentTab === 'ALL' && (
            <section className='border-grey-10 flex flex-col gap-3.5 border-b-1 p-5'>
              <div className='text-body02 flex w-full items-center text-black'>
                <div className='flex gap-1'>
                  <p className='text-mju-primary'>AI</p>
                  <p>요약 검색 결과</p>
                </div>
              </div>

              {isAiSummaryLoading ? (
                <>
                  <div className='flex flex-col gap-2'>
                    <Skeleton className='bg-grey-10 h-5 w-3/5 rounded-full' />
                    <Skeleton className='bg-grey-10 h-5 w-3/5 rounded-full' />
                    <Skeleton className='bg-grey-10 h-5 w-3/5 rounded-full' />
                  </div>
                  <div className='text-body05 text-grey-30 flex items-center justify-between py-1'>
                    <Skeleton className='bg-grey-10 h-5 w-3/5 rounded-full' />
                    <div className='flex shrink-0 items-center gap-1'>
                      <Skeleton className='bg-grey-10 h-5 w-11 rounded-full' />
                      <span className='bg-blue-05 rounded-full p-0.5'>
                        <IoMdLink size={15} className='text-mju-primary rotate-135' />
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className='text-body05 text-grey-80 break-words [&_ol]:list-decimal [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul,_ol]:pl-5'>
                    <ReactMarkdown>{aiSummary?.summary ?? ''}</ReactMarkdown>
                  </div>

                  {aiSummary.document_count > 0 && (
                    <div>
                      <div className='text-body05 text-grey-30 flex items-center justify-between py-1'>
                        <p className='line-clamp-1 w-3/4 break-words'>
                          {aiSummary.sources?.[0]?.title}
                        </p>
                        <div className='flex items-center gap-1'>
                          {aiSummary.document_count > 1 && (
                            <div
                              onClick={() => setIsLinkOpen(!isLinkOpen)}
                              className='text-caption01 bg-grey-02 text-grey-20 flex cursor-pointer items-center gap-1 rounded-full px-2'
                            >
                              +{aiSummary.document_count}
                              {isLinkOpen ? (
                                <IoIosArrowUp size={10} className='text-grey-30' />
                              ) : (
                                <IoIosArrowDown size={10} className='text-grey-30' />
                              )}
                            </div>
                          )}
                          <a
                            href={aiSummary.sources?.[0]?.url}
                            className='bg-blue-05 rounded-full p-0.5'
                          >
                            <IoMdLink size={15} className='text-mju-primary rotate-135' />
                          </a>
                        </div>
                      </div>
                      {isLinkOpen &&
                        aiSummary.sources?.slice(1).map((source, idx) => (
                          <div
                            key={idx}
                            className='text-body05 text-grey-30 flex items-center justify-between py-1'
                          >
                            <p className='line-clamp-1 w-3/4 break-words'>{source.title}</p>
                            <a href={source.url} className='bg-blue-05 rounded-full p-0.5'>
                              <IoMdLink size={15} className='text-mju-primary rotate-135' />
                            </a>
                          </div>
                        ))}
                    </div>
                  )}
                </>
              )}
            </section>
          )}

          {/* 검색결과 */}
          <ListEntry
            currentTab={currentTab}
            noticeItems={noticeItems}
            boardItems={boardItems}
            newsItems={newsItems}
            broadcastItems={broadcastItems}
            items={items}
            keyword={keyword}
            initialContent={keyword ?? ''}
            getMorePath={getNoticeSectionMorePath}
            getMoreSearch={getNoticeSectionMoreSearch}
            sort={sort}
            onSortChange={setSort}
            categoryTab={categoryTab}
            setCategoryTab={setCategoryTab}
            page={page}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
