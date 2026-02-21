// components/Header.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { apiClient } from '@/api';
import {
  AuthService,
  extractUserName,
  extractUserNameFromToken,
} from '@/api/services/auth/authService';
import { HeaderProps } from '@/types/header';

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const appName = process.env.APP_NAME || 'PMAPP';
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState(props.userName ?? 'ゲスト');

  useEffect(() => {
    let ignore = false;

    const refreshUserName = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        localStorage.removeItem('auth_user_name');
        setUserName('ゲスト');
        return;
      }

      const cachedUserName = localStorage.getItem('auth_user_name');
      if (cachedUserName) {
        setUserName(cachedUserName);
      }

      const tokenUserName = extractUserNameFromToken(token);
      if (tokenUserName) {
        localStorage.setItem('auth_user_name', tokenUserName);
        setUserName(tokenUserName);
      }

      const response = await AuthService.loginStatus();
      if (ignore) {
        return;
      }

      if (response.success) {
        const currentUserName = extractUserName(response.data);
        if (currentUserName) {
          localStorage.setItem('auth_user_name', currentUserName);
          setUserName(currentUserName);
          return;
        }
      }

      if (cachedUserName) {
        setUserName(cachedUserName);
        return;
      }

      setUserName('ゲスト');
    };

    const handleAuthTokenUpdated = () => {
      void refreshUserName();
    };

    void refreshUserName();
    window.addEventListener('auth-token-updated', handleAuthTokenUpdated);
    return () => {
      ignore = true;
      window.removeEventListener('auth-token-updated', handleAuthTokenUpdated);
    };
  }, [pathname]);

  const handleLogout = async () => {
    await AuthService.logout();
    apiClient.clearAuthToken();
    setUserName('ゲスト');
    router.push('/login');
  };

  return (
    <header
      className="text-white p-4 flex justify-between items-center w-full"
      style={{ backgroundColor: '#3E3E3E' }}
    >
      <h1 className="text-xl font-bold">{appName}</h1>
      <div className="flex items-center gap-3">
        <span className="text-xl">{userName}</span>
        {userName !== 'ゲスト' && (
          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-1 text-sm border border-white rounded hover:bg-white hover:text-[#3E3E3E] transition-colors"
          >
            ログアウト
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
