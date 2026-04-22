import type { GTMEvent } from './gtm';

declare global {
  interface Window {
    dataLayer?: GTMEvent[];
  }
}
export {};
