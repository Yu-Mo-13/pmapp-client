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
    return apiClient.post('/applications', request);
  }
}
