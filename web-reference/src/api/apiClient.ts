import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { accessTokenStore } from './token';
import { getCookie } from '@/utils/cookie';
import { XSRF_COOKIE_NAME, XSRF_HEADER_NAME, HAS_SESSION_KEY } from '@/constants/auth';

type Pending = {
  resolve: (v: unknown) => void;
  reject: (r?: unknown) => void;
  config: InternalAxiosRequestConfig;
};

let isRefreshing = false;
const queue: Pending[] = [];

/** 대기 중인 요청 큐 처리 */
const flushQueue = (error: unknown, newToken?: string) => {
  while (queue.length) {
    const { resolve, reject, config } = queue.shift()!;
    if (error) {
      reject(error);
    } else {
      if (newToken) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${newToken}`;
      }
      resolve(apiClient(config));
    }
  }
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  withCredentials: true,
  xsrfCookieName: XSRF_COOKIE_NAME,
  xsrfHeaderName: XSRF_HEADER_NAME,
});

/** 요청 인터셉터 */
apiClient.interceptors.request.use((config) => {
  const at = accessTokenStore.get();
  config.headers = config.headers ?? {};

  const isReissue = (config.url ?? '').includes('/auth/reissue');
  if (at && !isReissue) {
    config.headers.Authorization = `Bearer ${at}`;
  }

  const xsrf = getCookie(XSRF_COOKIE_NAME);
  if (xsrf) config.headers[XSRF_HEADER_NAME] = xsrf;

  return config;
});

/** 재발급 */
const reissueAccessToken = async (): Promise<string> => {
  const xsrf = getCookie(XSRF_COOKIE_NAME);
  const { data } = await apiClient.post(
    '/auth/reissue',
    {},
    {
      headers: {
        ...(xsrf ? { [XSRF_HEADER_NAME]: xsrf } : {}),
        Authorization: '',
      },
    },
  );
  const newAT: string | undefined = data?.data?.accessToken ?? data?.accessToken;
  if (!newAT) throw new Error('No access token from reissue');
  accessTokenStore.set(newAT);
  return newAT;
};

/** 응답 인터셉터: 401/403 시 토큰 재발급 */
apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const url = original?.url ?? '';

    if (
      (status === 401 || status === 403) &&
      (url.includes('/auth/login') || url.includes('/auth/reissue'))
    ) {
      return Promise.reject(error);
    }

    const hadAuthHeader = !!original?.headers?.Authorization;

    if ((status === 401 || status === 403) && !original._retry && hadAuthHeader) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject, config: original });
        });
      }

      isRefreshing = true;
      try {
        const newAT = await reissueAccessToken();
        flushQueue(null, newAT);
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newAT}`;
        return apiClient(original);
      } catch (e) {
        accessTokenStore.clear();
        localStorage.removeItem(HAS_SESSION_KEY);
        flushQueue(e);
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
