'use server';

import {
  ApplicationService,
  ApplicationValidationError,
} from '@/api/services/application/applicationService';
import { getServerAuthConfig } from '@/lib/serverAuthConfig';

export interface FormState {
  errors?: ApplicationValidationError;
  success?: boolean;
  shouldRedirect?: boolean;
}

export async function updateApplication(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  void prevState;
  const id = Number(formData.get('id'));
  if (!id) {
    return {
      errors: { application: { name: ['IDが指定されていません。'] } },
      success: false,
      shouldRedirect: false,
    };
  }

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

  try {
    const authConfig = await getServerAuthConfig();
    const response = await ApplicationService.update(id, application, authConfig);

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
    console.error('Application update failed:', error);
    return {
      errors: {
        application: {
          name: ['サーバーエラーが発生しました。再度お試しください。'],
        },
      },
      success: false,
      shouldRedirect: false,
    };
  }
}
