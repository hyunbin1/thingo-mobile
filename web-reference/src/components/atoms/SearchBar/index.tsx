import { FaSearch } from 'react-icons/fa';
import { IoCloseCircle } from 'react-icons/io5';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { GoArrowUpRight } from 'react-icons/go';
import { useDebounce } from '@/hooks/useDebounce';
import { addRecentKeyword } from '@/utils/recentSearch';
import { useAuthStore } from '@/store/useAuthStore';
import { useSearchTracking } from '@/hooks/gtm/useSearchTracking';
import { useSearchSuggestQuery } from '@/hooks/queries/useSearchQueries';

interface SearchBarProps {
  domain?: 'search' | 'notice' | 'news' | 'board' | 'broadcast';
  initialContent?: string;
  className?: string;
  iconClassName?: string;
  searchSource?: string;
}

export default function SearchBar({
  domain = 'search',
  initialContent,
  className,
  iconClassName,
  searchSource = 'searchbar',
}: SearchBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const recentSearchScope = user?.uuid ?? undefined;
  const [value, setValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const prevLengthRef = useRef(0);
  const searchBarRef = useRef<HTMLDivElement>(null);

  const { trackSearchSubmit } = useSearchTracking();

  const getSearchQuery = (keyword: string) => {
    if (domain !== 'search' || !keyword.trim())
      return `?keyword=${encodeURIComponent(keyword.trim())}`;
    const next = new URLSearchParams();
    next.set('keyword', keyword.trim());
    const tab = searchParams.get('tab');
    if (tab) next.set('tab', tab);
    return `?${next.toString()}`;
  };

  useEffect(() => {
    if (initialContent) {
      setValue(initialContent);
      setShowSuggestions(false);
    }
  }, [initialContent]);

  // 디바운스된 값으로 자동완성 쿼리 실행 (signal 자동 전달로 실제 HTTP 취소)
  const debounced = useDebounce(value, 50);
  const { data: suggestedKeywords = [] } = useSearchSuggestQuery(debounced);

  // 글자가 줄어들거나 비워지면 자동완성 숨기기
  useEffect(() => {
    if (value.length === 0 || value.length < prevLengthRef.current) {
      setShowSuggestions(false);
    } else if (value.length > 0) {
      setShowSuggestions(true);
    }
    prevLengthRef.current = value.length;
  }, [value]);

  // 새 제안이 오면 표시 (단, 비어있으면 숨기기)
  useEffect(() => {
    if (suggestedKeywords.length === 0) {
      setShowSuggestions(false);
    }
  }, [suggestedKeywords]);

  // 외부 클릭 시 자동완성 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeywordClick = (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    trackSearchSubmit({
      keyword: trimmed,
      method: 'suggestion',
      search_source: searchSource,
      search_action: 'suggestion_click',
    });

    addRecentKeyword(trimmed, undefined, recentSearchScope);
    const search = getSearchQuery(trimmed);
    setShowSuggestions(false);

    if (location.pathname === `/${domain}` && location.search === search) {
      window.location.reload();
    } else {
      navigate({ pathname: `/${domain}`, search });
    }
  };

  const handleSubmitSearch = () => {
    setShowSuggestions(false);
    const trimmed = value.trim();

    if (trimmed) {
      trackSearchSubmit({
        keyword: trimmed,
        method: 'enter',
        search_source: searchSource,
        search_action: 'submit',
      });
      addRecentKeyword(trimmed, undefined, recentSearchScope);
      navigate({ pathname: `/${domain}`, search: getSearchQuery(trimmed) });
    } else {
      navigate({ pathname: `/${domain}` });
    }
  };

  const visibleSuggestions = showSuggestions ? suggestedKeywords : [];

  return (
    <div className='relative' ref={searchBarRef}>
      {/* 검색바 */}
      <div
        className={twMerge(
          clsx(
            'border-blue-35 flex items-center gap-3 border-2 bg-white px-5 py-3 transition-all md:shadow-sm md:hover:shadow-md',
            visibleSuggestions.length === 0 ? 'rounded-full' : 'rounded-t-2xl border-b-0',
          ),
          className,
        )}
      >
        {!value.trim() && (
          <p
            className={twMerge(
              clsx('text-body04 md:text-body01 text-blue-35 cursor-pointer', iconClassName),
            )}
          >
            <FaSearch />
          </p>
        )}
        <div className='flex min-w-0 flex-1 flex-row'>
          <input
            type='text'
            className='text-body03 md:text-body01 placeholder-grey-20 min-w-0 flex-1 shrink bg-transparent text-black outline-none'
            placeholder={'검색어를 입력하세요'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (e.nativeEvent.isComposing) return;
                handleSubmitSearch();
              }
            }}
          />
          {value.trim() && (
            <div>
              <IoCloseCircle
                className='text-grey-20 h-5 w-5 cursor-pointer'
                onClick={() => setValue('')}
              />
            </div>
          )}
        </div>
      </div>

      {/* 키워드 자동완성 박스 */}
      {visibleSuggestions.length > 0 && (
        <div className='absolute top-full left-0 z-50 mt-1 w-full'>
          <div className='ring-blue-05 flex flex-col gap-1 rounded-2xl bg-white/95 shadow-lg ring-1 backdrop-blur-sm'>
            <div className='border-blue-05/40 flex max-h-80 flex-col overflow-y-auto border-b'>
              {visibleSuggestions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleKeywordClick(item)}
                  className='text-body04 text-grey-90 hover:bg-blue-05/40 active:bg-blue-05/60 flex h-fit w-full items-center gap-3 px-4 py-2.5 text-left transition'
                >
                  <span className='bg-blue-05 text-blue-35 flex h-7 w-7 items-center justify-center rounded-full text-xs'>
                    <FaSearch />
                  </span>
                  <span className='text-body03 flex-1 truncate text-start'>{item}</span>
                  <GoArrowUpRight className='text-blue-35' />
                </button>
              ))}
            </div>
            <a
              className='text-caption02 text-grey-40 w-fit self-end px-4 py-2 underline-offset-2 hover:underline'
              onClick={() => setShowSuggestions(false)}
            >
              닫기
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
