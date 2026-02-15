import apiClient from '../../client';
import { ApiResponse } from '../../types';
import { extractValidationErrors } from '../../utils/validationErrorTransformer';

export interface LoginRequest {
  email: string;
  password: string;
  [key: string]: unknown;
}

export interface LoginResponse {
  access_token?: string;
  token?: string;
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

  static async logout(): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/logout');
  }
}

export const extractUserName = (value: unknown): string | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const obj = value as Record<string, unknown>;
  const candidates = [obj.name, obj.user_name, obj.username, obj.userName];
  const found = candidates.find(
    (candidate): candidate is string =>
      typeof candidate === 'string' && candidate.trim().length > 0
  );
  if (found) {
    return found;
  }

  const user = obj.user;
  if (user && typeof user === 'object') {
    const userRecord = user as Record<string, unknown>;
    const userName = [
      userRecord.name,
      userRecord.user_name,
      userRecord.username,
      userRecord.userName,
    ].find(
      (candidate): candidate is string =>
        typeof candidate === 'string' && candidate.trim().length > 0
    );
    if (userName) {
      return userName;
    }
  }

  return extractUserName(obj.data);
};

const decodeBase64Url = (value: string): string | null => {
  try {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);

    if (typeof atob === 'function') {
      return decodeURIComponent(
        Array.from(atob(padded))
          .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
          .join('')
      );
    }

    if (typeof Buffer !== 'undefined') {
      return Buffer.from(padded, 'base64').toString('utf-8');
    }
  } catch {
    return null;
  }

  return null;
};

export const extractUserNameFromToken = (token: string): string | null => {
  if (!token) {
    return null;
  }

  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  const payloadText = decodeBase64Url(parts[1]);
  if (!payloadText) {
    return null;
  }

  try {
    const payload = JSON.parse(payloadText) as Record<string, unknown>;
    const userName = extractUserName(payload);
    if (userName) {
      return userName;
    }

    const fallback = [payload.preferred_username, payload.email, payload.sub].find(
      (candidate): candidate is string =>
        typeof candidate === 'string' && candidate.trim().length > 0
    );
    return fallback ?? null;
  } catch {
    return null;
  }
};
