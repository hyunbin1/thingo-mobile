import { useCallback } from 'react';
import { gtmPush } from '@/utils/gtm';

type TrackSearchSubmitPayload = {
  keyword: string;
  method: 'enter' | 'suggestion';
  search_source?: string;
  search_action?: 'submit' | 'suggestion_click';
};

export function useSearchTracking() {
  const getPagePath = () =>
    typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/';

  const trackSearchSubmit = useCallback((payload: TrackSearchSubmitPayload) => {
    const keyword = payload.keyword?.trim() ?? '';
    const pagePath = getPagePath();

    gtmPush({
      event: 'search_submit',
      page_path: pagePath,
      method: payload.method,
      keyword_length: keyword.length,
      search_source: payload.search_source ?? 'searchbar',
      search_action:
        payload.search_action ?? (payload.method === 'suggestion' ? 'suggestion_click' : 'submit'),
    });
  }, []);

  return { trackSearchSubmit };
}
