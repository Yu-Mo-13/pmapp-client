import React from 'react';
import { Page } from '../page';
import { ApplicationService } from '@/api/services/application/applicationService';
import { extractUserRole } from '@/api/services/auth/authService';
import {
  PasswordService,
  extractPasswordIndexRows,
} from '@/api/services/password/passwordService';
import { guardApiResponse } from '@/app/_lib/responseGuard';
import { getServerAuthConfig } from '@/lib/serverAuthConfig';
import { AuthService } from '@/api/services/auth/authService';

jest.mock('../_components/PasswordList', () => {
  const MockPasswordList = (props: unknown) => <div {...(props as object)} />;

  MockPasswordList.displayName = 'MockPasswordList';

  return MockPasswordList;
});

jest.mock('@/api/services/application/applicationService', () => ({
  ApplicationService: {
    index: jest.fn(),
  },
}));

jest.mock('@/api/services/password/passwordService', () => ({
  PasswordService: {
    index: jest.fn(),
  },
  extractPasswordIndexRows: jest.fn(),
}));

jest.mock('@/app/_lib/responseGuard', () => ({
  guardApiResponse: jest.fn((value) => value),
}));

jest.mock('@/lib/serverAuthConfig', () => ({
  getServerAuthConfig: jest.fn(),
}));

jest.mock('@/api/services/auth/authService', () => ({
  AuthService: {
    loginStatus: jest.fn(),
  },
  extractUserRole: jest.fn((value: unknown) => {
    const roleCode = (value as { role?: { code?: string } | null } | undefined)?.role?.code;

    if (roleCode === 'MOBILE_USER') {
      return 'mobile';
    }

    if (roleCode === 'WEB_USER') {
      return 'general';
    }

    if (roleCode === 'ADMIN') {
      return 'admin';
    }

    return null;
  }),
}));

describe('passwords page', () => {
  const mockApplicationIndex =
    ApplicationService.index as jest.MockedFunction<typeof ApplicationService.index>;
  const mockExtractUserRole =
    extractUserRole as jest.MockedFunction<typeof extractUserRole>;
  const mockPasswordIndex =
    PasswordService.index as jest.MockedFunction<typeof PasswordService.index>;
  const mockExtractPasswordIndexRows =
    extractPasswordIndexRows as jest.MockedFunction<typeof extractPasswordIndexRows>;
  const mockGuardApiResponse =
    guardApiResponse as jest.MockedFunction<typeof guardApiResponse>;
  const mockGetServerAuthConfig =
    getServerAuthConfig as jest.MockedFunction<typeof getServerAuthConfig>;
  const mockLoginStatus =
    AuthService.loginStatus as jest.MockedFunction<typeof AuthService.loginStatus>;

  beforeEach(() => {
    mockApplicationIndex.mockResolvedValue({
      success: true,
      data: [],
    });
    mockPasswordIndex.mockResolvedValue({
      success: true,
      data: [],
    });
    mockExtractPasswordIndexRows.mockReturnValue([]);
    mockGuardApiResponse.mockImplementation((value) => value);
    mockGetServerAuthConfig.mockResolvedValue({
      headers: {
        Authorization: 'Bearer token',
      },
    });
    mockLoginStatus.mockResolvedValue({
      success: true,
      data: { name: 'tester', role: { code: 'WEB_USER' } },
    });
    mockExtractUserRole.mockReturnValue('general');
  });

  it('モバイルユーザーでは新規登録ボタンを非表示にする', async () => {
    mockLoginStatus.mockResolvedValue({
      success: true,
      data: { name: 'tester', role: { code: 'MOBILE_USER' } },
    });
    mockExtractUserRole.mockReturnValue('mobile');

    const result = await Page({
      searchParams: Promise.resolve({}),
    });

    expect(React.isValidElement(result)).toBe(true);
    expect(result.props).toEqual(
      expect.objectContaining({
        showCreateButton: false,
      })
    );
  });
});
