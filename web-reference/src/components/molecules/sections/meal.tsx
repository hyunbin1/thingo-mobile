import { useEffect, useMemo, useState } from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { Skeleton } from '@/components/atoms/Skeleton';
import { useResponsive } from '@/hooks/useResponse';
import { useMenuData } from '@/hooks/menu/useMenuData';

type MenuCategory = 'BREAKFAST' | 'LUNCH' | 'DINNER';
const EMPTY_MEAL_MARKERS = ['등록된 식단 내용이 없습니다.', '등록된 식단 내용이 없습니다'];
const normalizeMealText = (s: string) => s.replace(/\s+/g, '').trim();
const CATEGORY_ORDER: Array<{ category: MenuCategory; label: string }> = [
  { category: 'BREAKFAST', label: '아침' },
  { category: 'LUNCH', label: '점심' },
  { category: 'DINNER', label: '저녁' },
];

export default function MealSection({ all = false }: { all?: boolean }) {
  const { isDesktop } = useResponsive();
  const { isLoading, keys, todayKey, getByDate } = useMenuData();
  const [idx, setIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!keys.length) return;
    setIdx((prev) => {
      if (prev === null) {
        const i = keys.indexOf(todayKey);
        return i >= 0 ? i : 0;
      }
      const max = Math.max(0, keys.length - 1);
      return Math.min(Math.max(prev, 0), max);
    });
  }, [keys, todayKey]);

  const dateKey = keys[idx ?? 0] ?? todayKey;
  const dayItems = useMemo(() => getByDate(dateKey), [dateKey, getByDate]);

  const mealsByCategory = useMemo(() => {
    const normalizedMarkers = EMPTY_MEAL_MARKERS.map(normalizeMealText);
    const map = new Map<MenuCategory, string[]>();

    CATEGORY_ORDER.forEach(({ category }) => map.set(category, []));

    dayItems.forEach((item) => {
      const sanitizedMeals = (item.meals ?? []).filter(
        (meal) => !normalizedMarkers.includes(normalizeMealText(meal)),
      );
      map.set(item.menuCategory, sanitizedMeals);
    });

    return map;
  }, [dayItems]);

  const atStart = (idx ?? 0) <= 0;
  const atEnd = (idx ?? 0) >= keys.length - 1;

  const onPrev = () => {
    if (atStart) return;
    setIdx((i) => (i == null ? 0 : Math.max(0, i - 1)));
  };

  const onNext = () => {
    if (atEnd) return;
    setIdx((i) => (i == null ? 0 : Math.min(keys.length - 1, i + 1)));
  };

  const renderMealCards = ({
    textClassName,
    wrapperClassName,
    cardClassName,
    emptyTextClassName,
    listClassName,
    bodyClassName,
  }: {
    textClassName: string;
    wrapperClassName?: string;
    cardClassName?: string;
    emptyTextClassName?: string;
    listClassName?: string;
    bodyClassName?: string;
  }) => (
    <div className={`flex flex-col gap-4 ${wrapperClassName ?? ''}`}>
      {CATEGORY_ORDER.map(({ category, label }) => {
        const meals = mealsByCategory.get(category) ?? [];
        return (
          <div
            key={category}
            className={`border-grey-10 rounded-2xl border p-4 ${cardClassName ?? ''}`}
          >
            <h4 className='text-body02 text-blue-20 text-center font-semibold'>{label}</h4>
            <div className='bg-grey-10 mt-2 mb-3 h-px w-full' />
            <div className={bodyClassName ?? ''}>
              {isLoading ? (
                <div className='flex flex-col gap-2'>
                  <Skeleton className='h-5 w-full' />
                  <Skeleton className='h-5 w-4/5' />
                  <Skeleton className='h-5 w-3/5' />
                </div>
              ) : meals.length === 0 ? (
                <div className='flex h-full min-h-[72px] items-center justify-center'>
                  <p className={`${textClassName} text-center ${emptyTextClassName ?? ''}`}>
                    등록된 식단 내용이 없습니다.
                  </p>
                </div>
              ) : (
                <ul className={`flex flex-col gap-1 text-center ${listClassName ?? ''}`}>
                  {meals.map((meal, index) => (
                    <li key={`${category}-${index}`} className={textClassName}>
                      {meal}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  /**
   * 모바일 뷰
   */
  if (!isDesktop)
    return (
      <section className='flex w-full flex-col gap-3 p-4'>
        {!all && (
          <div className='flex items-center justify-center gap-4'>
            <button
              type='button'
              onClick={onPrev}
              disabled={atStart}
              className='text-grey-40 disabled:text-grey-10'
              aria-label='이전 날짜'
            >
              <IoChevronBack size={24} />
            </button>
            <span className='text-title03 text-black'>{dateKey || '-'}</span>
            <button
              type='button'
              onClick={onNext}
              disabled={atEnd}
              className='text-grey-40 disabled:text-grey-10'
              aria-label='다음 날짜'
            >
              <IoChevronForward size={24} />
            </button>
          </div>
        )}
        {renderMealCards({
          textClassName: 'text-body05 text-grey-80',
          wrapperClassName: 'min-h-0 flex-1 gap-3 mb-5',
          cardClassName: 'flex flex-col',
          emptyTextClassName: 'text-grey-30',
          listClassName: 'min-h-0 flex-1',
          bodyClassName: 'flex min-h-0 flex-1 flex-col',
        })}
      </section>
    );
}
