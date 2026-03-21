'use server';

import {
  PasswordCreateValidationError,
  PasswordService,
} from '@/api/services/password/passwordService';
import { guardApiResponse } from '@/app/_lib/responseGuard';
import { getServerAuthConfig } from '@/lib/serverAuthConfig';

export interface FormState {
  errors?: PasswordCreateValidationError;
  success?: boolean;
  shouldRedirect?: boolean;
}

export async function createPassword(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  void prevState;

  const password = (formData.get('password') as string | null)?.trim() ?? '';
  const applicationIdRaw = formData.get('application_id') as string | null;
  const accountIdRaw = formData.get('account_id') as string | null;
  const applicationId = applicationIdRaw ? Number(applicationIdRaw) : NaN;
  const accountId = accountIdRaw ? Number(accountIdRaw) : NaN;

  const authConfig = await getServerAuthConfig();
  const response = await PasswordService.create(
    {
      password: {
        password,
        application_id: applicationId,
        account_id: accountId,
      },
    },
    authConfig
  );

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
        password: {
          password: [response.error?.message ?? '登録に失敗しました。'],
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
