import apiClient from '../../client';
import { ApiResponse } from '../../types';

export interface Application {
  id: number,
  name: string,
  account_class: boolean,
  notice_class: boolean,
  mark_class: boolean,
}

export class ApplicationService {
  static async index(): Promise<ApiResponse<Application[]>> {
    return apiClient.get('/applications');
  }
}
