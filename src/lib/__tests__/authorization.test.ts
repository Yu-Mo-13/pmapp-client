import { notFound } from 'next/navigation';
import { authorizePageAccess, APP_USER_ROLES } from '../authorization';
import { AuthService } from '@/api/services/auth/authService';
import { getServerAuthConfig, getServerAuthToken } from '../serverAuthConfig';

jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
  redirect: jest.fn(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

jest.mock('@/api/services/auth/authService', () => ({
  AuthService: {
    loginStatus: jest.fn(),
  },
  extractUserRole: jest.fn((value: unknown) => {
    const roleCode = (value as { role?: { code?: string } | null } | undefined)?.role?.code;
    if (roleCode === 'ADMIN') {
      return 'admin';
    }
    if (roleCode === 'WEB_USER') {
      return 'general';
    }
    if (roleCode === 'MOBILE_USER') {
      return 'mobile';
    }
    return null;
  }),
}));

jest.mock('../serverAuthConfig', () => ({
  getServerAuthConfig: jest.fn(),
  getServerAuthToken: jest.fn(),
}));

describe('authorizePageAccess', () => {
  const mockLoginStatus =
    AuthService.loginStatus as jest.MockedFunction<typeof AuthService.loginStatus>;
  const mockGetServerAuthConfig =
    getServerAuthConfig as jest.MockedFunction<typeof getServerAuthConfig>;
  const mockGetServerAuthToken =
    getServerAuthToken as jest.MockedFunction<typeof getServerAuthToken>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetServerAuthConfig.mockResolvedValue({
      headers: {
        Authorization: 'Bearer token',
      },
    });
    mockGetServerAuthToken.mockResolvedValue('token');
  });

  it('認証トークンが無ければログインへ遷移する', async () => {
    mockGetServerAuthToken.mockResolvedValue(null);

    await expect(
      authorizePageAccess([APP_USER_ROLES.admin])
    ).rejects.toThrow('NEXT_REDIRECT');
  });

  it('許可ロールなら何もしない', async () => {
    mockLoginStatus.mockResolvedValue({
      success: true,
      data: { name: 'tester', role: { code: 'ADMIN' } },
    });

    await expect(
      authorizePageAccess([APP_USER_ROLES.admin])
    ).resolves.toBeUndefined();
  });

  it('未許可ロールなら 404 にする', async () => {
    mockLoginStatus.mockResolvedValue({
      success: true,
      data: { name: 'tester', role: { code: 'WEB_USER' } },
    });

    await expect(
      authorizePageAccess([APP_USER_ROLES.admin])
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });

  it('login status が 500 の場合も 404 にする', async () => {
    mockLoginStatus.mockResolvedValue({
      success: false,
      error: { message: 'server error', status: 500 },
    });

    await expect(
      authorizePageAccess([APP_USER_ROLES.admin])
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });

  it('許可されたモバイルロールなら通す', async () => {
    mockLoginStatus.mockResolvedValue({
      success: true,
      data: { name: 'tester', role: { code: 'MOBILE_USER' } },
    });

    await expect(
      authorizePageAccess([APP_USER_ROLES.mobile])
    ).resolves.toBeUndefined();
  });
});
