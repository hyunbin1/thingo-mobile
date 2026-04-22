import type { MenuItem } from '@/api/menu';
import MenuDayButton from '@/components/molecules/MenuDayButton';
import MenuItemButton from '@/components/molecules/MenuItemButton';

type DailyMenuViewProps = {
  dateKey: string;
  items: MenuItem[];
  nowCategory?: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  onPrev: () => void;
  onNext: () => void;
};

export function DailyMenuView({ dateKey, items, nowCategory, onPrev, onNext }: DailyMenuViewProps) {
  const weekday = dateKey.match(/\((.+)\)/)?.[1] ?? '';
  const row = ['BREAKFAST', 'LUNCH', 'DINNER'].map((k) => items.find((i) => i.menuCategory === k));

  return (
    <section className='md:hidden rounded-lg border-2 border-grey-05 p-4 space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <button onClick={onPrev} aria-label='이전 날짜' className='px-2 text-sm'>
            ‹
          </button>
          <MenuDayButton label={`${weekday} 요일`} focused />
          <button onClick={onNext} aria-label='다음 날짜' className='px-2 text-sm'>
            ›
          </button>
        </div>
        <span className='text-xs text-gray-500'>{dateKey}</span>
      </div>

      <div className='grid gap-2 text-center'>
        {row.map((item, idx) =>
          item ? (
            <MenuItemButton
              key={item.menuCategory}
              time={{ BREAKFAST: '아침', LUNCH: '점심', DINNER: '저녁' }[item.menuCategory]}
              menus={item.meals}
              focused={item.menuCategory === nowCategory}
            />
          ) : (
            <div
              key={idx}
              className='min-h-14 rounded-xl border border-dashed text-xs text-grey-40 flex items-center justify-center'
            >
              메뉴 없음
            </div>
          ),
        )}
      </div>
    </section>
  );
}
