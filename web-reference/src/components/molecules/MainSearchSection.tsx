import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { useHeaderStore } from '@/store/useHeaderStore';

export default function MainSearchSection() {
  const [showSlideHint, setShowSlideHint] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  type CategoryItem = {
    id: number;
    label: string;
    imageUrl: string | null;
    path: string;
  };

  const recommendedCategories: CategoryItem[] = [
    { id: 1, label: '학식', imageUrl: '/main/logos/main_meal.svg', path: '/meal' },
    { id: 2, label: '명지도', imageUrl: '/main/logos/main_map.svg', path: '/map' },
    {
      id: 3,
      label: '학사일정',
      imageUrl: '/main/logos/main_calender.svg',
      path: '/academic-calendar',
    },
    { id: 4, label: '게시판', imageUrl: '/main/logos/main_board.svg', path: '/board' },
  ];

  const { setActiveMainSlide, setSelectedTab } = useHeaderStore();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateShowSlideHint = () => {
      // height가 일정 이하로 줄어들면 화살표/말풍선 숨겨서 퀵 메뉴 아이콘과 겹침 방지, 흰 바탕만 유지
      const isVeryShortHeight = window.innerHeight < 650;
      setShowSlideHint(!isVeryShortHeight);
    };

    updateShowSlideHint();
    window.addEventListener('resize', updateShowSlideHint);
    return () => window.removeEventListener('resize', updateShowSlideHint);
  }, []);

  const handleCategoryClick = (path: string, label: string) => {
    // 특정 카테고리는 슬라이드 뷰의 탭으로 연결
    const tabMap: Record<string, string> = {
      학식: '학식',
      명지도: '명지도',
      학사일정: '학사일정',
      게시판: '게시판',
    };

    if (tabMap[label]) {
      setSelectedTab(tabMap[label]);
      setActiveMainSlide(2); // 슬라이드 뷰로 이동
      return;
    }

    navigate(path);
  };

  const handleSearchBarClick = () => {
    navigate('/search', {
      state: { backgroundLocation: location },
    });
  };

  return (
    <div className='relative flex h-full w-full flex-col items-center justify-start px-6 pt-8 pb-16'>
      <div className='flex h-[230px] w-full max-w-md flex-col items-center justify-center gap-4'>
        <div className='relative'>
          <div className='bg-blue-35 text-caption01 rounded-2xl px-5 py-2.5 whitespace-nowrap text-white shadow-md'>
            명지대에 대한 무엇이든 Go!
          </div>
          <div className='bg-blue-35 absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45'></div>
        </div>

        <button
          type='button'
          onClick={handleSearchBarClick}
          className='text-body03 text-grey-30 border-blue-35 flex w-full items-center gap-3 rounded-full border-2 bg-white px-6 py-4 text-left shadow-sm'
        >
          <FaSearch className='text-blue-35' />
          <span className='flex-1 truncate'>검색어를 입력해 주세요.</span>
        </button>
      </div>

      <div className='-mt-5 mb-18 flex w-full max-w-md flex-col items-center gap-1.5'>
        <div className='flex w-full justify-center gap-5'>
          {recommendedCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.path, category.label)}
              className='flex flex-col items-center gap-2 transition-transform hover:scale-105 active:scale-95'
            >
              <div className='mt-10 flex h-9 w-10 items-center justify-center'>
                {category.imageUrl ? (
                  <img
                    src={category.imageUrl}
                    alt={category.label}
                    className='h-full w-full object-contain'
                  />
                ) : (
                  <div className='h-full w-full' />
                )}
              </div>
              <span className='text-caption01 text-grey-40'>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {showSlideHint && (
        <div className='pointer-events-none absolute inset-x-0 bottom-4 flex flex-col gap-1 px-0'>
          {/* 화살표 좌우 + 옆으로 슬라이드 말풍선 (시각적 안내 전용, 터치 이벤트는 모두 아래로 통과) */}
          <div className='flex items-center justify-between'>
            <div>
              <img src='/main/main_v2_leftArrow.png' alt='이전' className='-ml-1 h-35 w-35' />
            </div>

            <div className='relative'>
              <img src='/main/main_v2_rightArrow.png' alt='다음' className='-mr-1 h-35 w-35' />
              {/* 옆으로 슬라이드 안내 말풍선: 오른쪽 화살표 아래·살짝 오른쪽, 꼬리는 화살표 쪽 */}
              <img
                src='/main/slideBallon.svg'
                alt='옆으로 슬라이드'
                className='slide-indicator-anim-left absolute top-full right-0 -mt-10 mr-7 h-[28px] w-auto max-w-[80px]'
                aria-hidden
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
