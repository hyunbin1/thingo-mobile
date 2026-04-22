import { trySession } from '@/api/user';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * 앱이 시작될 때 자동 로그인 상태를 복원합니다.
 * - trySession()을 호출하여 refreshToken 기반 accessToken 재발급을 시도합니다.
 * - 성공 시, 로그인 상태로 전환하고 사용자 정보 저장
 * - 실패 시, 로그인 상태 초기화 (reset())
 */
export const initAuth = async () => {
  const me = await trySession();
  const { setLoggedIn, setUser, resetUser } = useAuthStore.getState();
  if (me) {
    setLoggedIn(true);
    setUser(me);
  } else {
    resetUser();
  }
};
