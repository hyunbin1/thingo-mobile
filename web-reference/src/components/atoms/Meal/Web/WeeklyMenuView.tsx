import React from 'react';
import type { MenuItem } from '@/api/menu';
import MenuDayButton from '@/components/molecules/MenuDayButton';
import MenuItemButton from '@/components/molecules/MenuItemButton';
import { useMenuData } from '@/hooks/menu/useMenuData';

const timeLabelMap = {
  BREAKFAST: '아침',
  LUNCH: '점심',
  DINNER: '저녁',
} as const;
const ORDER: Array<keyof typeof timeLabelMap> = ['BREAKFAST', 'LUNCH', 'DINNER'];

type WeeklyMenuViewProps = {
  groupedByDate: Array<[string, MenuItem[]]>;
  todayKey: string;
  nowCategory?: 'BREAKFAST' | 'LUNCH' | 'DINNER';
};

export default function WeeklyMenuView({
  groupedByDate,
  todayKey,
  nowCategory,
}: WeeklyMenuViewProps) {
  const todayDate = todayKey;
  const { startOfWeek, endOfWeek, getWeekOfMonth, fmtMD } = useMenuData();

  const now = new Date();
  const weekStartsOn = 1;
  const weekStart = startOfWeek(now, weekStartsOn);
  const weekEnd = endOfWeek(now, weekStartsOn);
  const weekOfMonth = getWeekOfMonth(now, weekStartsOn);
  const monthLabel = now.getMonth() + 1;
  const weekRangeLabel = `${fmtMD(weekStart)} ~ ${fmtMD(weekEnd)}`;

  const WeekHeader = () => (
    <div className='mb-3 md:mb-4 flex items-baseline gap-2 justify-center md:justify-start'>
      <h3 className='text-base md:text-xl font-semibold text-mju-primary'>
        {monthLabel}월 {weekOfMonth}주차
      </h3>
      <span className='text-xs md:text-sm text-gray-500'>{weekRangeLabel}</span>
    </div>
  );

  const DesktopTable = () => (
    <div className='hidden md:grid grid-cols-[88px_repeat(3,minmax(0,1fr))] gap-3'>
      <div className='sticky left-0 z-10 bg-white/80 backdrop-blur-md font-semibold text-sm px-2 py-1 rounded'>
        요일
      </div>
      {ORDER.map((k) => (
        <div key={k} className='font-semibold text-sm px-2 py-1'>
          {timeLabelMap[k]}
        </div>
      ))}

      {groupedByDate.map(([date, dayItems]) => {
        const isToday = date === todayDate;
        const weekdayLabel = `${date.split('(')[1]?.split(')')[0]?.trim() ?? ''}요일`;
        const fullRow = ORDER.map((k) => dayItems.find((d) => d.menuCategory === k));

        return (
          <React.Fragment key={date}>
            <div
              className='sticky left-0 z-10 px-0 py-0'
              aria-current={isToday ? 'date' : undefined}
            >
              <MenuDayButton label={weekdayLabel} focused={isToday} />
            </div>

            {fullRow.map((item, idx) =>
              item ? (
                <MenuItemButton
                  key={item.menuCategory}
                  time={timeLabelMap[item.menuCategory as keyof typeof timeLabelMap]}
                  menus={item.meals}
                  focused={isToday && item.menuCategory === nowCategory}
                />
              ) : (
                <div
                  key={`empty-${date}-${idx}`}
                  className='min-h-16 rounded-xl border border-dashed text-xs text-gray-400 flex items-center justify-center'
                >
                  등록된 식단 내용이 없습니다.
                </div>
              ),
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  return (
    <div className='w-full'>
      <WeekHeader />
      <DesktopTable />
    </div>
  );
}
