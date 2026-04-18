import 'server-only';

import { notFound, redirect } from 'next/navigation';
import {
  AppUserRole,
  AuthService,
  extractUserRole,
  extractUserRoleFromToken,
} from '@/api/services/auth/authService';
import { guardApiResponse } from '@/app/_lib/responseGuard';
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
  const response = guardApiResponse(await AuthService.loginStatus(authConfig));
  const currentRole =
    extractUserRole(response.data) ?? extractUserRoleFromToken(authToken ?? '');

  if (!currentRole || !allowedRoles.includes(currentRole)) {
    notFound();
  }
}
