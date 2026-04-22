import { gtmPush } from '@/utils/gtm';
import type { NavGroup } from '@/types/gtm';

export function useNavTracking() {
  const getPagePath = () =>
    typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/';

  const trackNavClick = (payload: {
    item_name: string;
    item_label: string;
    nav_group: NavGroup;
  }) => {
    gtmPush({
      event: 'nav_click',
      item_name: payload.item_name,
      item_label: payload.item_label,
      nav_group: payload.nav_group,
      page_path: getPagePath(),
    });
  };

  return { trackNavClick };
}
