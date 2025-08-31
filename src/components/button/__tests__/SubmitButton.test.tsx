import { render, screen, fireEvent } from '@testing-library/react';
import SubmitButton from '../SubmitButton';
import '@testing-library/jest-dom';

describe('SubmitButton', () => {
  describe('レンダリング', () => {
    it('指定されたテキストが表示される', () => {
      render(<SubmitButton text="保存" />);

      const button = screen.getByRole('button', { name: '保存' });
      expect(button).toBeInTheDocument();
    });

    it('適切なスタイリングが適用される', () => {
      render(<SubmitButton text="送信" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'text-white',
        'w-36',
        'px-6',
        'py-3',
        'rounded',
        'bg-[#3CB371]',
        'text-[18px]',
        'font-medium',
        'hover:opacity-80',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-green-500',
        'focus:ring-offset-2',
        'transition-opacity',
        'duration-200'
      );
    });
  });

  describe('typeプロパティ', () => {
    it('isSubmitがtrueの場合、type="submit"になる', () => {
      render(<SubmitButton text="送信" isSubmit={true} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('isSubmitがfalseの場合、type="button"になる', () => {
      render(<SubmitButton text="送信" isSubmit={false} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('isSubmitが未指定の場合、type="button"になる', () => {
      render(<SubmitButton text="送信" />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('クリックイベント', () => {
    it('onClickが提供されている場合、クリック時に呼び出される', () => {
      const mockOnClick = jest.fn();
      render(<SubmitButton text="クリック" onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('onClickが提供されていない場合、クリックしてもエラーにならない', () => {
      render(<SubmitButton text="クリック" />);

      const button = screen.getByRole('button');

      expect(() => {
        fireEvent.click(button);
      }).not.toThrow();
    });

    it('複数回クリックした場合、onClickが複数回呼び出される', () => {
      const mockOnClick = jest.fn();
      render(<SubmitButton text="クリック" onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('プロパティの組み合わせ', () => {
    it('すべてのプロパティが正しく適用される', () => {
      const mockOnClick = jest.fn();
      render(
        <SubmitButton text="完了" isSubmit={true} onClick={mockOnClick} />
      );

      const button = screen.getByRole('button', { name: '完了' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'submit');

      fireEvent.click(button);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('アクセシビリティ', () => {
    it('ボタンとして適切にアクセス可能', () => {
      render(<SubmitButton text="送信" />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAccessibleName('送信');
    });

    it('フォーカス可能である', () => {
      render(<SubmitButton text="送信" />);

      const button = screen.getByRole('button');
      button.focus();

      expect(button).toHaveFocus();
    });
  });
});
