'use server';

import { cookies } from 'next/headers';
import {
  AuthService,
  extractUserNameFromToken,
  LoginValidationError,
} from '@/api/services/auth/authService';

export interface LoginFormState {
  errors?: LoginValidationError;
  success?: boolean;
  message?: string; // Optional: General message for non-field specific errors
  shouldRedirect?: boolean;
  accessToken?: string;
}

export async function loginAction(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  void prevState;
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

    const accessToken =
      'success' in response && response.success
        ? response.data?.access_token || response.data?.token
        : undefined;

    if ('success' in response && response.success && accessToken) {
      const userName = extractUserNameFromToken(accessToken) || email;
      const cookieStore = await cookies();
      cookieStore.set('auth_token', accessToken, {
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
      cookieStore.set('auth_user_name', userName, {
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });

      return {
        errors: {},
        success: true,
        message: 'Login successful.',
        shouldRedirect: true, // 成功時にリダイレクトフラグを立てる
        accessToken,
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
