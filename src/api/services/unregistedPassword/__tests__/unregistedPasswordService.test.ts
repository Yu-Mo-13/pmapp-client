import {
  extractUnregistedPasswordIndexRows,
  extractUnregistedPasswordShow,
} from '../unregistedPasswordService';

describe('extractUnregistedPasswordIndexRows', () => {
  it('配列形式レスポンスから一覧を抽出できる', () => {
    const result = extractUnregistedPasswordIndexRows([
      {
        uuid: 'abc-123',
        created_at: '2026-02-27T12:00:00+09:00',
        application: { name: 'Amazon' },
        account: { name: 'user@example.com' },
      },
    ]);

    expect(result).toEqual([
      {
        uuid: 'abc-123',
        created_at: '2026-02-27T12:00:00+09:00',
        application_name: 'Amazon',
        account_name: 'user@example.com',
      },
    ]);
  });

  it('dataラップ形式レスポンスから一覧を抽出できる', () => {
    const result = extractUnregistedPasswordIndexRows({
      data: [
        {
          uuid: 'abc-456',
          created_at: '2026-02-27T13:00:00+09:00',
          application_name: 'GitHub',
          account_name: 'octocat',
        },
      ],
    });

    expect(result[0]).toEqual({
      uuid: 'abc-456',
      created_at: '2026-02-27T13:00:00+09:00',
      application_name: 'GitHub',
      account_name: 'octocat',
    });
  });

  it('必須値がないデータを除外する', () => {
    const result = extractUnregistedPasswordIndexRows([
      {
        created_at: '2026-02-27T12:00:00+09:00',
      },
      {
        uuid: 'abc-789',
      },
    ]);

    expect(result).toHaveLength(0);
  });
});

describe('extractUnregistedPasswordShow', () => {
  it('詳細レスポンスを抽出できる', () => {
    const result = extractUnregistedPasswordShow({
      data: {
        uuid: 'abc-show',
        password: 'secret',
        created_at: '2026-02-27T14:00:00+09:00',
        application: { name: 'Notion' },
        account: { name: 'admin' },
      },
    });

    expect(result).toEqual({
      uuid: 'abc-show',
      password: 'secret',
      decrypted_password: undefined,
      created_at: '2026-02-27T14:00:00+09:00',
      application_name: 'Notion',
      account_name: 'admin',
    });
  });

  it('不正な形式の場合はnullを返す', () => {
    expect(extractUnregistedPasswordShow(null)).toBeNull();
    expect(extractUnregistedPasswordShow({ data: {} })).toBeNull();
  });
});
