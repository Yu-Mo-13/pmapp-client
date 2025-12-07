import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ApiClient } from '../client';

// axios のモックアダプター
const mockAxios = new MockAdapter(axios);

// localStorageモック
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// globalにlocalStorageモックを設定
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('ApiClient', () => {
  let apiClient: ApiClient;

  beforeEach(() => {
    // 各テスト前にmockをリセット
    mockAxios.reset();
    // localStorageのモックをリセット
    jest.clearAllMocks();

    // テスト用のAPIクライアントを作成
    apiClient = new ApiClient('http://localhost:3000/api');
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('constructor', () => {
    it('デフォルトのベースURLで初期化される', () => {
      const client = new ApiClient();
      expect(client).toBeInstanceOf(ApiClient);
    });

    it('カスタムベースURLで初期化される', () => {
      const customURL = 'https://api.example.com';
      const client = new ApiClient(customURL);
      expect(client).toBeInstanceOf(ApiClient);
    });
  });

  describe('GET requests', () => {
    it('成功したGETリクエストを処理する', async () => {
      const mockData = { id: 1, name: 'Test User' };
      mockAxios.onGet('http://localhost:3000/api/users').reply(200, mockData);

      const response = await apiClient.get('/users');

      expect(response.success).toBe(true);
      expect(response.data).toEqual(mockData);
      expect(response.error).toBeUndefined();
    });

    it('認証トークンがある場合はヘッダーに含める', async () => {
      const mockData = { id: 1, name: 'Test User' };
      const token = 'test-token';

      localStorageMock.getItem.mockReturnValue(token);

      mockAxios.onGet('http://localhost:3000/api/users').reply((config) => {
        expect(config.headers?.Authorization).toBe(`Bearer ${token}`);
        return [200, mockData];
      });

      await apiClient.get('/users');
    });
  });

  describe('POST requests', () => {
    it('成功したPOSTリクエストを処理する', async () => {
      const requestData = { name: 'New User', email: 'user@example.com' };
      const responseData = { id: 1, ...requestData };

      mockAxios
        .onPost('http://localhost:3000/api/users')
        .reply(200, responseData);

      const response = await apiClient.post('/users', requestData);

      expect(response.success).toBe(true);
      expect(response.data).toEqual(responseData);
      expect(response.error).toBeUndefined();
    });
  });

  describe('PUT requests', () => {
    it('成功したPUTリクエストを処理する', async () => {
      const requestData = { name: 'Updated User' };
      const responseData = {
        id: 1,
        name: 'Updated User',
        email: 'user@example.com',
      };

      mockAxios
        .onPut('http://localhost:3000/api/users/1')
        .reply(200, responseData);

      const response = await apiClient.put('/users/1', requestData);

      expect(response.success).toBe(true);
      expect(response.data).toEqual(responseData);
      expect(response.error).toBeUndefined();
    });
  });

  describe('DELETE requests', () => {
    it('成功したDELETEリクエストを処理する', async () => {
      mockAxios.onDelete('http://localhost:3000/api/users/1').reply(200);

      const response = await apiClient.delete('/users/1');

      expect(response.success).toBe(true);
      expect(response.error).toBeUndefined();
    });
  });

  describe('Error handling', () => {
    it('401エラーを適切に処理する', async () => {
      mockAxios.onGet('http://localhost:3000/api/users').reply(401, {
        message: 'Unauthorized',
      });

      const response = await apiClient.get('/users');

      expect(response.success).toBe(false);
      expect(response.error).toBeDefined();
      expect(response.error?.status).toBe(401);
      expect(response.error?.code).toBe('UNAUTHORIZED');
      expect(response.error?.message).toBe(
        '認証が必要です。再度ログインしてください。'
      );

      // トークンがクリアされることを確認
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token');
    });

    it('403エラーを適切に処理する', async () => {
      mockAxios.onGet('http://localhost:3000/api/users').reply(403, {
        message: 'Forbidden',
      });

      const response = await apiClient.get('/users');

      expect(response.success).toBe(false);
      expect(response.error?.status).toBe(403);
      expect(response.error?.code).toBe('FORBIDDEN');
      expect(response.error?.message).toBe(
        'この操作を実行する権限がありません。'
      );
    });

    it('404エラーを適切に処理する', async () => {
      mockAxios.onGet('http://localhost:3000/api/users/999').reply(404);

      const response = await apiClient.get('/users/999');

      expect(response.success).toBe(false);
      expect(response.error?.status).toBe(404);
      expect(response.error?.code).toBe('NOT_FOUND');
      expect(response.error?.message).toBe(
        'リクエストされたリソースが見つかりません。'
      );
    });

    it('422バリデーションエラーを適切に処理する', async () => {
      const validationError = {
        message: 'Validation failed',
        errors: [{ field: 'email', message: 'Email is required' }],
      };

      mockAxios
        .onPost('http://localhost:3000/api/users')
        .reply(422, validationError);

      const response = await apiClient.post('/users', {});

      expect(response.success).toBe(false);
      expect(response.error?.status).toBe(422);
      expect(response.error?.code).toBe('VALIDATION_ERROR');
      expect(response.error?.message).toBe('Validation failed');
    });

    it('500サーバーエラーを適切に処理する', async () => {
      mockAxios.onGet('http://localhost:3000/api/users').reply(500);

      const response = await apiClient.get('/users');

      expect(response.success).toBe(false);
      expect(response.error?.status).toBe(500);
      expect(response.error?.code).toBe('INTERNAL_SERVER_ERROR');
      expect(response.error?.message).toBe(
        'サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。'
      );
    });

    it('ネットワークエラーを適切に処理する', async () => {
      mockAxios.onGet('http://localhost:3000/api/users').networkError();

      const response = await apiClient.get('/users');

      expect(response.success).toBe(false);
      expect(response.error).toBeDefined();
      expect(response.error?.status).toBe(500); // デフォルトステータス
    });
  });

  describe('Authentication token management', () => {
    it('認証トークンを設定できる', () => {
      const token = 'new-auth-token';

      apiClient.setAuthToken(token);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'auth_token',
        token
      );
    });

    it('ベースURLを変更できる', () => {
      const newBaseURL = 'https://new-api.example.com';

      apiClient.setBaseURL(newBaseURL);

      // 変更が正常に行われたかを確認するため、リクエストを送信
      mockAxios.onGet('https://new-api.example.com/test').reply(200, {});

      expect(async () => {
        await apiClient.get('/test');
      }).not.toThrow();
    });
  });

  describe('Request configuration', () => {
    it('カスタムヘッダーを含むリクエストを送信できる', async () => {
      const customHeaders = { 'X-Custom-Header': 'custom-value' };

      mockAxios.onGet('http://localhost:3000/api/users').reply((config) => {
        expect(config.headers?.['X-Custom-Header']).toBe('custom-value');
        return [200, {}];
      });

      await apiClient.get('/users', {
        headers: customHeaders,
      });
    });

    it('カスタムタイムアウトを設定できる', async () => {
      const customTimeout = 5000;

      mockAxios.onGet('http://localhost:3000/api/users').reply((config) => {
        expect(config.timeout).toBe(customTimeout);
        return [200, {}];
      });

      await apiClient.get('/users', {
        timeout: customTimeout,
      });
    });
  });
});
