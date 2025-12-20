'use server';

import {
  AuthService,
  LoginValidationError,
} from '@/api/services/auth/authService';

export interface LoginFormState {
  errors?: LoginValidationError;
  success?: boolean;
  message?: string; // Optional: General message for non-field specific errors
  shouldRedirect?: boolean;
}

export const initialState: LoginFormState = {
  errors: undefined,
  success: false,
  shouldRedirect: false,
};

export async function loginAction(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const response = await AuthService.login({ email, password });

    if ('errors' in response && response.errors) {
      return {
        errors: response.errors,
        success: false,
        shouldRedirect: false,
      };
    }

    if (
      'success' in response &&
      response.success &&
      response.data?.access_token
    ) {
      // 実際にはトークンを保存する処理が必要 (セッション管理など)
      // e.g. cookies().set('token', response.data.access_token);
      return {
        errors: {},
        success: true,
        message: 'Login successful.',
        shouldRedirect: true, // 成功時にリダイレクトフラグを立てる
      };
    }

    const errorMessage =
      'message' in response && typeof response.message === 'string'
        ? response.message
        : 'ログインに失敗しました。もう一度お試しください。';

    return {
      errors: { form: [errorMessage] },
      success: false,
      message: errorMessage,
      shouldRedirect: false,
    };
  } catch (error) {
    console.error('An unexpected error occurred during login:', error);
    const message = '予期せぬエラーが発生しました。';
    return {
      errors: { form: [message] },
      success: false,
      message,
      shouldRedirect: false,
    };
  }
}
