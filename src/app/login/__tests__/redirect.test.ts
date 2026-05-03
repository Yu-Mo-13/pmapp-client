import { resolveLoginRedirectTarget } from '../redirect';

describe('resolveLoginRedirectTarget', () => {
  it('相対パスをそのまま返す', () => {
    expect(resolveLoginRedirectTarget('/passwords?tab=all')).toBe(
      '/passwords?tab=all'
    );
  });

  it('同一オリジンの絶対 URL をアプリ内パスへ変換する', () => {
    expect(
      resolveLoginRedirectTarget(
        'https://example.com/accounts/1?tab=detail#summary',
        'https://example.com'
      )
    ).toBe('/accounts/1?tab=detail#summary');
  });

  it('外部オリジンの絶対 URL は拒否する', () => {
    expect(
      resolveLoginRedirectTarget(
        'https://evil.example.com/passwords',
        'https://example.com'
      )
    ).toBeNull();
  });

  it('スキーマ相対 URL は拒否する', () => {
    expect(resolveLoginRedirectTarget('//evil.example.com/passwords')).toBeNull();
  });

  it('空文字や不正な値は拒否する', () => {
    expect(resolveLoginRedirectTarget('')).toBeNull();
    expect(resolveLoginRedirectTarget('   ')).toBeNull();
    expect(resolveLoginRedirectTarget('javascript:alert(1)')).toBeNull();
    expect(resolveLoginRedirectTarget('passwords')).toBeNull();
  });
});
