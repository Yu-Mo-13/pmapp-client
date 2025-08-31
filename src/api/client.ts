import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { ApiError, ApiResponse, RequestConfig, ErrorResponseData, RequestData } from './types';

class ApiClient {
  private instance: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v2/') {
    this.baseURL = baseURL;
    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // リクエストインターセプター
    this.instance.interceptors.request.use(
      (config) => {
        // 認証トークンがある場合は追加
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // レスポンスインターセプター
    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private getAuthToken(): string | null {
    // ローカルストレージやクッキーからトークンを取得
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private handleError(error: AxiosError): ApiError & { validationErrors?: unknown } {
    const status = error.response?.status || 500;
    const responseData = error.response?.data as ErrorResponseData;

    switch (status) {
      case 401:
        // 認証エラー - トークンをクリアしてログイン画面にリダイレクト
        this.clearAuthToken();
        return {
          message: '認証が必要です。再度ログインしてください。',
          status,
          code: 'UNAUTHORIZED',
        };

      case 403:
        return {
          message: 'この操作を実行する権限がありません。',
          status,
          code: 'FORBIDDEN',
        };

      case 404:
        return {
          message: 'リクエストされたリソースが見つかりません。',
          status,
          code: 'NOT_FOUND',
        };

      case 422:
        // バリデーションエラー - レスポンスデータも含める
        return {
          message: responseData?.message || '入力データに問題があります。',
          status,
          code: 'VALIDATION_ERROR',
          validationErrors: responseData, // バリデーションエラーの詳細を保持
        };

      case 500:
        return {
          message: 'サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。',
          status,
          code: 'INTERNAL_SERVER_ERROR',
        };

      default:
        return {
          message: responseData?.message || error.message || 'エラーが発生しました。',
          status,
          code: 'UNKNOWN_ERROR',
        };
    }
  }

  private clearAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async makeRequest<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data?: RequestData,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const requestConfig = {
        ...config,
        headers: {
          ...config?.headers,
        },
      };

      let response: AxiosResponse<T>;

      switch (method) {
        case 'get':
          response = await this.instance.get(url, requestConfig);
          break;
        case 'post':
          response = await this.instance.post(url, data, requestConfig);
          break;
        case 'put':
          response = await this.instance.put(url, data, requestConfig);
          break;
        case 'delete':
          response = await this.instance.delete(url, requestConfig);
          break;
      }

      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      const apiError = error as ApiError & { validationErrors?: unknown };
      
      // 422エラーの場合はvalidationErrorsも含める
      if (apiError.status === 422 && apiError.validationErrors) {
        return {
          error: apiError,
          validationErrors: apiError.validationErrors,
          success: false,
        };
      }
      
      return {
        error: apiError,
        success: false,
      };
    }
  }

  /**
   * GET リクエスト
   */
  async get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('get', url, undefined, config);
  }

  /**
   * POST リクエスト
   */
  async post<T>(url: string, data?: RequestData, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('post', url, data, config);
  }

  /**
   * PUT リクエスト
   */
  async put<T>(url: string, data?: RequestData, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('put', url, data, config);
  }

  /**
   * DELETE リクエスト
   */
  async delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('delete', url, undefined, config);
  }

  /**
   * 認証トークンを設定
   */
  setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  /**
   * ベースURLを変更
   */
  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
    this.instance.defaults.baseURL = baseURL;
  }
}

// シングルトンインスタンス
const apiClient = new ApiClient();

export default apiClient;
export { ApiClient };
