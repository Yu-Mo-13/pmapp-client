import apiClient from '../../client';
import { ApiResponse, RequestConfig } from '../../types';
import { extractValidationErrors } from '../../utils/validationErrorTransformer';

export interface PasswordCreateRequest {
  password: {
    password: string;
    application_id: number;
    account_id: number;
  };
  [key: string]: unknown;
}

export interface PasswordCreateValidationError {
  password?: {
    password?: string[];
    application_id?: string[];
    account_id?: string[];
  };
  [key: string]: unknown;
}

export type PasswordCreateResponse = unknown;

export type PasswordCreateApiResponse =
  | ApiResponse<PasswordCreateResponse>
  | {
      errors?: PasswordCreateValidationError;
    };

export class PasswordService {
  static async create(
    request: PasswordCreateRequest,
    config?: RequestConfig
  ): Promise<PasswordCreateApiResponse> {
    const response = await apiClient.post('/passwords', request, config);

    if (!response.success && response.validationErrors) {
      const errors = extractValidationErrors(response);
      if (errors) {
        return { errors: errors as PasswordCreateValidationError };
      }
    }

    return response;
  }
}
