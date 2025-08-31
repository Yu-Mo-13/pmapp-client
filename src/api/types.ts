export interface ApiError {
  message: string;
  status: number;
  code?: string;
  validationErrors?: unknown; // バリデーションエラーの詳細情報
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: ApiError;
  success: boolean;
}

export interface RequestConfig {
  timeout?: number;
  headers?: Record<string, string>;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ErrorDetail {
  field?: string;
  message: string;
}

export interface ValidationErrorResponse {
  errors: ErrorDetail[];
  message: string;
}

export interface ErrorResponseData {
  message?: string;
  errors?: ErrorDetail[];
  [key: string]: unknown;
}

export type RequestData = Record<string, unknown> | unknown[] | FormData | string | number | boolean | null;
