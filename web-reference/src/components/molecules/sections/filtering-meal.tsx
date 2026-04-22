import { useEffect, useMemo, useState } from 'react';
import { Skeleton } from '@/components/atoms/Skeleton';
import { useMenuData } from '@/hooks/menu/useMenuData';

const MEAL_ICON_URL = '/img/meal-icon.png';

const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토'];
/** 항상 오늘 날짜를 "M월 D일 (요일)" 형식으로 반환 */
function getTodayDateLabel(): string {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const dow = WEEKDAY[now.getDay()];
  return `${month}월 ${day}일 (${dow})`;
}

type MenuCategory = 'BREAKFAST' | 'LUNCH' | 'DINNER';
const EMPTY_MEAL_MARKERS = ['등록된 식단 내용이 없습니다.', '등록된 식단 내용이 없습니다'];
const normalizeMealText = (s: string) => s.replace(/\s+/g, '').trim();
const CATEGORY_ORDER: Array<{ category: MenuCategory; label: string }> = [
  { category: 'BREAKFAST', label: '아침' },
  { category: 'LUNCH', label: '점심' },
  { category: 'DINNER', label: '저녁' },
];

/** 0~8: 아침, 9~13: 점심, 14~23: 저녁 */
function getCurrentMealCategory(): MenuCategory {
  const hour = new Date().getHours();
  if (hour < 9) return 'BREAKFAST';
  if (hour < 14) return 'LUNCH';
  return 'DINNER';
}

export default function FilteringMealSection() {
  const { isLoading, keys, todayKey, getByDate } = useMenuData();
  const [idx, setIdx] = useState<number | null>(null);
  const currentCategory = getCurrentMealCategory();
  const categoriesToShow = useMemo(
    () => CATEGORY_ORDER.filter(({ category }) => category === currentCategory),
    [currentCategory],
  );

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

  // idx가 아직 정해지지 않았으면 오늘 날짜, 아니면 선택된 날짜
  const dateKey = idx !== null ? (keys[idx] ?? todayKey) : todayKey;
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

  const dateLabel = getTodayDateLabel();

  return (
    <div className='flex flex-col gap-4 px-4'>
      {categoriesToShow.map(({ category, label }) => {
        const meals = mealsByCategory.get(category) ?? [];

        // 개발 환경에서는 더미 데이터를 사용해 레이아웃을 확인할 수 있도록 지원
        const dummyMeals: Record<MenuCategory, string[]> = {
          BREAKFAST: ['시리얼', '우유', '토스트', '계란후라이', '샐러드'],
          LUNCH: [
            '브로콜리새우죽',
            '스크램블드에그',
            '감자크로켓',
            '고추지토스트&생크림',
            '그린샐러드&드레싱',
            '과일주스',
          ],
          DINNER: ['돈까스', '밥', '미소된장국', '샐러드', '과일'],
        };
        const isDev = import.meta.env.DEV;
        const effectiveMeals =
          !isLoading && meals.length === 0 && isDev ? (dummyMeals[category] ?? []) : meals;

        const mealLines: string[] = [];
        for (let i = 0; i < effectiveMeals.length; i += 3) {
          mealLines.push(effectiveMeals.slice(i, i + 3).join(', '));
        }
        return (
          <div key={category} className='border-grey-10 rounded-[10px] border p-4'>
            <div className='flex items-center gap-2'>
              <img src={MEAL_ICON_URL} alt='meal' className='h-6 w-6 shrink-0' />
              <h4 className='text-body02 text-black'>
                <span className='text-body02'>{dateLabel || '-'}</span>
                {dateLabel && <span> {label}</span>}
              </h4>
            </div>
            <div className=''>
              {isLoading ? (
                <div className='mt-3 flex flex-col gap-2'>
                  <Skeleton className='h-5 w-full' />
                  <Skeleton className='h-5 w-4/5' />
                  <Skeleton className='h-5 w-3/5' />
                </div>
              ) : effectiveMeals.length === 0 ? (
                <p className='text-body05 text-grey-80 mt-3'>등록된 식단 내용이 없습니다.</p>
              ) : (
                <ul className='mt-3 flex flex-col gap-1'>
                  {mealLines.map((line, index) => (
                    <li key={`${category}-${index}`} className='text-body05 text-grey-80'>
                      {line}
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
}
