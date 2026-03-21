import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { usePathname, useRouter } from 'next/navigation';
import AuthSessionGuard from '../AuthSessionGuard';
import { AuthService } from '@/api/services/auth/authService';
import { apiClient } from '@/api';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('@/api/services/auth/authService', () => ({
  AuthService: {
    loginStatus: jest.fn(),
  },
}));

jest.mock('@/api', () => ({
  apiClient: {
    clearAuthToken: jest.fn(),
  },
}));

describe('AuthSessionGuard', () => {
  const mockReplace = jest.fn();
  const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
  const mockLoginStatus =
    AuthService.loginStatus as jest.MockedFunction<typeof AuthService.loginStatus>;
  const mockClearAuthToken = apiClient.clearAuthToken as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    document.cookie =
      'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';

    mockUsePathname.mockReturnValue('/passwords');
    mockUseRouter.mockReturnValue({
      replace: mockReplace,
      push: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    } as ReturnType<typeof useRouter>);

    mockLoginStatus.mockResolvedValue({
      success: true,
      data: { name: 'tester' },
    });
  });

  it('認証情報が無ければログインへ遷移する', async () => {
    render(<AuthSessionGuard />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/login');
    });
  });

  it('認証トークンがあれば遷移しない', async () => {
    localStorage.setItem('auth_token', 'token');
    document.cookie = 'auth_token=token; Path=/; SameSite=Lax';

    render(<AuthSessionGuard />);

    await waitFor(() => {
      expect(mockReplace).not.toHaveBeenCalled();
    });
  });

  it('期限切れなら認証情報を消してログインへ遷移する', async () => {
    localStorage.setItem('auth_token', 'expired');
    document.cookie = 'auth_token=expired; Path=/; SameSite=Lax';
    mockLoginStatus.mockResolvedValue({
      success: false,
      error: { message: 'unauthorized', status: 401 },
    });

    render(<AuthSessionGuard />);

    await waitFor(() => {
      expect(mockClearAuthToken).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith('/login');
    });
  });

  it('トークン消去イベントでログインへ遷移する', async () => {
    localStorage.setItem('auth_token', 'token');
    document.cookie = 'auth_token=token; Path=/; SameSite=Lax';

    render(<AuthSessionGuard />);

    localStorage.removeItem('auth_token');
    window.dispatchEvent(new Event('auth-token-updated'));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/login');
    });
  });

  it('保存先が片方だけ欠けたらログインへ遷移する', async () => {
    localStorage.setItem('auth_token', 'token');

    render(<AuthSessionGuard />);

    await waitFor(() => {
      expect(mockClearAuthToken).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith('/login');
    });
  });
});
