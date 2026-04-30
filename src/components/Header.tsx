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
      className="text-white flex justify-between items-center w-full px-4 py-3 md:p-4"
      style={{ backgroundColor: '#3E3E3E' }}
    >
      <div className="flex items-center gap-3">
        {props.onMobileMenuToggle && (
          <button
            type="button"
            onClick={props.onMobileMenuToggle}
            className="flex h-8 w-8 items-center justify-center rounded md:hidden"
            aria-label={
              props.isMobileMenuOpen
                ? 'メニューを閉じる'
                : 'メニューを開く'
            }
            aria-expanded={props.isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 18V16H21V18H3ZM3 13V11H21V13H3ZM3 8V6H21V8H3Z" fill="white" />
            </svg>
          </button>
        )}
        <h1 className="text-xl font-bold">{appName}</h1>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xl">{userName}</span>
        {userName !== 'ゲスト' && (
          <>
            <button
              type="button"
              onClick={handleLogout}
              className="hidden px-3 py-1 text-sm border border-white rounded hover:bg-white hover:text-[#3E3E3E] transition-colors md:inline-flex"
            >
              ログアウト
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex h-8 w-8 -mr-[5px] items-center justify-center rounded md:hidden"
              aria-label="ログアウト"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 21C4.45 21 3.97917 20.8042 3.5875 20.4125C3.19583 20.0208 3 19.55 3 19V5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3H12V5H5V19H12V21H5ZM16 17L14.625 15.55L17.175 13H9V11H17.175L14.625 8.45L16 7L21 12L16 17Z"
                  fill="white"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
