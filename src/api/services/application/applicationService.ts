import apiClient from '../../client';
import { ApiResponse, RequestConfig } from '../../types';
import { extractValidationErrors } from '../../utils/validationErrorTransformer';

export interface Application {
  id: number;
  name: string;
  account_class: boolean;
  notice_class: boolean;
  mark_class: boolean;
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
};

export type ApplicationShowResponse = Application & {
  pre_password_size: number;
};

export type ApplicationCreateResponse = unknown;

export interface ApplicationValidationError {
  application?: {
    name?: string[];
    account_class?: string[];
    notice_class?: string[];
    mark_class?: string[];
    pre_password_size?: string[];
  };
  [key: string]: unknown;
}

export type ApplicationCreateApiResponse =
  | ApiResponse<ApplicationCreateResponse>
  | {
      errors?: ApplicationValidationError;
    };

export type ApplicationUpdateResponse = unknown;
export type ApplicationDeleteResponse = unknown;

export interface ApplicationUpdateRequest {
  application: {
    name: string;
    account_class: boolean;
    notice_class: boolean;
    mark_class: boolean;
    pre_password_size: number;
  };
  [key: string]: unknown;
}

export type ApplicationUpdateApiResponse =
  | ApiResponse<ApplicationUpdateResponse>
  | {
      errors?: ApplicationValidationError;
    };
export class ApplicationService {
  static async index(
    config?: RequestConfig
  ): Promise<ApiResponse<ApplicationIndexResponse>> {
    return apiClient.get('/applications', config);
  }

  static async show(
    id: number,
    config?: RequestConfig
  ): Promise<ApiResponse<ApplicationShowResponse>> {
    return apiClient.get(`/applications/${id}`, config);
  }

  static async create(
    request: ApplicationCreateRequest,
    config?: RequestConfig
  ): Promise<ApplicationCreateApiResponse> {
    const response = await apiClient.post('/applications', request, config);

    // バリデーションエラーがある場合は変換して返す
    if (!response.success && response.validationErrors) {
      const errors = extractValidationErrors(response);
      if (errors) {
        return { errors: errors as ApplicationValidationError };
      }
    }

    return response;
  }

  static async update(
    id: number,
    request: Partial<ApplicationUpdateRequest>,
    config?: RequestConfig
  ): Promise<ApplicationUpdateApiResponse> {
    const response = await apiClient.put(`/applications/${id}`, request, config);

    // バリデーションエラーがある場合は変換して返す
    if (!response.success && response.validationErrors) {
      const errors = extractValidationErrors(response);
      if (errors) {
        return { errors: errors as ApplicationValidationError };
      }
    }

    return response;
  }

  static async delete(
    id: number,
    config?: RequestConfig
  ): Promise<ApiResponse<ApplicationDeleteResponse>> {
    return apiClient.delete(`/applications/${id}`, config);
  }
}
