import { extractTopPageUrl, extractUserRole } from '../authService';

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

  it('WEB 一般ユーザーロールを取り出せる', () => {
    expect(
      extractUserRole({
        role: {
          code: 'WEB_USER',
        },
      })
    ).toBe('general');
  });

  it('未知の形式は null を返す', () => {
    expect(
      extractUserRole({
        role: null,
      })
    ).toBeNull();
  });
});
