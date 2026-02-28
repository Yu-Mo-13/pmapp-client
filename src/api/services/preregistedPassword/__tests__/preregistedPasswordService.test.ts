import {
  extractPreregistedPasswordIndexRows,
  extractPreregistedPasswordShow,
} from '../preregistedPasswordService';

describe('extractPreregistedPasswordIndexRows', () => {
  it('配列形式レスポンスから一覧を抽出できる', () => {
    const result = extractPreregistedPasswordIndexRows([
      {
        uuid: 'pre-123',
        created_at: '2026-02-28T10:00:00+09:00',
        application: { name: 'Amazon' },
        account: { name: 'user@example.com' },
      },
    ]);

    expect(result).toEqual([
      {
        uuid: 'pre-123',
        created_at: '2026-02-28T10:00:00+09:00',
        application_name: 'Amazon',
        account_name: 'user@example.com',
      },
    ]);
  });

  it('dataラップ形式レスポンスから一覧を抽出できる', () => {
    const result = extractPreregistedPasswordIndexRows({
      data: [
        {
          uuid: 'pre-456',
          created_at: '2026-02-28T11:00:00+09:00',
          application_name: 'GitHub',
          account_name: 'octocat',
        },
      ],
    });

    expect(result[0]).toEqual({
      uuid: 'pre-456',
      created_at: '2026-02-28T11:00:00+09:00',
      application_name: 'GitHub',
      account_name: 'octocat',
    });
  });

  it('必須値がないデータを除外する', () => {
    const result = extractPreregistedPasswordIndexRows([
      { created_at: '2026-02-28T11:00:00+09:00' },
      { uuid: 'pre-789' },
    ]);

    expect(result).toHaveLength(0);
  });
});

describe('extractPreregistedPasswordShow', () => {
  it('詳細レスポンスを抽出できる', () => {
    const result = extractPreregistedPasswordShow({
      data: {
        uuid: 'pre-show',
        password: 'secret',
        created_at: '2026-02-28T12:00:00+09:00',
        application: { id: 20, name: 'Notion' },
        account: { id: 200, name: 'admin' },
      },
    });

    expect(result).toEqual({
      uuid: 'pre-show',
      password: 'secret',
      application_id: 20,
      account_id: 200,
      created_at: '2026-02-28T12:00:00+09:00',
      application_name: 'Notion',
      account_name: 'admin',
    });
  });

  it('不正な形式の場合はnullを返す', () => {
    expect(extractPreregistedPasswordShow(null)).toBeNull();
    expect(extractPreregistedPasswordShow({ data: {} })).toBeNull();
  });
});
