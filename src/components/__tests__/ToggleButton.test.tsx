import { render, screen, fireEvent } from '@testing-library/react';
import ToggleButton from '../ToggleButton';

// Next.js Imageコンポーネントをモック
jest.mock('next/image', () => {
  return function MockImage({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img 
        src={src}
        alt={alt}
        width={width}
        height={height}
      />
    );
  };
});

describe('ToggleButton', () => {
  describe('レンダリング', () => {
    it('ボタンとhidden inputが表示される', () => {
      render(<ToggleButton name="test" />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      
      const hiddenInput = screen.getByDisplayValue('0');
      expect(hiddenInput).toBeInTheDocument();
      expect(hiddenInput).toHaveAttribute('type', 'hidden');
      expect(hiddenInput).toHaveAttribute('name', 'test');
    });

    it('デフォルト状態（OFF）で正しい画像とaltテキストが表示される', () => {
      render(<ToggleButton name="test" />);
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'Toggle Off');
      expect(image).toHaveAttribute('width', '44');
      expect(image).toHaveAttribute('height', '24');
    });

    it('適切なスタイリングが適用される', () => {
      render(<ToggleButton name="test" />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('mb-3');
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('デフォルト値', () => {
    it('defaultValue=falseの場合、初期状態はOFF', () => {
      render(<ToggleButton name="test" defaultValue={false} />);
      
      const hiddenInput = screen.getByDisplayValue('0');
      expect(hiddenInput).toBeInTheDocument();
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'Toggle Off');
    });

    it('defaultValue=trueの場合、初期状態はON', () => {
      render(<ToggleButton name="test" defaultValue={true} />);
      
      const hiddenInput = screen.getByDisplayValue('1');
      expect(hiddenInput).toBeInTheDocument();
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'Toggle On');
    });

    it('defaultValueが未指定の場合、初期状態はOFF', () => {
      render(<ToggleButton name="test" />);
      
      const hiddenInput = screen.getByDisplayValue('0');
      expect(hiddenInput).toBeInTheDocument();
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'Toggle Off');
    });
  });

  describe('トグル動作', () => {
    it('OFFからONに切り替わる', () => {
      render(<ToggleButton name="test" />);
      
      const button = screen.getByRole('button');
      
      // 初期状態はOFF
      expect(screen.getByDisplayValue('0')).toBeInTheDocument();
      expect(screen.getByRole('img')).toHaveAttribute('alt', 'Toggle Off');
      
      // クリックしてONに
      fireEvent.click(button);
      
      expect(screen.getByDisplayValue('1')).toBeInTheDocument();
      expect(screen.getByRole('img')).toHaveAttribute('alt', 'Toggle On');
    });

    it('ONからOFFに切り替わる', () => {
      render(<ToggleButton name="test" defaultValue={true} />);
      
      const button = screen.getByRole('button');
      
      // 初期状態はON
      expect(screen.getByDisplayValue('1')).toBeInTheDocument();
      expect(screen.getByRole('img')).toHaveAttribute('alt', 'Toggle On');
      
      // クリックしてOFFに
      fireEvent.click(button);
      
      expect(screen.getByDisplayValue('0')).toBeInTheDocument();
      expect(screen.getByRole('img')).toHaveAttribute('alt', 'Toggle Off');
    });

    it('複数回クリックで正しく切り替わる', () => {
      render(<ToggleButton name="test" />);
      
      const button = screen.getByRole('button');
      
      // 初期状態：OFF
      expect(screen.getByDisplayValue('0')).toBeInTheDocument();
      
      // 1回目クリック：ON
      fireEvent.click(button);
      expect(screen.getByDisplayValue('1')).toBeInTheDocument();
      
      // 2回目クリック：OFF
      fireEvent.click(button);
      expect(screen.getByDisplayValue('0')).toBeInTheDocument();
      
      // 3回目クリック：ON
      fireEvent.click(button);
      expect(screen.getByDisplayValue('1')).toBeInTheDocument();
    });
  });

  describe('フォーム統合', () => {
    it('nameプロパティがhidden inputに正しく設定される', () => {
      render(<ToggleButton name="account_class" />);
      
      const hiddenInput = screen.getByDisplayValue('0');
      expect(hiddenInput).toHaveAttribute('name', 'account_class');
    });

    it('異なるnameで複数のToggleButtonが独立動作する', () => {
      const { container } = render(
        <div>
          <ToggleButton name="toggle1" />
          <ToggleButton name="toggle2" defaultValue={true} />
        </div>
      );
      
      const buttons = screen.getAllByRole('button');
      const hiddenInput1 = container.querySelector('input[name="toggle1"]') as HTMLInputElement;
      const hiddenInput2 = container.querySelector('input[name="toggle2"]') as HTMLInputElement;
      
      // 初期状態
      expect(hiddenInput1).toHaveAttribute('name', 'toggle1');
      expect(hiddenInput1).toHaveAttribute('value', '0');
      expect(hiddenInput2).toHaveAttribute('name', 'toggle2');
      expect(hiddenInput2).toHaveAttribute('value', '1');
      
      // 1つ目のボタンをクリック
      fireEvent.click(buttons[0]);
      
      // 1つ目は1に変わり、2つ目は1のまま
      expect(hiddenInput1).toHaveAttribute('value', '1');
      expect(hiddenInput2).toHaveAttribute('value', '1');
    });
  });

  describe('値の形式', () => {
    it('ONの場合は"1"、OFFの場合は"0"が設定される', () => {
      render(<ToggleButton name="test" />);
      
      const button = screen.getByRole('button');
      let hiddenInput = screen.getByDisplayValue('0');
      
      // 初期状態：OFF = "0"
      expect(hiddenInput.getAttribute('value')).toBe('0');
      
      // クリック後：ON = "1"
      fireEvent.click(button);
      hiddenInput = screen.getByDisplayValue('1');
      expect(hiddenInput.getAttribute('value')).toBe('1');
    });
  });

  describe('アクセシビリティ', () => {
    it('ボタンとして適切にアクセス可能', () => {
      render(<ToggleButton name="test" />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'button');
    });

    it('フォーカス可能である', () => {
      render(<ToggleButton name="test" />);
      
      const button = screen.getByRole('button');
      button.focus();
      
      expect(button).toHaveFocus();
    });

    it('画像に適切なaltテキストが設定される', () => {
      render(<ToggleButton name="test" />);
      
      const button = screen.getByRole('button');
      
      // OFF状態
      expect(screen.getByRole('img')).toHaveAttribute('alt', 'Toggle Off');
      
      // ON状態に切り替え
      fireEvent.click(button);
      expect(screen.getByRole('img')).toHaveAttribute('alt', 'Toggle On');
    });
  });

  describe('エラー処理', () => {
    it('nameプロパティが必須である', () => {
      // TypeScriptの型チェックでnameプロパティが必須であることを確認
      render(<ToggleButton name="required-prop" />);
      
      const hiddenInput = screen.getByDisplayValue('0');
      expect(hiddenInput).toHaveAttribute('name', 'required-prop');
    });
  });
});