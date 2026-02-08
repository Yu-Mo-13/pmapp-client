'use server';

import {
  AccountService,
  AccountCreateValidationError,
} from '@/api/services/account/accountService';

export interface FormState {
  errors?: AccountCreateValidationError;
  success?: boolean;
  shouldRedirect?: boolean;
}

export async function createAccount(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const TOGGLE_ON = '1';
  const account = {
    account: {
      name: formData.get('name') as string,
      application_id: parseInt(formData.get('application_id') as string),
      notice_class: formData.get('notice_class') === TOGGLE_ON,
    },
  };

  try {
    const response = await AccountService.create(account);

    if ('errors' in response && response.errors) {
      return {
        errors: response.errors,
        success: false,
        shouldRedirect: false,
      };
    }

    // 成功時はリダイレクトフラグを返す
    return {
      success: true,
      shouldRedirect: true,
    };
  } catch (error) {
    console.error('Account creation failed:', error);
    return {
      errors: {
        account: {
          name: ['サーバーエラーが発生しました。再度お試しください。'],
        },
      },
      success: false,
      shouldRedirect: false,
    };
  }
}
