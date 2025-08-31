'use server';

import { redirect } from 'next/navigation';
import { ApplicationService, ApplicationCreateValidationError } from '@/api/services/application/applicationService';

export interface FormState {
  errors?: ApplicationCreateValidationError;
  success?: boolean;
}

export async function createApplication(prevState: FormState, formData: FormData): Promise<FormState> {
  const name = formData.get('name') as string;
  const accountClass = formData.get('account_class') === 'on';
  const noticeClass = formData.get('notice_class') === 'on';
  const markClass = formData.get('mark_class') === 'on';
  const prePasswordSize = parseInt(formData.get('pre_password_size') as string) || 10;
  
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
        success: false
      };
    } else {
      redirect('/applications');
    }
  } catch (error) {
    console.error('Application creation failed:', error);
    return {
      errors: {
        application: { name: ['登録に失敗しました。再度お試しください。'] }
      },
      success: false
    };
  }
}
