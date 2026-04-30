import React from 'react';
import { render, screen } from '@testing-library/react';
import Page from '../page';
import {
  extractPreregistedPasswordShow,
  PreregistedPasswordService,
} from '@/api/services/preregistedPassword/preregistedPasswordService';
import { guardApiResponse } from '@/app/_lib/responseGuard';
import { getServerAuthConfig } from '@/lib/serverAuthConfig';

jest.mock('../_components/PreregistedPasswordDetailView', () => {
  const react = require('react');

  return function MockPreregistedPasswordDetailView() {
    return react.createElement('div', null, 'detail-view');
  };
});

jest.mock('@/api/services/preregistedPassword/preregistedPasswordService', () => ({
  PreregistedPasswordService: {
    show: jest.fn(),
  },
  extractPreregistedPasswordShow: jest.fn(),
}));

jest.mock('@/app/_lib/responseGuard', () => ({
  guardApiResponse: jest.fn((value) => value),
}));

jest.mock('@/lib/serverAuthConfig', () => ({
  getServerAuthConfig: jest.fn(),
}));

describe('temp password detail page', () => {
  const mockShow =
    PreregistedPasswordService.show as jest.MockedFunction<
      typeof PreregistedPasswordService.show
    >;
  const mockExtract =
    extractPreregistedPasswordShow as jest.MockedFunction<
      typeof extractPreregistedPasswordShow
    >;
  const mockGuard = guardApiResponse as jest.MockedFunction<typeof guardApiResponse>;
  const mockGetServerAuthConfig =
    getServerAuthConfig as jest.MockedFunction<typeof getServerAuthConfig>;

  beforeEach(() => {
    mockShow.mockResolvedValue({
      success: true,
      data: {},
    });
    mockExtract.mockReturnValue({
      uuid: 'pre-uuid',
      password: 'secret',
      application_id: 1,
      account_id: 2,
      created_at: '2026-02-28T12:00:00+09:00',
      application_name: 'GitHub',
      account_name: 'octocat',
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
        params: Promise.resolve({ uuid: 'pre-uuid' }),
      })
    );

    expect(screen.getByRole('main')).toHaveClass('flex-1', 'p-4', 'md:p-6');
  });
});
