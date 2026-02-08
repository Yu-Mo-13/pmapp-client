import apiClient from '../../client';
import { ApiResponse } from '../../types';
import { ApplicationShowResponse } from '../application/applicationService';
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

export type AccountShowResponse = Account & {
  application: ApplicationShowResponse;
};

export class AccountService {
  static async index(): Promise<ApiResponse<AccountIndexResponse>> {
    return apiClient.get('/accounts');
  }

  static async show(id: number): Promise<ApiResponse<AccountShowResponse>> {
    return apiClient.get(`/accounts/${id}`);
  }
}
