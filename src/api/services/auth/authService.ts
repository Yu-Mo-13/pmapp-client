import apiClient from '../../client';
import { ApiResponse } from '../../types';
import { extractValidationErrors } from '../../utils/validationErrorTransformer';

export interface LoginRequest {
  email: string;
  password: string;
  [key: string]: unknown;
}

export interface LoginResponse {
  access_token: string;
}

export interface LoginStatusResponse {
  name: string;
}

export interface LoginValidationError {
  email?: string[];
  password?: string[];
  [key: string]: unknown;
}

export type LoginApiResponse =
  | ApiResponse<LoginResponse>
  | {
      errors?: LoginValidationError;
    };

export class AuthService {
  static async login(request: LoginRequest): Promise<LoginApiResponse> {
    const response = await apiClient.post('/login', request);

    // バリデーションエラーがある場合は変換して返す
    if (!response.success && response.validationErrors) {
      const errors = extractValidationErrors(response);
      if (errors) {
        return { errors: errors as LoginValidationError };
      }
    }

    return response as ApiResponse<LoginResponse>;
  }

  static async loginStatus(): Promise<ApiResponse<LoginStatusResponse>> {
    return apiClient.get<LoginStatusResponse>('/login/status');
  }
}
