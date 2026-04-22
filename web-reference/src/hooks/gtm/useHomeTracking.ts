import { useCallback } from 'react';
import { gtmPush } from '@/utils/gtm';

type TrackHomeMainClickPayload = {
  item_name: string;
  item_label: string;
};

export function useHomeMainTracking() {
  const getPagePath = () =>
    typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/';

  const trackHomeMainClick = useCallback((payload: TrackHomeMainClickPayload) => {
    gtmPush({
      event: 'home_main_click',
      page_path: getPagePath(),
      item_name: payload.item_name,
      item_label: payload.item_label,
    });
  }, []);

  return { trackHomeMainClick };
}
