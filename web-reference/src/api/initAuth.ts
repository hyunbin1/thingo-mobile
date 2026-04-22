import { trySession } from '@/api/user';
import { useAuthStore } from '@/store/useAuthStore';
import { AxiosError } from 'axios';
import { getCookie } from '@/utils/cookie';
import { XSRF_COOKIE_NAME, HAS_SESSION_KEY } from '@/constants/auth';

interface ErrorResponse {
  status: number;
  error: string;
  message: string;
}

export const initAuth = async (): Promise<void> => {
  try {
    const hasSessionHint = localStorage.getItem(HAS_SESSION_KEY) === '1';
    const hasXsrf = !!getCookie(XSRF_COOKIE_NAME);

    if (!hasSessionHint && !hasXsrf) {
      useAuthStore.getState().resetUser();
      return;
    }

    const me = await trySession();
    const { setLoggedIn, setUser, resetUser } = useAuthStore.getState();

    if (me) {
      setLoggedIn(true);
      setUser(me);
      localStorage.setItem(HAS_SESSION_KEY, '1');
    } else {
      resetUser();
      localStorage.removeItem(HAS_SESSION_KEY);
    }
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    const status = axiosError.response?.status;

    if (status && status !== 400) {
      console.error(
        `[initAuth] Unexpected error (${status}):`,
        axiosError.response?.data?.message ?? axiosError.message,
      );
    }

    useAuthStore.getState().resetUser();
    localStorage.removeItem(HAS_SESSION_KEY);
  }
};
