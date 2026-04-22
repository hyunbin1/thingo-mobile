import type { GTMEvent } from '../types/gtm';

export function gtmPush(payload: GTMEvent): void {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  const isDev = import.meta.env.MODE !== 'production';
  window.dataLayer.push({
    ...payload,
    ...(payload.debug_mode === undefined ? { debug_mode: isDev } : {}),
  } as GTMEvent);
}
