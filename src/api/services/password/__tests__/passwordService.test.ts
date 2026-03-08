import { extractPasswordIndexRows } from '../passwordService';

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
