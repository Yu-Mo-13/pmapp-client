import apiClient from '../../client';
import { ApiResponse } from '../../types';
// import { extractValidationErrors } from '../../utils/validationErrorTransformer';

export interface Account {
  id: number;
  name: string;
  application_id: number;
  application_name: string;
  notice_class: boolean;
}

export type AccountIndexResponse = {
  data: Account[];
};

export class AccountService {
  static async index(): Promise<ApiResponse<AccountIndexResponse>> {
    return apiClient.get('/accounts');
  }
}
