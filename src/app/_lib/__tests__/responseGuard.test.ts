import { guardApiResponse } from '../responseGuard';
import type { ApiResponse } from '@/api/types';
import { notFound, redirect } from 'next/navigation';

jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
  redirect: jest.fn(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

describe('guardApiResponse', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('成功レスポンスはそのまま返す', () => {
    const response: ApiResponse<{ id: number }> = {
      success: true,
      data: { id: 1 },
    };

    expect(guardApiResponse(response)).toBe(response);
  });

  it('401 はログインへリダイレクトする', () => {
    const response: ApiResponse = {
      success: false,
      error: { message: 'unauthorized', status: 401 },
    };

    expect(() => guardApiResponse(response)).toThrow('NEXT_REDIRECT');
    expect(redirect).toHaveBeenCalledWith('/login');
  });

  it('404 は notFound に委譲する', () => {
    const response: ApiResponse = {
      success: false,
      error: { message: 'not found', status: 404 },
    };

    expect(() => guardApiResponse(response)).toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });

  it('許可したステータスは画面へ返す', () => {
    const response: ApiResponse = {
      success: false,
      error: { message: 'validation error', status: 422 },
    };

    expect(guardApiResponse(response, { allowStatuses: [422] })).toBe(response);
  });

  it('500 は共通メッセージで例外化する', () => {
    const response: ApiResponse = {
      success: false,
      error: { message: 'internal server error', status: 500 },
    };

    expect(() => guardApiResponse(response)).toThrow(
      'システムに異常が発生しています。'
    );
  });
});
