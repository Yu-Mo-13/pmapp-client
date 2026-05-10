import { loginAction } from '../loginActions';
import { AuthService } from '@/api/services/auth/authService';

jest.mock('next/headers', () => ({
  cookies: jest.fn(async () => ({
    set: jest.fn(),
  })),
}));

jest.mock('@/api/services/auth/authService', () => ({
  AuthService: {
    login: jest.fn(),
  },
  extractUserNameFromToken: jest.fn(() => null),
  LoginValidationError: {},
}));

describe('loginAction', () => {
  const mockedLogin = AuthService.login as jest.MockedFunction<
    typeof AuthService.login
  >;

  beforeEach(() => {
    mockedLogin.mockReset();
  });

  it('バックエンドが返した認証失敗メッセージをフォームエラーとして返す', async () => {
    mockedLogin.mockResolvedValue({
      success: false,
      error: {
        message: 'ログインに失敗しました。',
        status: 422,
        code: 'VALIDATION_ERROR',
      },
      validationErrors: {
        message: 'ログインに失敗しました。',
      },
    });

    const formData = new FormData();
    formData.set('email', 'user@example.com');
    formData.set('password', 'wrong-password');

    const result = await loginAction({}, formData);

    expect(result).toEqual({
      errors: {
        form: ['ログインに失敗しました。'],
      },
      success: false,
      message: 'ログインに失敗しました。',
      shouldRedirect: false,
    });
  });
});
