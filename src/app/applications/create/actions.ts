'use server';

import { ApplicationService, ApplicationCreateValidationError } from '@/api/services/application/applicationService';

export interface FormState {
  errors?: ApplicationCreateValidationError;
  success?: boolean;
  shouldRedirect?: boolean;
}

export async function createApplication(prevState: FormState, formData: FormData): Promise<FormState> {
  const name = formData.get('name') as string;
  const accountClass = formData.get('account_class') === 'on';
  const noticeClass = formData.get('notice_class') === 'on';
  const markClass = formData.get('mark_class') === 'on';
  const prePasswordSize = parseInt(formData.get('pre_password_size') as string) || 10;
  
  console.log('Form data:', { name, accountClass, noticeClass, markClass, prePasswordSize });
  
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
    
    console.log('API Response:', response);
    
    if ('errors' in response && response.errors) {
      console.log('Validation errors found:', response.errors);
      return {
        errors: response.errors,
        success: false,
        shouldRedirect: false
      };
    }
    
    console.log('Success - redirecting');
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
