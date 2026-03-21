'use server';

import {
  ApplicationService,
  ApplicationValidationError,
} from '@/api/services/application/applicationService';
import { guardApiResponse } from '@/app/_lib/responseGuard';
import { getServerAuthConfig } from '@/lib/serverAuthConfig';

export interface FormState {
  errors?: ApplicationValidationError;
  success?: boolean;
  shouldRedirect?: boolean;
}

export async function createApplication(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  void prevState;
  const TOGGLE_ON = '1';
  const application = {
    application: {
      name: formData.get('name') as string,
      account_class: formData.get('account_class') === TOGGLE_ON,
      notice_class: formData.get('notice_class') === TOGGLE_ON,
      mark_class: formData.get('mark_class') === TOGGLE_ON,
      pre_password_size: parseInt(formData.get('pre_password_size') as string),
    },
  };

  const authConfig = await getServerAuthConfig();
  const response = await ApplicationService.create(application, authConfig);

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
        application: {
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
