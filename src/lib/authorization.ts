import 'server-only';

import { notFound, redirect } from 'next/navigation';
import { AppUserRole, AuthService, extractUserRole } from '@/api/services/auth/authService';
import { getServerAuthConfig, getServerAuthToken } from './serverAuthConfig';

export const APP_USER_ROLES = {
  admin: 'admin',
  general: 'general',
  mobile: 'mobile',
} as const satisfies Record<string, AppUserRole>;

export async function authorizePageAccess(
  allowedRoles: readonly AppUserRole[]
): Promise<void> {
  const authToken = await getServerAuthToken();
  if (!authToken) {
    redirect('/login');
  }

  const authConfig = await getServerAuthConfig();
  const response = await AuthService.loginStatus(authConfig);
  if (!response.success) {
    const status = response.error?.status ?? 500;

    if (status === 401 || status === 403) {
      redirect('/login');
    }

    notFound();
  }

  const currentRole = extractUserRole(response.data);

  if (!currentRole || !allowedRoles.includes(currentRole)) {
    notFound();
  }
}
