import type { AxiosError } from 'axios';
import type { ApiResponse } from '../types/api';
import type { AxiosErrorResponseData } from '../types/error';
import { toast } from 'react-hot-toast';

export function extractErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const response = error.response;
    const data = response?.data as AxiosErrorResponseData | undefined;

    if (data?.message) {
      return data.message;
    }

    if (data?.status) {
      return String(data.status);
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return fallback;
}

export function handleError(
  error: unknown,
  fallback: string = '알 수 없는 오류가 발생했습니다.',
  options: { logError?: boolean; showToast?: boolean } = {},
): void {
  const { logError = true, showToast = true } = options;
  const message = extractErrorMessage(error, fallback);

  if (logError && import.meta.env.DEV) {
    console.error('[Error Handler]', message, error);
  }

  if (showToast) {
    toast.error(message);
  }
}

export function getErrorMessage(error: unknown, fallback: string = '알 수 없는 오류'): string {
  return extractErrorMessage(error, fallback);
}

function isAxiosError(error: unknown): error is AxiosError<ApiResponse<unknown>> {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosError).isAxiosError === true
  );
}

export function handleErrorWithStatus(
  error: unknown,
  statusMessages: Record<number, string>,
  fallback: string = '알 수 없는 오류가 발생했습니다.',
): void {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    if (status && statusMessages[status]) {
      handleError(error, statusMessages[status]);
      return;
    }
  }

  handleError(error, fallback);
}
