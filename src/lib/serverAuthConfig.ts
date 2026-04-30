import 'server-only';

import { cookies } from 'next/headers';
import type { RequestConfig } from '@/api/types';

export async function getServerAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value ?? null;
}

export async function getServerAuthConfig(): Promise<RequestConfig> {
  const token = await getServerAuthToken();

  if (!token) {
    return {};
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}
