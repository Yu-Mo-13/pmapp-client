import { render, screen } from '@testing-library/react';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import AccountForm from '../AccountForm';
import { FormState } from '../../action/AccountCreateActions';

jest.mock('react', () => {
  const actual = jest.requireActual('react');
  return {
    ...actual,
    useActionState: jest.fn(),
  };
});

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next/image', () => {
  return function MockImage({
    src,
    alt,
    width,
    height,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
  }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} width={width} height={height} />;
  };
});

jest.mock('@/components/button/SubmitButton', () => {
  return function MockSubmitButton({
    text,
    isSubmit,
  }: {
    text: string;
    isSubmit?: boolean;
  }) {
    return <button type={isSubmit ? 'submit' : 'button'}>{text}</button>;
  };
});

jest.mock('@/components/button/CancelButton', () => {
  return function MockCancelButton({ to }: { to: string }) {
    return <a href={to}>キャンセル</a>;
  };
});

jest.mock('@/components/ToggleButton', () => {
  return function MockToggleButton({ name }: { name: string }) {
    return <div data-testid="toggle-button" data-name={name} />;
  };
});

describe('AccountForm', () => {
  const mockPush = jest.fn();
  const mockFormAction = jest.fn();

  const applications = [
    { id: 1, name: 'アプリA' },
    { id: 2, name: 'アプリB' },
  ];

  const mockUseActionState = useActionState as jest.MockedFunction<
    typeof useActionState
  >;
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

  beforeEach(() => {
    const initialState: FormState = {
      errors: undefined,
      success: false,
      shouldRedirect: false,
    };
    mockUseActionState.mockReturnValue([initialState, mockFormAction, false]);
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    } as ReturnType<typeof useRouter>);
  });

  it('フォーム項目とアプリケーション一覧を表示する', () => {
    const { container } = render(<AccountForm applications={applications} />);

    expect(screen.getByText('アカウント名')).toBeInTheDocument();
    expect(
      container.querySelector('input[name="name"][type="text"]')
    ).toBeInTheDocument();

    expect(screen.getByText('アプリケーション')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '選択してください' })).toHaveValue(
      ''
    );
    expect(screen.getByRole('option', { name: 'アプリA' })).toHaveValue('1');
    expect(screen.getByRole('option', { name: 'アプリB' })).toHaveValue('2');
  });

  it('子コンポーネントに正しいpropsを渡す', () => {
    render(<AccountForm applications={applications} />);

    expect(screen.getByTestId('toggle-button')).toHaveAttribute(
      'data-name',
      'notice_class'
    );
    expect(screen.getByRole('link', { name: 'キャンセル' })).toHaveAttribute(
      'href',
      '/accounts'
    );
    expect(screen.getByRole('button', { name: '登録' })).toHaveAttribute(
      'type',
      'submit'
    );
  });

  it('バリデーションエラーを表示する', () => {
    const stateWithErrors: FormState = {
      errors: {
        account: {
          name: ['アカウント名は必須です'],
          application_id: ['アプリケーションを選択してください'],
          notice_class: ['定期通知区分が不正です'],
        },
      },
      success: false,
      shouldRedirect: false,
    };
    mockUseActionState.mockReturnValue([stateWithErrors, mockFormAction, false]);

    render(<AccountForm applications={applications} />);

    expect(screen.getByText('アカウント名は必須です')).toBeInTheDocument();
    expect(
      screen.getByText('アプリケーションを選択してください')
    ).toBeInTheDocument();
    expect(screen.getByText('定期通知区分が不正です')).toBeInTheDocument();
  });

  it('shouldRedirect=true のとき /accounts に遷移する', () => {
    const redirectState: FormState = {
      errors: undefined,
      success: true,
      shouldRedirect: true,
    };
    mockUseActionState.mockReturnValue([redirectState, mockFormAction, false]);

    render(<AccountForm applications={applications} />);

    expect(mockPush).toHaveBeenCalledWith('/accounts');
    expect(mockPush).toHaveBeenCalledTimes(1);
  });

  it('shouldRedirect=false のとき遷移しない', () => {
    render(<AccountForm applications={applications} />);

    expect(mockPush).not.toHaveBeenCalled();
  });
});
