import { render, screen } from '@testing-library/react';
import { useActionState } from 'react';
import LoginPage from '../page';
import type { LoginFormState } from '../loginActions';

jest.mock('react', () => {
  const actual = jest.requireActual('react');
  return {
    ...actual,
    useActionState: jest.fn(),
  };
});

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(() => null),
  })),
}));

jest.mock('@/api', () => ({
  apiClient: {
    setAuthToken: jest.fn(),
  },
}));

jest.mock('@/api/services/auth/authService', () => ({
  AuthService: {
    loginStatus: jest.fn(),
  },
  extractTopPageUrl: jest.fn(() => null),
  extractUserName: jest.fn(() => null),
  extractUserNameFromToken: jest.fn(() => null),
}));

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

describe('LoginPage', () => {
  const mockUseActionState = useActionState as jest.MockedFunction<
    typeof useActionState
  >;

  beforeEach(() => {
    const initialState: LoginFormState = {
      errors: {},
      success: false,
      message: '',
      shouldRedirect: false,
    };

    mockUseActionState.mockReturnValue([initialState, jest.fn(), false]);
  });

  it('認証失敗時のフォームエラーをパスワード欄とログインボタンの間に表示する', () => {
    mockUseActionState.mockReturnValue([
      {
        errors: {
          form: ['メールアドレスまたはパスワードが正しくありません。'],
        },
        success: false,
        message: 'メールアドレスまたはパスワードが正しくありません。',
        shouldRedirect: false,
      },
      jest.fn(),
      false,
    ]);

    render(<LoginPage />);

    const errorMessage = screen.getByText(
      'メールアドレスまたはパスワードが正しくありません。'
    );
    const passwordInput = screen.getByLabelText('パスワード');
    const submitButton = screen.getByRole('button', { name: 'ログイン' });

    expect(errorMessage).toBeInTheDocument();
    expect(passwordInput.compareDocumentPosition(errorMessage)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
    expect(errorMessage.compareDocumentPosition(submitButton)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
    expect(errorMessage).toHaveClass('text-left');
  });
});
