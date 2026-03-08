import apiClient from '../../client';
import { ApiResponse, RequestConfig } from '../../types';
import { extractValidationErrors } from '../../utils/validationErrorTransformer';

export interface PasswordRelation {
  id?: number;
  name?: string;
}

export interface PasswordIndexRow {
  application_id: number;
  account_id: number | null;
  latest_updated_at: string;
  application_name: string;
  account_name: string;
}

type PasswordIndexRaw = {
  latest_updated_at?: string;
  updated_at?: string;
  application?: PasswordRelation | null;
  account?: PasswordRelation | null;
  application_id?: number;
  account_id?: number | null;
  application_name?: string;
  account_name?: string;
};

type ListEnvelope =
  | PasswordIndexRaw[]
  | {
      data?: PasswordIndexRaw[];
    };

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

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const pickString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.length > 0 ? value : undefined;

const pickNumber = (value: unknown): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined;

const normalizeListItem = (item: PasswordIndexRaw): PasswordIndexRow | null => {
  const applicationId =
    pickNumber(item.application?.id) ?? pickNumber(item.application_id);
  const applicationName =
    pickString(item.application?.name) ?? pickString(item.application_name);

  if (!applicationId || !applicationName) {
    return null;
  }

  return {
    application_id: applicationId,
    account_id:
      pickNumber(item.account?.id) ?? pickNumber(item.account_id) ?? null,
    latest_updated_at:
      pickString(item.latest_updated_at) ?? pickString(item.updated_at) ?? '-',
    application_name: applicationName,
    account_name:
      pickString(item.account?.name) ??
      pickString(item.account_name) ??
      'アカウントなし',
  };
};

export const extractPasswordIndexRows = (value: unknown): PasswordIndexRow[] => {
  const list = Array.isArray(value)
    ? value
    : isObject(value) && Array.isArray(value.data)
      ? value.data
      : [];

  return (list as PasswordIndexRaw[])
    .map(normalizeListItem)
    .filter((row): row is PasswordIndexRow => row !== null);
};

export class PasswordService {
  static async index(
    applicationId?: string | number,
    config?: RequestConfig
  ): Promise<ApiResponse<ListEnvelope>> {
    const query = new URLSearchParams();

    if (
      applicationId !== undefined &&
      applicationId !== null &&
      `${applicationId}`.length > 0
    ) {
      query.set('application_id', `${applicationId}`);
    }

    const path = query.size > 0 ? `/passwords?${query.toString()}` : '/passwords';

    return apiClient.get(path, config);
  }

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
