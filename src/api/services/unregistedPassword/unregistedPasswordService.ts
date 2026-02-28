import apiClient from '../../client';
import { ApiResponse, RequestConfig } from '../../types';

export interface UnregistedPasswordRelation {
  id?: number;
  name?: string;
}

export interface UnregistedPasswordIndexRow {
  uuid: string;
  created_at: string;
  application_name: string;
  account_name: string;
}

export interface UnregistedPasswordShowResponse {
  uuid: string;
  password?: string;
  decrypted_password?: string;
  application_id?: number;
  account_id?: number;
  created_at: string;
  application_name: string;
  account_name: string;
}

type UnregistedPasswordRaw = {
  uuid?: string;
  created_at?: string;
  password?: string;
  decrypted_password?: string;
  application_id?: number;
  account_id?: number;
  application?: UnregistedPasswordRelation;
  account?: UnregistedPasswordRelation;
  application_name?: string;
  account_name?: string;
};

type ListEnvelope =
  | UnregistedPasswordRaw[]
  | {
      data?: UnregistedPasswordRaw[];
    };

type ShowEnvelope =
  | UnregistedPasswordRaw
  | {
      data?: UnregistedPasswordRaw;
    };

export type UnregistedPasswordDeleteAllResponse = {
  message?: string;
};

export type UnregistedPasswordDeleteResponse = {
  message?: string;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const pickString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.length > 0 ? value : undefined;

const pickNumber = (value: unknown): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined;

const normalizeListItem = (
  item: UnregistedPasswordRaw
): UnregistedPasswordIndexRow | null => {
  const uuid = pickString(item.uuid);
  const createdAt = pickString(item.created_at);

  if (!uuid || !createdAt) {
    return null;
  }

  const applicationName =
    pickString(item.application?.name) ?? pickString(item.application_name) ?? '-';
  const accountName =
    pickString(item.account?.name) ?? pickString(item.account_name) ?? '-';

  return {
    uuid,
    created_at: createdAt,
    application_name: applicationName,
    account_name: accountName,
  };
};

export const extractUnregistedPasswordIndexRows = (
  value: unknown
): UnregistedPasswordIndexRow[] => {
  const list = Array.isArray(value)
    ? value
    : isObject(value) && Array.isArray(value.data)
      ? value.data
      : [];

  return (list as UnregistedPasswordRaw[])
    .map(normalizeListItem)
    .filter((row): row is UnregistedPasswordIndexRow => row !== null);
};

export const extractUnregistedPasswordShow = (
  value: unknown
): UnregistedPasswordShowResponse | null => {
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
    ? (raw.application as UnregistedPasswordRelation)
    : undefined;
  const accountObj = isObject(raw.account)
    ? (raw.account as UnregistedPasswordRelation)
    : undefined;

  return {
    uuid,
    password: pickString(raw.password),
    decrypted_password: pickString(raw.decrypted_password),
    application_id:
      pickNumber(applicationObj?.id) ?? pickNumber(raw.application_id),
    account_id: pickNumber(accountObj?.id) ?? pickNumber(raw.account_id),
    created_at: createdAt,
    application_name:
      pickString(applicationObj?.name) ?? pickString(raw.application_name) ?? '-',
    account_name: pickString(accountObj?.name) ?? pickString(raw.account_name) ?? '-',
  };
};

export class UnregistedPasswordService {
  static async index(
    config?: RequestConfig
  ): Promise<ApiResponse<ListEnvelope>> {
    return apiClient.get('/unregisted-passwords', config);
  }

  static async show(
    uuid: string,
    config?: RequestConfig
  ): Promise<ApiResponse<ShowEnvelope>> {
    return apiClient.get(`/unregisted-passwords/${encodeURIComponent(uuid)}`, config);
  }

  static async delete(
    uuid: string,
    config?: RequestConfig
  ): Promise<ApiResponse<UnregistedPasswordDeleteResponse>> {
    return apiClient.delete(
      `/unregisted-passwords/${encodeURIComponent(uuid)}`,
      config
    );
  }

  static async deleteAll(
    config?: RequestConfig
  ): Promise<ApiResponse<UnregistedPasswordDeleteAllResponse>> {
    return apiClient.delete('/unregisted-passwords', config);
  }
}
