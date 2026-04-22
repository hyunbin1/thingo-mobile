import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMenus, type MenuItem } from '@/api/menu';
import { MENU_STALE_TIME_MS } from '@/constants/common';

const ORDER: Array<MenuItem['menuCategory']> = ['BREAKFAST', 'LUNCH', 'DINNER'];

export function useMenuData() {
  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery<MenuItem[]>({
    queryKey: ['menus'],
    queryFn: getMenus,
    staleTime: MENU_STALE_TIME_MS,
  });

  const stripDow = (s: string) => s.replace(/\s*\([^)]*\)\s*/g, '').trim(); // '(월)' 같은 요일 제거

  // 날짜별 그룹 + 끼니 순 정렬 + 날짜 정렬
  const groupedByDate = useMemo(() => {
    const map = new Map<string, MenuItem[]>();
    for (const m of data) {
      if (!map.has(m.date)) map.set(m.date, []);
      map.get(m.date)!.push(m);
    }
    for (const [, arr] of map) {
      arr.sort((a, b) => ORDER.indexOf(a.menuCategory) - ORDER.indexOf(b.menuCategory));
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [data]);

  // 키 모음 / 오늘 키 / 헬퍼
  const keys = groupedByDate.map(([k]) => k);
  const todayKey = useMemo(() => {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const canonical = `${mm}.${dd}`; // 요일 없는 '정규 키'

    // 실제 keys 배열에서 요일 유무와 무관하게 매칭되는 '실제 키'를 찾음
    const found = keys.find((k) => stripDow(k) === canonical);
    // 찾으면 그걸 todayKey로, 없으면 첫 번째 키
    return found ?? keys[0] ?? '';
  }, [keys]);

  const getByDate = (key: string) => groupedByDate.find(([d]) => d === key)?.[1] ?? [];

  // ---------- shared date/week utilities (exported) ----------
  function startOfWeek(d: Date, weekStartsOn = 1) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = (day - weekStartsOn + 7) % 7;
    date.setDate(date.getDate() - diff);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  function endOfWeek(d: Date, weekStartsOn = 1) {
    const start = startOfWeek(d, weekStartsOn);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
  }

  function getWeekOfMonth(d: Date, weekStartsOn = 1) {
    const date = new Date(d);
    const month = date.getMonth();
    const firstOfMonth = new Date(date.getFullYear(), month, 1);
    const firstWeekStart = startOfWeek(firstOfMonth, weekStartsOn);
    const thisWeekStart = startOfWeek(date, weekStartsOn);
    const diffDays = Math.floor((thisWeekStart.getTime() - firstWeekStart.getTime()) / 86400000);
    return Math.floor(diffDays / 7) + 1;
  }

  function fmtMD(date: Date) {
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${m}.${d}`;
  }

  return {
    isLoading,
    error,
    refetch,
    groupedByDate,
    keys,
    todayKey,
    getByDate,
    startOfWeek,
    endOfWeek,
    fmtMD,
    getWeekOfMonth,
  };
}
