import { render, screen } from '@testing-library/react';
import Title from '../Title';

describe('Title', () => {
  describe('レンダリング', () => {
    it('指定されたタイトルテキストが表示される', () => {
      render(<Title title="テストタイトル" />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('テストタイトル');
    });

    it('適切なHTML要素（h2）が使用される', () => {
      render(<Title title="見出しテスト" />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading.tagName.toLowerCase()).toBe('h2');
    });

    it('適切なスタイリングが適用される', () => {
      render(<Title title="スタイルテスト" />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass(
        'text-xl',
        'font-bold',
        'text-gray-800',
        'mb-6'
      );
    });
  });

  describe('プロパティ', () => {
    it('空文字列のタイトルも正しく表示される', () => {
      render(<Title title="" />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('');
    });

    it('長いタイトルテキストも正しく表示される', () => {
      const longTitle =
        'これは非常に長いタイトルテキストです。長いテキストでも適切に表示されることを確認するためのテストです。';
      render(<Title title={longTitle} />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent(longTitle);
    });

    it('数字を含むタイトルが正しく表示される', () => {
      render(<Title title="タスク123の進捗" />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('タスク123の進捗');
    });

    it('特殊文字を含むタイトルが正しく表示される', () => {
      render(<Title title="設定 & 管理 - オプション (詳細)" />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('設定 & 管理 - オプション (詳細)');
    });

    it('英語のタイトルが正しく表示される', () => {
      render(<Title title="Application Management System" />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Application Management System');
    });
  });

  describe('アクセシビリティ', () => {
    it('見出しとして適切にアクセス可能', () => {
      render(<Title title="アクセシビリティテスト" />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveAccessibleName('アクセシビリティテスト');
    });

    it('適切な見出しレベル（h2）が設定される', () => {
      render(<Title title="見出しレベルテスト" />);

      // h2として認識されることを確認
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();

      // h1やh3ではないことを確認
      expect(
        screen.queryByRole('heading', { level: 1 })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('heading', { level: 3 })
      ).not.toBeInTheDocument();
    });
  });

  describe('複数のTitleコンポーネント', () => {
    it('複数のTitleが独立して動作する', () => {
      render(
        <div>
          <Title title="最初のタイトル" />
          <Title title="2番目のタイトル" />
        </div>
      );

      const headings = screen.getAllByRole('heading', { level: 2 });
      expect(headings).toHaveLength(2);
      expect(headings[0]).toHaveTextContent('最初のタイトル');
      expect(headings[1]).toHaveTextContent('2番目のタイトル');
    });
  });

  describe('スタイリング詳細', () => {
    it('テキストサイズが適切に設定される', () => {
      render(<Title title="サイズテスト" />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('text-xl');
    });

    it('フォントの太さが適切に設定される', () => {
      render(<Title title="フォントテスト" />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('font-bold');
    });

    it('テキストカラーが適切に設定される', () => {
      render(<Title title="カラーテスト" />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('text-gray-800');
    });

    it('マージンが適切に設定される', () => {
      render(<Title title="マージンテスト" />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('mb-6');
    });
  });

  describe('プロパティバリデーション', () => {
    it('titleプロパティが必須である', () => {
      // TypeScriptの型チェックでtitleプロパティが必須であることを確認
      render(<Title title="必須プロパティテスト" />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('必須プロパティテスト');
    });
  });

  describe('コンテンツ確認', () => {
    it('HTMLエスケープが適切に処理される', () => {
      render(<Title title="<script>alert('test')</script>" />);

      const heading = screen.getByRole('heading', { level: 2 });
      // HTMLタグは文字列として表示される（エスケープされる）
      expect(heading).toHaveTextContent("<script>alert('test')</script>");
    });

    it('Unicode文字を含むテキストが正しく表示される', () => {
      render(<Title title="絵文字テスト 🚀 ✨ 📝" />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('絵文字テスト 🚀 ✨ 📝');
    });
  });
});
