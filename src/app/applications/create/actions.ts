'use server';

import { ApplicationService, ApplicationCreateValidationError } from '@/api/services/application/applicationService';

export interface FormState {
  errors?: ApplicationCreateValidationError;
  success?: boolean;
  shouldRedirect?: boolean;
}

export async function createApplication(prevState: FormState, formData: FormData): Promise<FormState> {
  const TOGGLE_ON = '1';
  const name = formData.get('name') as string;
  const accountClass = formData.get('account_class') === TOGGLE_ON;
  const noticeClass = formData.get('notice_class') === TOGGLE_ON;
  const markClass = formData.get('mark_class') === TOGGLE_ON;
  const prePasswordSize = parseInt(formData.get('pre_password_size') as string);

  try {
    const response = await ApplicationService.create({
      application: {
        name,
        account_class: accountClass,
        notice_class: noticeClass,
        mark_class: markClass,
        pre_password_size: prePasswordSize,
      }
    });

    if ('errors' in response && response.errors) {
      return {
        errors: response.errors,
        success: false,
        shouldRedirect: false
      };
    }

    // 成功時はリダイレクトフラグを返す
    return {
      success: true,
      shouldRedirect: true
    };
  } catch (error) {
    console.error('Application creation failed:', error);
    return {
      errors: {
        application: { name: ['サーバーエラーが発生しました。再度お試しください。'] }
      },
      success: false,
      shouldRedirect: false
    };
  }
}
