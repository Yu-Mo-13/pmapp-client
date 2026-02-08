'use server';

import {
  AccountUpdateValidationError,
  AccountService,
} from '@/api/services/account/accountService';

export interface FormState {
  errors?: AccountUpdateValidationError;
  success?: boolean;
  shouldRedirect?: boolean;
}

export async function updateAccount(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const id = Number(formData.get('id'));
  if (!id) {
    return {
      errors: { account: { name: ['IDが指定されていません。'] } },
      success: false,
      shouldRedirect: false,
    };
  }

  const TOGGLE_ON = '1';
  const account = {
    account: {
      name: formData.get('name') as string,
      notice_class: formData.get('notice_class') === TOGGLE_ON,
    },
  };

  try {
    const response = await AccountService.update(id, account);

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
    console.error('Account update failed:', error);
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
