import {
  extractTopPageUrl,
  extractUserRole,
  extractUserRoleFromToken,
} from '../authService';

describe('extractTopPageUrl', () => {
  it('top_page_url をそのまま返す', () => {
    expect(
      extractTopPageUrl({
        top_page_url: '/accounts',
      })
    ).toBe('/accounts');
  });

  it('data 配下にある top_page_url も取り出せる', () => {
    expect(
      extractTopPageUrl({
        data: {
          top_page_url: '/passwords',
        },
      })
    ).toBe('/passwords');
  });

  it('アプリ内パスでない値は無視する', () => {
    expect(
      extractTopPageUrl({
        top_page_url: 'https://example.com',
      })
    ).toBeNull();
  });
});

describe('extractUserRole', () => {
  it('role.code から管理者ロールを取り出せる', () => {
    expect(
      extractUserRole({
        role: {
          code: 'ADMIN',
        },
      })
    ).toBe('admin');
  });

  it('data 配下の role.code から WEB 一般ユーザーロールを取り出せる', () => {
    expect(
      extractUserRole({
        data: {
          role: {
            code: 'WEB_USER',
          },
        },
      })
    ).toBe('general');
  });

  it('トップページ URL からモバイルユーザーロールを補完できる', () => {
    expect(
      extractUserRole({
        top_page_url: '/temp-passwords',
      })
    ).toBe('mobile');
  });
});

describe('extractUserRoleFromToken', () => {
  it('JWT の payload からロールを取り出せる', () => {
    const payload = Buffer.from(
      JSON.stringify({ user: { role: { code: 'MOBILE_USER' } } })
    )
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
    const token = `header.${payload}.signature`;

    expect(extractUserRoleFromToken(token)).toBe('mobile');
  });
});
