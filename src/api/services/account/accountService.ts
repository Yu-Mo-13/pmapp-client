import apiClient from '../../client';
import { ApiResponse } from '../../types';
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

export interface AccountUpdateRequest {
  application: {
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
  static async index(): Promise<ApiResponse<AccountIndexResponse>> {
    return apiClient.get('/accounts');
  }

  static async show(id: number): Promise<ApiResponse<AccountShowResponse>> {
    return apiClient.get(`/accounts/${id}`);
  }

  static async update(
    id: number,
    request: Partial<AccountUpdateRequest>
  ): Promise<AccountUpdateApiResponse> {
    const res = await apiClient.put(`/accounts/${id}`, request);

    if (!res.success && res.validationErrors) {
      const errors = extractValidationErrors(res);
      if (errors) {
        return { errors: errors as AccountUpdateValidationError };
      }
    }
    return res;
  }

  static async delete(id: number): Promise<ApiResponse<AccountDeleteResponse>> {
    return apiClient.delete(`/accounts/${id}`);
  }
}
