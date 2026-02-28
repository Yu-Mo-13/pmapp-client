import apiClient from '../../client';
import { ApiResponse, RequestConfig } from '../../types';

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
}
