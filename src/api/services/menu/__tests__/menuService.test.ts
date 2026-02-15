import { extractMenuItems } from '../menuService';

describe('extractMenuItems', () => {
  it('配列レスポンスからメニューを抽出できる', () => {
    const result = extractMenuItems([
      { name: 'アプリケーション一覧', path: '/applications' },
      { name: 'アカウント一覧', path: '/accounts' },
    ]);

    expect(result).toEqual([
      { name: 'アプリケーション一覧', path: '/applications' },
      { name: 'アカウント一覧', path: '/accounts' },
    ]);
  });

  it('data配下の配列レスポンスからメニューを抽出できる', () => {
    const result = extractMenuItems({
      data: [
        { name: 'パスワード検索', path: '/passwords' },
        { name: '仮登録パスワード一覧', path: '/temp-passwords' },
      ],
    });

    expect(result).toEqual([
      { name: 'パスワード検索', path: '/passwords' },
      { name: '仮登録パスワード一覧', path: '/temp-passwords' },
    ]);
  });

  it('不正な要素は除外される', () => {
    const result = extractMenuItems([
      { name: '未登録パスワード一覧', path: '/unregisted-passwords' },
      { name: 'name only' },
      { path: '/accounts' },
      null,
    ]);

    expect(result).toEqual([
      { name: '未登録パスワード一覧', path: '/unregisted-passwords' },
    ]);
  });

  it('不正な入力では空配列を返す', () => {
    expect(extractMenuItems(null)).toEqual([]);
    expect(extractMenuItems(undefined)).toEqual([]);
    expect(extractMenuItems({})).toEqual([]);
    expect(extractMenuItems({ data: 'invalid' })).toEqual([]);
  });
});
