import { extractTopPageUrl } from '../authService';

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
