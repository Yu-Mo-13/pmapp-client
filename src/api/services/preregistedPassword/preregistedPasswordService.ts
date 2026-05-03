import apiClient from '../../client';
import { ApiResponse, RequestConfig } from '../../types';
import { extractValidationErrors } from '../../utils/validationErrorTransformer';

export interface PreregistedPasswordRelation {
  id?: number;
  name?: string;
}

export interface PreregistedPasswordIndexRow {
  uuid: string;
  created_at: string;
  application_name: string;
  account_name: string;
}

export interface PreregistedPasswordShowResponse {
  uuid: string;
  password?: string;
  application_id?: number;
  account_id?: number;
  created_at: string;
  application_name: string;
  account_name: string;
}

export interface PreregistedPasswordTargetEntity {
  id: number;
  name: string;
}

export interface PreregistedPasswordTargetResponse {
  application: PreregistedPasswordTargetEntity;
  account: PreregistedPasswordTargetEntity | null;
}

type PreregistedPasswordRaw = {
  uuid?: string;
  created_at?: string;
  password?: string;
  application_id?: number;
  account_id?: number;
  application?: PreregistedPasswordRelation;
  account?: PreregistedPasswordRelation;
  application_name?: string;
  account_name?: string;
};

type PreregistedPasswordTargetRaw = {
  application?: PreregistedPasswordRelation | null;
  account?: PreregistedPasswordRelation | null;
};

type ListEnvelope =
  | PreregistedPasswordRaw[]
  | {
      data?: PreregistedPasswordRaw[];
    };

type ShowEnvelope =
  | PreregistedPasswordRaw
  | {
      data?: PreregistedPasswordRaw;
    };

type TargetEnvelope =
  | PreregistedPasswordTargetRaw
  | {
      data?: PreregistedPasswordTargetRaw;
    };

export type PreregistedPasswordDeleteResponse = {
  message?: string;
};

export interface PreregistedPasswordCreateRequest {
  preregisted_password: {
    application_id: number;
    account_id?: number | null;
  };
  [key: string]: unknown;
}

export interface PreregistedPasswordCreateValidationError {
  preregisted_password?: {
    application_id?: string[];
    account_id?: string[];
  };
  [key: string]: unknown;
}

export type PreregistedPasswordCreateResponse = unknown;

export type PreregistedPasswordCreateApiResponse =
  | ApiResponse<PreregistedPasswordCreateResponse>
  | {
      errors?: PreregistedPasswordCreateValidationError;
    };

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const pickString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.length > 0 ? value : undefined;

const pickNumber = (value: unknown): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined;

const normalizeListItem = (
  item: PreregistedPasswordRaw
): PreregistedPasswordIndexRow | null => {
  const uuid = pickString(item.uuid);
  const createdAt = pickString(item.created_at);

  if (!uuid || !createdAt) {
    return null;
  }

  return {
    uuid,
    created_at: createdAt,
    application_name:
      pickString(item.application?.name) ?? pickString(item.application_name) ?? '-',
    account_name:
      pickString(item.account?.name) ?? pickString(item.account_name) ?? '-',
  };
};

export const extractPreregistedPasswordIndexRows = (
  value: unknown
): PreregistedPasswordIndexRow[] => {
  const list = Array.isArray(value)
    ? value
    : isObject(value) && Array.isArray(value.data)
      ? value.data
      : [];

  return (list as PreregistedPasswordRaw[])
    .map(normalizeListItem)
    .filter((row): row is PreregistedPasswordIndexRow => row !== null);
};

export const extractPreregistedPasswordShow = (
  value: unknown
): PreregistedPasswordShowResponse | null => {
  const raw = isObject(value) && isObject(value.data) ? value.data : value;

  if (!isObject(raw)) {
    return null;
  }

  const uuid = pickString(raw.uuid);
  const createdAt = pickString(raw.created_at);

  if (!uuid || !createdAt) {
    return null;
  }

  const applicationObj = isObject(raw.application)
    ? (raw.application as PreregistedPasswordRelation)
    : undefined;
  const accountObj = isObject(raw.account)
    ? (raw.account as PreregistedPasswordRelation)
    : undefined;

  return {
    uuid,
    password: pickString(raw.password),
    application_id:
      pickNumber(applicationObj?.id) ?? pickNumber(raw.application_id),
    account_id: pickNumber(accountObj?.id) ?? pickNumber(raw.account_id),
    created_at: createdAt,
    application_name:
      pickString(applicationObj?.name) ?? pickString(raw.application_name) ?? '-',
    account_name:
      pickString(accountObj?.name) ?? pickString(raw.account_name) ?? '-',
  };
};

const normalizeTargetEntity = (
  value: unknown
): PreregistedPasswordTargetEntity | null => {
  if (!isObject(value)) {
    return null;
  }

  const id = pickNumber(value.id);
  const name = pickString(value.name);

  if (typeof id !== 'number' || !name) {
    return null;
  }

  return { id, name };
};

export const extractPreregistedPasswordTarget = (
  value: unknown
): PreregistedPasswordTargetResponse | null => {
  const raw = isObject(value) && isObject(value.data) ? value.data : value;

  if (!isObject(raw)) {
    return null;
  }

  const application = normalizeTargetEntity(raw.application);
  if (!application) {
    return null;
  }

  const account = raw.account === null ? null : normalizeTargetEntity(raw.account);
  if (raw.account !== null && !account) {
    return null;
  }

  return {
    application,
    account,
  };
};

export class PreregistedPasswordService {
  static async index(
    config?: RequestConfig
  ): Promise<ApiResponse<ListEnvelope>> {
    return apiClient.get('/preregisted-passwords', config);
  }

  static async show(
    uuid: string,
    config?: RequestConfig
  ): Promise<ApiResponse<ShowEnvelope>> {
    return apiClient.get(`/preregisted-passwords/${encodeURIComponent(uuid)}`, config);
  }

  static async target(
    applicationId: string | number,
    accountId?: string | number,
    config?: RequestConfig
  ): Promise<ApiResponse<TargetEnvelope>> {
    const query = new URLSearchParams({
      application_id: `${applicationId}`,
    });

    if (
      accountId !== undefined &&
      accountId !== null &&
      `${accountId}`.length > 0
    ) {
      query.set('account_id', `${accountId}`);
    }

    return apiClient.get(`/preregisted-passwords/target?${query.toString()}`, config);
  }

  static async create(
    request: PreregistedPasswordCreateRequest,
    config?: RequestConfig
  ): Promise<PreregistedPasswordCreateApiResponse> {
    const response = await apiClient.post('/preregisted-passwords', request, config);

    if (!response.success && response.validationErrors) {
      const errors = extractValidationErrors(response);
      if (errors) {
        return { errors: errors as PreregistedPasswordCreateValidationError };
      }
    }

    return response;
  }

  static async delete(
    uuid: string,
    config?: RequestConfig
  ): Promise<ApiResponse<PreregistedPasswordDeleteResponse>> {
    return apiClient.delete(
      `/preregisted-passwords/${encodeURIComponent(uuid)}`,
      config
    );
  }
}
