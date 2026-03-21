'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { apiClient } from '@/api';
import { AuthService } from '@/api/services/auth/authService';

const LOGIN_PATH = '/login';

const hasAuthTokenCookie = () => {
  if (typeof document === 'undefined') {
    return false;
  }

  return document.cookie
    .split(';')
    .map((value) => value.trim())
    .some((value) => value.startsWith('auth_token='));
};

const hasLocalStorageToken = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return Boolean(localStorage.getItem('auth_token'));
};

export default function AuthSessionGuard() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let ignore = false;

    const redirectToLogin = () => {
      if (ignore || pathname === LOGIN_PATH) {
        return;
      }

      router.replace(LOGIN_PATH);
    };

    const validateSession = async () => {
      if (pathname === LOGIN_PATH) {
        return;
      }

      const hasTokenInStorage = hasLocalStorageToken();
      const hasTokenInCookie = hasAuthTokenCookie();

      if (!hasTokenInStorage && !hasTokenInCookie) {
        redirectToLogin();
        return;
      }

      // 認証情報の保存先が片方だけ欠けた状態は破損セッションとして扱う。
      if (!hasTokenInStorage || !hasTokenInCookie) {
        apiClient.clearAuthToken();
        redirectToLogin();
        return;
      }

      const response = await AuthService.loginStatus();
      if (ignore || response.success) {
        return;
      }

      if (response.error?.status === 401 || response.error?.status === 403) {
        apiClient.clearAuthToken();
        redirectToLogin();
      }
    };

    const handleAuthTokenUpdated = () => {
      void validateSession();
    };

    void validateSession();
    window.addEventListener('auth-token-updated', handleAuthTokenUpdated);
    window.addEventListener('focus', handleAuthTokenUpdated);
    document.addEventListener('visibilitychange', handleAuthTokenUpdated);
    const intervalId = window.setInterval(() => {
      void validateSession();
    }, 1000);

    return () => {
      ignore = true;
      window.removeEventListener('auth-token-updated', handleAuthTokenUpdated);
      window.removeEventListener('focus', handleAuthTokenUpdated);
      document.removeEventListener('visibilitychange', handleAuthTokenUpdated);
      window.clearInterval(intervalId);
    };
  }, [pathname, router]);

  return null;
}
