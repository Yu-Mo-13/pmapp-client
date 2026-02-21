import apiClient from '../../client';
import { ApiResponse, RequestConfig } from '../../types';
import { SidebarMenuItem } from '@/types/sidebar';

export type MenuIndexResponse =
  | SidebarMenuItem[]
  | {
      data: SidebarMenuItem[];
    };

export class MenuService {
  static async index(
    config?: RequestConfig
  ): Promise<ApiResponse<MenuIndexResponse>> {
    return apiClient.get('/menus', config);
  }
}

export const extractMenuItems = (value: unknown): SidebarMenuItem[] => {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is SidebarMenuItem =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as Record<string, unknown>).name === 'string' &&
        typeof (item as Record<string, unknown>).path === 'string'
    );
  }

  if (!value || typeof value !== 'object') {
    return [];
  }

  const data = (value as { data?: unknown }).data;
  if (!Array.isArray(data)) {
    return [];
  }

  return data.filter(
    (item): item is SidebarMenuItem =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as Record<string, unknown>).name === 'string' &&
      typeof (item as Record<string, unknown>).path === 'string'
  );
};
