import 'server-only';

import { cookies } from 'next/headers';
import type { RequestConfig } from '@/api/types';

export async function getServerAuthConfig(): Promise<RequestConfig> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return {};
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}
