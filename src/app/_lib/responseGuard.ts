import { notFound, redirect } from 'next/navigation';
import type { ApiResponse } from '@/api/types';

type ResponseGuardOptions = {
  allowStatuses?: number[];
};

const LOGIN_PATH = '/login';

export function guardApiResponse<T>(
  response: ApiResponse<T>,
  options?: ResponseGuardOptions
): ApiResponse<T> {
  if (response.success) {
    return response;
  }

  const status = response.error?.status ?? 500;
  const allowStatuses = options?.allowStatuses ?? [];

  if (allowStatuses.includes(status)) {
    return response;
  }

  if (status === 401 || status === 403) {
    redirect(LOGIN_PATH);
  }

  if (status === 404) {
    notFound();
  }

  throw new Error(
    status >= 500
      ? 'システムに異常が発生しています。'
      : response.error?.message ?? 'リクエストの処理に失敗しました。'
  );
}
