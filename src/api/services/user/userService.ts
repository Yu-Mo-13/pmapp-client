import apiClient from '../../client';
import { ApiResponse, RequestData } from '../../types';

// ユーザー関連のAPI型定義
export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

/**
 * ユーザー関連のAPIサービス
 */
export class UserService {
  /**
   * ユーザー一覧を取得
   */
  static async getUsers(): Promise<ApiResponse<User[]>> {
    return apiClient.get<User[]>('/users');
  }

  /**
   * 特定のユーザーを取得
   */
  static async getUser(id: number): Promise<ApiResponse<User>> {
    return apiClient.get<User>(`/users/${id}`);
  }

  /**
   * ユーザーを作成
   */
  static async createUser(
    userData: CreateUserRequest
  ): Promise<ApiResponse<User>> {
    return apiClient.post<User>('/users', userData as unknown as RequestData);
  }

  /**
   * ユーザーを更新
   */
  static async updateUser(
    id: number,
    userData: UpdateUserRequest
  ): Promise<ApiResponse<User>> {
    return apiClient.put<User>(
      `/users/${id}`,
      userData as unknown as RequestData
    );
  }

  /**
   * ユーザーを削除
   */
  static async deleteUser(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/users/${id}`);
  }

  /**
   * ログイン
   */
  static async login(
    credentials: LoginRequest
  ): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<LoginResponse>(
      '/auth/login',
      credentials as unknown as RequestData
    );

    // ログイン成功時にトークンを保存
    if (response.success && response.data?.token) {
      apiClient.setAuthToken(response.data.token);
    }

    return response;
  }

  /**
   * ログアウト
   */
  static async logout(): Promise<ApiResponse<void>> {
    const response = await apiClient.post<void>('/auth/logout');

    // ログアウト時にトークンをクリア
    if (response.success) {
      localStorage.removeItem('auth_token');
    }

    return response;
  }
}
