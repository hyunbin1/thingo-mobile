import { useCallback, useEffect, useRef } from 'react';
import { gtmPush } from '../../utils/gtm';

type Options = {
  method?: string; // 기본 'email'
  pagePath?: string; // 필요 시 외부에서 override
};

type DoneState = null | 'success';

export function useRegisterTracking(options: Options = {}) {
  const startedRef = useRef(false);
  const doneRef = useRef<DoneState>(null);

  const method = options.method ?? 'email';
  const pagePath =
    options.pagePath ??
    (typeof window !== 'undefined'
      ? window.location.pathname + window.location.search
      : '/register');

  /** 어떤 액션이든 회원가입 플로우가 시작됐음을 1회 기록 */
  const ensureStarted = useCallback(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      gtmPush({ event: 'sign_up_start', page_path: pagePath });
    }
  }, [pagePath]);

  /** 유효성 통과 후 실제 submit 시도(1회든 여러 번이든) */
  const trackSubmit = useCallback(() => {
    ensureStarted();
    gtmPush({ event: 'sign_up_submit', page_path: pagePath });
  }, [ensureStarted, pagePath]);

  /** 회원가입 성공 */
  const trackSuccess = useCallback(() => {
    doneRef.current = 'success';
    gtmPush({ event: 'sign_up', method });
  }, [method]);

  /** 중도 이탈(StrictMode 방어 + started && not success) */
  const strictGuardRef = useRef(true);
  useEffect(() => {
    return () => {
      // 개발 StrictMode: 첫 cleanup은 스킵
      if (strictGuardRef.current) {
        strictGuardRef.current = false;
        return;
      }

      if (startedRef.current && doneRef.current === null) {
        gtmPush({ event: 'sign_up_abort', page_path: pagePath });
      }
    };
     
  }, [pagePath]);

  return { ensureStarted, trackSubmit, trackSuccess };
}
