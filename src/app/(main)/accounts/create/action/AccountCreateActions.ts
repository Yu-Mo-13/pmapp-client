'use server';

import {
  AccountService,
  AccountCreateValidationError,
} from '@/api/services/account/accountService';
import { guardApiResponse } from '@/app/_lib/responseGuard';
import { getServerAuthConfig } from '@/lib/serverAuthConfig';

export interface FormState {
  errors?: AccountCreateValidationError;
  success?: boolean;
  shouldRedirect?: boolean;
}

export async function createAccount(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  void prevState;
  const TOGGLE_ON = '1';
  const account = {
    account: {
      name: formData.get('name') as string,
      application_id: parseInt(formData.get('application_id') as string),
      notice_class: formData.get('notice_class') === TOGGLE_ON,
    },
  };

  const authConfig = await getServerAuthConfig();
  const response = await AccountService.create(account, authConfig);

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
          name: [response.error?.message || '登録に失敗しました。'],
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
