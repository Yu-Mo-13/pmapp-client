import apiClient from '../../client';
import { ApiResponse, RequestConfig } from '../../types';
import { ApplicationShowResponse } from '../application/applicationService';
import { extractValidationErrors } from '../../utils/validationErrorTransformer';

export interface Account {
  id: number;
  name: string;
  application_id: number;
  notice_class: boolean;
}

export type AccountIndexRow = Account & {
  application_name: string;
};

export type AccountIndexResponse = {
  data: AccountIndexRow[];
};

export type AccountShowResponse = Account & {
  application: ApplicationShowResponse;
};

export interface AccountCreateRequest {
  account: {
    name: string;
    application_id: number;
    notice_class: boolean;
  };
  [key: string]: unknown;
}

export interface AccountCreateValidationError {
  account?: {
    name?: string[];
    application_id?: string[];
    notice_class?: string[];
  };
  [key: string]: unknown;
}

export type AccountCreateResponse = unknown;

export type AccountCreateApiResponse =
  | ApiResponse<AccountCreateResponse>
  | {
      errors?: AccountCreateValidationError;
    };

export interface AccountUpdateRequest {
  account: {
    name: string;
    notice_class: boolean;
  };
  [key: string]: unknown;
}

export interface AccountUpdateValidationError {
  account?: {
    name?: string[];
    notice_class?: string[];
  };
  [key: string]: unknown;
}

export type AccountUpdateResponse = unknown;

export type AccountUpdateApiResponse =
  | ApiResponse<AccountUpdateResponse>
  | {
      errors?: AccountUpdateValidationError;
    };

export type AccountDeleteResponse = unknown;

export class AccountService {
  static async index(
    config?: RequestConfig
  ): Promise<ApiResponse<AccountIndexResponse>> {
    return apiClient.get('/accounts', config);
  }

  static async show(
    id: number,
    config?: RequestConfig
  ): Promise<ApiResponse<AccountShowResponse>> {
    return apiClient.get(`/accounts/${id}`, config);
  }

  static async create(
    request: Partial<AccountCreateRequest>
  ): Promise<AccountCreateApiResponse> {
    const res = await apiClient.post('/accounts', request);

    if (!res.success && res.validationErrors) {
      const errors = extractValidationErrors(res);
      if (errors) {
        return { errors: errors as AccountCreateValidationError };
      }
    }
    return res;
  }

  static async update(
    id: number,
    request: Partial<AccountUpdateRequest>,
    config?: RequestConfig
  ): Promise<AccountUpdateApiResponse> {
    const res = await apiClient.put(`/accounts/${id}`, request, config);

    if (!res.success && res.validationErrors) {
      const errors = extractValidationErrors(res);
      if (errors) {
        return { errors: errors as AccountUpdateValidationError };
      }
    }
    return res;
  }

  static async delete(
    id: number,
    config?: RequestConfig
  ): Promise<ApiResponse<AccountDeleteResponse>> {
    return apiClient.delete(`/accounts/${id}`, config);
  }
}
