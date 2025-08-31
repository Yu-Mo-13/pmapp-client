import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NumberInput from '../NumberInput';

// Next.js Imageコンポーネントのモック
jest.mock('next/image', () => {
  return function MockImage({ 
    src, 
    alt, 
    width, 
    height 
  }: { 
    src: string; 
    alt: string; 
    width: number; 
    height: number; 
  }) {
    return (
      <div 
        data-testid="mock-image"
        data-src={src}
        data-alt={alt}
        data-width={width}
        data-height={height}
        role="img"
        aria-label={alt}
      />
    );
  };
});

describe('NumberInput', () => {
  describe('レンダリング', () => {
    it('基本的な要素が正しく表示される', () => {
      render(<NumberInput name="test" />);
      
      const input = screen.getByRole('spinbutton');
      const incrementButton = screen.getByRole('button', { name: '増加' });
      const decrementButton = screen.getByRole('button', { name: '減少' });
      
      expect(input).toBeInTheDocument();
      expect(incrementButton).toBeInTheDocument();
      expect(decrementButton).toBeInTheDocument();
    });

    it('デフォルト値が正しく表示される', () => {
      render(<NumberInput name="test" />);
      
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      expect(input.value).toBe('10');
    });

    it('カスタムデフォルト値が正しく表示される', () => {
      render(<NumberInput name="test" defaultValue={25} />);
      
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      expect(input.value).toBe('25');
    });

    it('適切なHTML属性が設定される', () => {
      render(<NumberInput name="quantity" min={5} step={2} />);
      
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      expect(input).toHaveAttribute('name', 'quantity');
      expect(input).toHaveAttribute('type', 'number');
      expect(input).toHaveAttribute('min', '5');
      expect(input).toHaveAttribute('step', '2');
    });
  });

  describe('増加ボタンの動作', () => {
    it('増加ボタンクリックで値が増加する', () => {
      render(<NumberInput name="test" defaultValue={10} step={1} />);
      
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      const incrementButton = screen.getByRole('button', { name: '増加' });
      
      fireEvent.click(incrementButton);
      expect(input.value).toBe('11');
    });

    it('カスタムステップで増加する', () => {
      render(<NumberInput name="test" defaultValue={10} step={5} />);
      
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      const incrementButton = screen.getByRole('button', { name: '増加' });
      
      fireEvent.click(incrementButton);
      expect(input.value).toBe('15');
    });

    it('複数回クリックで連続して増加する', () => {
      render(<NumberInput name="test" defaultValue={10} step={2} />);
      
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      const incrementButton = screen.getByRole('button', { name: '増加' });
      
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);
      
      expect(input.value).toBe('16');
    });
  });

  describe('減少ボタンの動作', () => {
    it('減少ボタンクリックで値が減少する', () => {
      render(<NumberInput name="test" defaultValue={10} step={1} />);
      
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      const decrementButton = screen.getByRole('button', { name: '減少' });
      
      fireEvent.click(decrementButton);
      expect(input.value).toBe('9');
    });

    it('カスタムステップで減少する', () => {
      render(<NumberInput name="test" defaultValue={20} step={3} />);
      
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      const decrementButton = screen.getByRole('button', { name: '減少' });
      
      fireEvent.click(decrementButton);
      expect(input.value).toBe('17');
    });

    it('最小値を下回らない', () => {
      render(<NumberInput name="test" defaultValue={5} min={5} step={1} />);
      
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      const decrementButton = screen.getByRole('button', { name: '減少' });
      
      fireEvent.click(decrementButton);
      expect(input.value).toBe('5');
    });

    it('カスタム最小値を下回らない', () => {
      render(<NumberInput name="test" defaultValue={10} min={8} step={3} />);
      
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      const decrementButton = screen.getByRole('button', { name: '減少' });
      
      fireEvent.click(decrementButton);
      expect(input.value).toBe('8');
    });
  });

  describe('直接入力の動作', () => {
    it('有効な数値を直接入力できる', () => {
      render(<NumberInput name="test" defaultValue={10} />);
      
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      
      fireEvent.change(input, { target: { value: '25' } });
      expect(input.value).toBe('25');
    });

    it('最小値以上の値のみ受け入れる', () => {
      render(<NumberInput name="test" defaultValue={10} min={5} />);
      
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      
      fireEvent.change(input, { target: { value: '3' } });
      expect(input.value).toBe('10'); // 変更されない
      
      fireEvent.change(input, { target: { value: '7' } });
      expect(input.value).toBe('7'); // 変更される
    });

    it('無効な値（NaN）は受け入れない', () => {
      render(<NumberInput name="test" defaultValue={10} />);
      
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      
      fireEvent.change(input, { target: { value: 'abc' } });
      expect(input.value).toBe('10'); // 変更されない
    });

    it('空文字列は受け入れない', () => {
      render(<NumberInput name="test" defaultValue={10} />);
      
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      
      fireEvent.change(input, { target: { value: '' } });
      expect(input.value).toBe('10'); // 変更されない
    });
  });

  describe('プロパティの組み合わせ', () => {
    it('全てのプロパティが正しく動作する', () => {
      render(
        <NumberInput 
          name="custom" 
          defaultValue={20} 
          min={10} 
          step={5} 
        />
      );
      
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      const incrementButton = screen.getByRole('button', { name: '増加' });
      const decrementButton = screen.getByRole('button', { name: '減少' });
      
      // 初期値確認
      expect(input.value).toBe('20');
      
      // 増加確認
      fireEvent.click(incrementButton);
      expect(input.value).toBe('25');
      
      // 減少確認
      fireEvent.click(decrementButton);
      fireEvent.click(decrementButton);
      fireEvent.click(decrementButton);
      expect(input.value).toBe('10'); // min値で停止
      
      // さらに減少を試行（最小値を下回らない）
      fireEvent.click(decrementButton);
      expect(input.value).toBe('10');
    });
  });

  describe('スタイリング', () => {
    it('適切なCSSクラスが適用される', () => {
      render(<NumberInput name="test" />);
      
      const input = screen.getByRole('spinbutton');
      const container = input.parentElement;
      
      expect(container).toHaveClass('relative', 'flex', 'items-center');
      expect(input).toHaveClass('px-4', 'py-2', 'border', 'text-black');
    });

    it('ボタンに適切なスタイルが適用される', () => {
      render(<NumberInput name="test" />);
      
      const incrementButton = screen.getByRole('button', { name: '増加' });
      const decrementButton = screen.getByRole('button', { name: '減少' });
      
      expect(incrementButton).toHaveClass('p-1', 'hover:bg-gray-100', 'rounded');
      expect(decrementButton).toHaveClass('p-1', 'hover:bg-gray-100', 'rounded');
    });
  });

  describe('アクセシビリティ', () => {
    it('適切なaria属性とroleが設定される', () => {
      render(<NumberInput name="test" />);
      
      const input = screen.getByRole('spinbutton');
      expect(input).toBeInTheDocument();
    });

    it('ボタンに適切なalt属性が設定される', () => {
      render(<NumberInput name="test" />);
      
      const incrementButton = screen.getByRole('button', { name: '増加' });
      const decrementButton = screen.getByRole('button', { name: '減少' });
      
      expect(incrementButton).toBeInTheDocument();
      expect(decrementButton).toBeInTheDocument();
    });
  });

  describe('Imageコンポーネントの統合', () => {
    it('増加・減少アイコンが正しく表示される', () => {
      render(<NumberInput name="test" />);
      
      const images = screen.getAllByTestId('mock-image');
      expect(images).toHaveLength(2);
      
      // aria-label属性の確認
      expect(screen.getByLabelText('増加')).toBeInTheDocument();
      expect(screen.getByLabelText('減少')).toBeInTheDocument();
    });
  });

  describe('フォーム統合', () => {
    it('name属性が正しく設定される', () => {
      render(<NumberInput name="quantity" />);
      
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('name', 'quantity');
    });

    it('値の変更がフォームデータに反映される', () => {
      const TestForm = () => (
        <form data-testid="test-form">
          <NumberInput name="amount" defaultValue={10} />
        </form>
      );
      
      render(<TestForm />);
      
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      const incrementButton = screen.getByRole('button', { name: '増加' });
      
      fireEvent.click(incrementButton);
      
      expect(input.value).toBe('11');
      expect(input.name).toBe('amount');
    });
  });

  describe('エッジケース', () => {
    it('デフォルト値が最小値未満の場合', () => {
      render(<NumberInput name="test" defaultValue={3} min={5} />);
      
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      expect(input.value).toBe('3'); // defaultValueがそのまま表示される
    });

    it('小数点を含む入力の処理', () => {
      render(<NumberInput name="test" defaultValue={10} />);
      
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      
      fireEvent.change(input, { target: { value: '15.7' } });
      expect(input.value).toBe('15'); // parseIntにより整数に変換
    });

    it('負の数値の入力', () => {
      render(<NumberInput name="test" defaultValue={10} min={1} />);
      
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      
      fireEvent.change(input, { target: { value: '-5' } });
      expect(input.value).toBe('10'); // 最小値未満なので変更されない
    });

    it('非常に大きな数値の入力', () => {
      render(<NumberInput name="test" defaultValue={10} />);
      
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      
      fireEvent.change(input, { target: { value: '999999' } });
      expect(input.value).toBe('999999');
    });
  });
});
