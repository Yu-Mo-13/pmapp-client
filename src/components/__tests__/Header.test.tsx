import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Header from '../Header';
import { AuthService } from '@/api/services/auth/authService';
import { apiClient } from '@/api';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/passwords'),
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
}));

jest.mock('@/api', () => ({
  apiClient: {
    clearAuthToken: jest.fn(),
  },
}));

jest.mock('@/api/services/auth/authService', () => ({
  AuthService: {
    loginStatus: jest.fn(),
    logout: jest.fn(),
  },
  extractUserName: jest.fn((value: { name?: string }) => value.name ?? null),
  extractUserNameFromToken: jest.fn(() => null),
}));

describe('Header', () => {
  beforeEach(() => {
    const mockedLoginStatus = AuthService.loginStatus as jest.Mock;
    const mockedLogout = AuthService.logout as jest.Mock;
    const mockedClearAuthToken = apiClient.clearAuthToken as jest.Mock;

    mockPush.mockReset();
    mockedLoginStatus.mockReset();
    mockedLogout.mockReset();
    mockedClearAuthToken.mockReset();

    mockedLoginStatus.mockResolvedValue({
      success: true,
      data: { name: '本園 裕哉' },
    });
    mockedLogout.mockResolvedValue({ success: true });
  });

  it('モバイル用のメニュー開閉ボタンとログアウトアイコンを表示する', async () => {
    const onMobileMenuToggle = jest.fn();
    const getItemSpy = jest
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation((key: string) => {
        if (key === 'auth_token') {
          return 'header.test.token';
        }

        if (key === 'auth_user_name') {
          return '本園 裕哉';
        }

        return null;
      });

    render(
      <Header
        userName="本園 裕哉"
        isMobileMenuOpen={false}
        onMobileMenuToggle={onMobileMenuToggle}
      />
    );

    expect(screen.getByRole('button', { name: 'メニューを開く' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'ログアウト' })).toHaveLength(2);

    fireEvent.click(screen.getByRole('button', { name: 'メニューを開く' }));
    expect(onMobileMenuToggle).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getAllByRole('button', { name: 'ログアウト' })[1]);

    await waitFor(() => {
      expect(AuthService.logout).toHaveBeenCalledTimes(1);
      expect(apiClient.clearAuthToken).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith('/login');
    });

    getItemSpy.mockRestore();
  });
});
