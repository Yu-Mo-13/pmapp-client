import { render, screen } from '@testing-library/react';
import Page from '../page';
import {
  extractPreregistedPasswordTarget,
  PreregistedPasswordService,
} from '@/api/services/preregistedPassword/preregistedPasswordService';
import { guardApiResponse } from '@/app/_lib/responseGuard';
import { getServerAuthConfig } from '@/lib/serverAuthConfig';

jest.mock('../_components/PreregistedPasswordCreateView', () => {
  return function MockPreregistedPasswordCreateView() {
    return <div>create-view</div>;
  };
});

jest.mock('@/api/services/preregistedPassword/preregistedPasswordService', () => ({
  PreregistedPasswordService: {
    target: jest.fn(),
  },
  extractPreregistedPasswordTarget: jest.fn(),
}));

jest.mock('@/app/_lib/responseGuard', () => ({
  guardApiResponse: jest.fn((value) => value),
}));

jest.mock('@/lib/serverAuthConfig', () => ({
  getServerAuthConfig: jest.fn(),
}));

describe('temp password create page', () => {
  const mockTarget =
    PreregistedPasswordService.target as jest.MockedFunction<
      typeof PreregistedPasswordService.target
    >;
  const mockExtract =
    extractPreregistedPasswordTarget as jest.MockedFunction<
      typeof extractPreregistedPasswordTarget
    >;
  const mockGuard = guardApiResponse as jest.MockedFunction<typeof guardApiResponse>;
  const mockGetServerAuthConfig =
    getServerAuthConfig as jest.MockedFunction<typeof getServerAuthConfig>;

  beforeEach(() => {
    mockTarget.mockResolvedValue({
      success: true,
      data: {},
    });
    mockExtract.mockReturnValue({
      application: {
        id: 1,
        name: 'GitHub',
      },
      account: {
        id: 2,
        name: 'octocat',
      },
    });
    mockGuard.mockImplementation((value) => value);
    mockGetServerAuthConfig.mockResolvedValue({
      headers: {
        Authorization: 'Bearer token',
      },
    });
  });

  it('モバイル向けの余白クラスでページを表示する', async () => {
    render(
      await Page({
        searchParams: Promise.resolve({
          application_id: '1',
          account_id: '2',
        }),
      })
    );

    expect(screen.getByRole('main')).toHaveClass('flex-1', 'p-4', 'md:p-6');
  });

  it('検索パラメータを使って対象情報を取得する', async () => {
    await Page({
      searchParams: Promise.resolve({
        application_id: '10',
        account_id: '20',
      }),
    });

    expect(mockTarget).toHaveBeenCalledWith(
      '10',
      '20',
      expect.objectContaining({
        headers: {
          Authorization: 'Bearer token',
        },
      })
    );
  });
});
