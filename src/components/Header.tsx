// components/Header.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { apiClient } from '@/api';
import { AuthService } from '@/api/services/auth/authService';
import { HeaderProps } from '@/types/header';

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const appName = process.env.APP_NAME || 'PMAPP';
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState(props.userName ?? 'ゲスト');

  useEffect(() => {
    let ignore = false;

    const refreshUserName = async () => {
      const response = await AuthService.loginStatus();
      if (ignore) {
        return;
      }

      if (response.success && response.data?.name) {
        setUserName(response.data.name);
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
        <button
          type="button"
          onClick={handleLogout}
          className="px-3 py-1 text-sm border border-white rounded hover:bg-white hover:text-[#3E3E3E] transition-colors"
        >
          ログアウト
        </button>
      </div>
    </header>
  );
};

export default Header;
