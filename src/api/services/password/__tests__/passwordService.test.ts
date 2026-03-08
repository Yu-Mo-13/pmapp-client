import apiClient from '@/api/client';
import { extractPasswordIndexRows, PasswordService } from '../passwordService';

describe('PasswordService.latest', () => {
  it('account_id ありで最新パスワード取得APIを呼び出せる', async () => {
    jest.spyOn(apiClient, 'get').mockResolvedValue({
      success: true,
      data: { password: 'secret' },
    });

    const response = await PasswordService.latest({
      application_id: 10,
      account_id: 20,
    });

    expect(response.success).toBe(true);
    expect(response.data).toEqual({ password: 'secret' });
    expect(apiClient.get).toHaveBeenCalledWith(
      '/passwords/latest?application_id=10&account_id=20',
      undefined
    );
  });

  it('account_id なしで最新パスワード取得APIを呼び出せる', async () => {
    jest.spyOn(apiClient, 'get').mockResolvedValue({
      success: true,
      data: { password: 'secret' },
    });

    const response = await PasswordService.latest({
      application_id: 10,
    });

    expect(response.success).toBe(true);
    expect(response.data).toEqual({ password: 'secret' });
    expect(apiClient.get).toHaveBeenCalledWith(
      '/passwords/latest?application_id=10',
      undefined
    );
  });
});

describe('extractPasswordIndexRows', () => {
  it('application/account ネスト構造を一覧表示用に整形できる', () => {
    const result = extractPasswordIndexRows({
      data: [
        {
          application: { id: 10, name: 'GitHub' },
          account: { id: 100, name: 'octocat' },
          updated_at: '2026-03-08T12:00:00+09:00',
        },
      ],
    });

    expect(result).toEqual([
      {
        application_id: 10,
        account_id: 100,
        latest_updated_at: '2026-03-08T12:00:00+09:00',
        application_name: 'GitHub',
        account_name: 'octocat',
      },
    ]);
  });

  it('account が null の場合はアカウントなしで整形する', () => {
    const result = extractPasswordIndexRows([
      {
        application: { id: 20, name: 'Slack' },
        account: null,
      },
    ]);

    expect(result).toEqual([
      {
        application_id: 20,
        account_id: null,
        latest_updated_at: '-',
        application_name: 'Slack',
        account_name: 'アカウントなし',
      },
    ]);
  });

  it('必須値が欠けたデータを除外する', () => {
    const result = extractPasswordIndexRows([
      { account: { id: 1, name: 'user' } },
      { application: { id: 30 } },
    ]);

    expect(result).toHaveLength(0);
  });
});
