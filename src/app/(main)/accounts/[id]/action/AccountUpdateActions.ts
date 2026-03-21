'use server';

import {
  AccountUpdateValidationError,
  AccountService,
} from '@/api/services/account/accountService';
import { guardApiResponse } from '@/app/_lib/responseGuard';
import { getServerAuthConfig } from '@/lib/serverAuthConfig';

export interface FormState {
  errors?: AccountUpdateValidationError;
  success?: boolean;
  shouldRedirect?: boolean;
}

export async function updateAccount(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  void prevState;
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

  const authConfig = await getServerAuthConfig();
  const response = await AccountService.update(id, account, authConfig);

  if ('errors' in response && response.errors) {
    return {
      errors: response.errors,
      success: false,
      shouldRedirect: false,
    };
  }

  if ('success' in response && !response.success) {
    guardApiResponse(response, { allowStatuses: [422] });

    return {
      errors: {
        account: {
          name: [response.error?.message || '更新に失敗しました。'],
        },
      },
      success: false,
      shouldRedirect: false,
    };
  }

  return {
    success: true,
    shouldRedirect: true,
  };
}
