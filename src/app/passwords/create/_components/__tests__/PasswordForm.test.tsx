import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import PasswordForm from '../PasswordForm';
import { FormState } from '../../action/PasswordCreateActions';

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
    disabled,
  }: {
    text: string;
    isSubmit?: boolean;
    disabled?: boolean;
  }) {
    return (
      <button type={isSubmit ? 'submit' : 'button'} disabled={disabled}>
        {text}
      </button>
    );
  };
});

jest.mock('@/components/button/CancelButton', () => {
  return function MockCancelButton({ to }: { to: string }) {
    return <a href={to}>キャンセル</a>;
  };
});

jest.mock('@/components/Button', () => {
  return function MockButton({
    text,
    onClick,
  }: {
    text: string;
    onClick: () => void;
  }) {
    return <button onClick={onClick}>{text}</button>;
  };
});

describe('PasswordForm', () => {
  const mockPush = jest.fn();
  const mockFormAction = jest.fn();
  const applications = [
    { id: 1, name: 'アプリA', mark_class: true },
    { id: 2, name: 'アプリB', mark_class: false },
  ];
  const accounts = [
    {
      id: 10,
      name: 'account-a1',
      application_id: 1,
      application_name: 'アプリA',
      notice_class: false,
    },
    {
      id: 20,
      name: 'account-a2',
      application_id: 1,
      application_name: 'アプリA',
      notice_class: true,
    },
    {
      id: 30,
      name: 'account-b1',
      application_id: 2,
      application_name: 'アプリB',
      notice_class: false,
    },
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
    mockPush.mockReset();
  });

  it('アプリ選択に応じてアカウント候補が連動する', async () => {
    const user = userEvent.setup();

    render(<PasswordForm applications={applications} accounts={accounts} />);

    const selects = screen.getAllByRole('combobox');
    const applicationSelect = selects[0];
    const accountSelect = selects[1];

    expect(accountSelect).toBeDisabled();

    await user.selectOptions(applicationSelect, '1');

    expect(accountSelect).not.toBeDisabled();
    expect(screen.getByRole('option', { name: 'account-a1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'account-a2' })).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: 'account-b1' })
    ).not.toBeInTheDocument();
  });

  it('success 時は一覧へ遷移する', () => {
    mockUseActionState.mockReturnValue([
      {
        errors: undefined,
        success: true,
        shouldRedirect: true,
      },
      mockFormAction,
      false,
    ]);

    render(<PasswordForm applications={applications} accounts={accounts} />);

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('mark_class=true のアプリでは記号入りパスワードを生成する', async () => {
    const user = userEvent.setup();
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

    render(<PasswordForm applications={applications} accounts={accounts} />);

    const selects = screen.getAllByRole('combobox');
    await user.selectOptions(selects[0], '1');
    await user.click(screen.getByRole('button', { name: '生成' }));

    const passwordInput = screen.getByRole('textbox') as HTMLInputElement;
    expect(passwordInput.value).toMatch(/[!@#$%^&*]/);

    randomSpy.mockRestore();
  });

  it('mark_class=false のアプリでは記号なしパスワードを生成する', async () => {
    const user = userEvent.setup();
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

    render(<PasswordForm applications={applications} accounts={accounts} />);

    const selects = screen.getAllByRole('combobox');
    await user.selectOptions(selects[0], '2');
    await user.click(screen.getByRole('button', { name: '生成' }));

    const passwordInput = screen.getByRole('textbox') as HTMLInputElement;
    expect(passwordInput.value).not.toMatch(/[!@#$%^&*]/);

    randomSpy.mockRestore();
  });
});
