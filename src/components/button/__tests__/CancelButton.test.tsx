import { render, screen } from '@testing-library/react';
import CancelButton from '../CancelButton';

describe('CancelButton', () => {
  describe('レンダリング', () => {
    it('キャンセルテキストが表示される', () => {
      render(<CancelButton to="/test" />);

      const link = screen.getByRole('link', { name: 'キャンセル' });
      expect(link).toBeInTheDocument();
    });

    it('適切なスタイリングが適用される', () => {
      render(<CancelButton to="/test" />);

      const link = screen.getByRole('link');
      expect(link).toHaveClass(
        'px-8',
        'py-3',
        'text-[18px]',
        'border',
        'border-gray-300',
        'text-gray-700',
        'rounded-md',
        'hover:bg-gray-50',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-gray-500',
        'focus:ring-offset-2',
        'transition-colors',
        'inline-block',
        'text-center'
      );
    });
  });

  describe('ナビゲーション', () => {
    it('指定されたパスへのリンクが設定される', () => {
      render(<CancelButton to="/applications" />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/applications');
    });

    it('ルートパスへのリンクが設定される', () => {
      render(<CancelButton to="/" />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/');
    });

    it('相対パスが正しく設定される', () => {
      render(<CancelButton to="../parent" />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '../parent');
    });

    it('クエリパラメータ付きパスが正しく設定される', () => {
      render(<CancelButton to="/search?q=test&page=1" />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/search?q=test&page=1');
    });
  });

  describe('アクセシビリティ', () => {
    it('リンクとして適切にアクセス可能', () => {
      render(<CancelButton to="/test" />);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAccessibleName('キャンセル');
    });

    it('フォーカス可能である', () => {
      render(<CancelButton to="/test" />);

      const link = screen.getByRole('link');
      link.focus();

      expect(link).toHaveFocus();
    });

    it('キーボードナビゲーションが可能', () => {
      render(<CancelButton to="/test" />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href');

      // Linkコンポーネントはデフォルトでキーボードアクセス可能
      expect(link.tagName.toLowerCase()).toBe('a');
    });
  });

  describe('プロパティバリデーション', () => {
    it('toプロパティが必須である', () => {
      // TypeScriptの型チェックでtoプロパティが必須であることを確認
      // この部分は実際にはコンパイル時にチェックされる
      render(<CancelButton to="/required-prop" />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/required-prop');
    });
  });

  describe('Next.js Link integration', () => {
    it('Next.js Linkコンポーネントとして動作する', () => {
      render(<CancelButton to="/next-link-test" />);

      const link = screen.getByRole('link');
      // Next.js Linkコンポーネントはaタグとしてレンダリングされる
      expect(link.tagName.toLowerCase()).toBe('a');
      expect(link).toHaveAttribute('href', '/next-link-test');
    });
  });

  describe('ユーザビリティ', () => {
    it('ボタンらしい見た目を持つ', () => {
      render(<CancelButton to="/test" />);

      const link = screen.getByRole('link');
      // ボタンらしいスタイリングの確認
      expect(link).toHaveClass('px-8', 'py-3', 'border', 'rounded-md');
      expect(link).toHaveClass('text-center', 'inline-block');
    });

    it('ホバー効果とフォーカス効果を持つ', () => {
      render(<CancelButton to="/test" />);

      const link = screen.getByRole('link');
      expect(link).toHaveClass('hover:bg-gray-50');
      expect(link).toHaveClass(
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-gray-500'
      );
    });

    it('適切なテキストサイズとパディングを持つ', () => {
      render(<CancelButton to="/test" />);

      const link = screen.getByRole('link');
      expect(link).toHaveClass('text-[18px]', 'px-8', 'py-3');
    });
  });
});
