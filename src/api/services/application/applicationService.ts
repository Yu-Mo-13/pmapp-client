import apiClient from '../../client';
import { ApiResponse } from '../../types';

export interface Application {
  id: number,
  name: string,
  account_class: boolean,
  notice_class: boolean,
  mark_class: boolean,
}

export interface ApplicationCreateRequest {
  application: {
    name: string;
    account_class: boolean;
    notice_class: boolean;
    mark_class: boolean;
    pre_password_size: number;
  };
  [key: string]: unknown;
}

export type ApplicationIndexResponse = {
  data: Application[];
}

export type ApplicationCreateResponse = unknown;

export interface ApplicationCreateValidationError {
  application?: {
    name?: string[];
    account_class?: string[];
    notice_class?: string[];
    mark_class?: string[];
    pre_password_size?: string[];
  };
  [key: string]: unknown;
}

export type ApplicationCreateApiResponse = ApiResponse<ApplicationCreateResponse> | {
  errors?: ApplicationCreateValidationError;
}

export class ApplicationService {
  static async index(): Promise<ApiResponse<ApplicationIndexResponse>> {
    return apiClient.get('/applications');
  }

  static async create(request: ApplicationCreateRequest): Promise<ApplicationCreateApiResponse> {
    console.log('ApplicationService.create called with:', request);
    
    const response = await apiClient.post('/applications', request);
    
    console.log('Raw API response:', response);
    
    // エラーレスポンスかつ422エラーの場合、バリデーションエラーとして処理
    if (!response.success && response.error?.status === 422 && response.error.validationErrors) {
      console.log('Processing validation errors:', response.error.validationErrors);
      
      // バックエンドのエラー形式を期待する形式に変換
      const backendErrors = response.error.validationErrors as {
        message: string;
        errors: Record<string, string[]>;
      };
      const transformedErrors: ApplicationCreateValidationError = {
        application: {}
      };
      
      // 'application.name' -> { application: { name: [...] } } に変換
      if (backendErrors.errors) {
        Object.keys(backendErrors.errors).forEach(key => {
          if (key.startsWith('application.')) {
            const fieldName = key.replace('application.', '') as keyof NonNullable<ApplicationCreateValidationError['application']>;
            if (!transformedErrors.application) {
              transformedErrors.application = {};
            }
            (transformedErrors.application as Record<string, string[]>)[fieldName] = backendErrors.errors[key];
          }
        });
      }
      
      console.log('Transformed errors:', transformedErrors);
      
      return {
        errors: transformedErrors
      };
    }
    
    return response;
  }
}
