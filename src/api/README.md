# API Client

axiosを使用したAPIクライアントライブラリです。GET、POST、PUT、DELETEリクエストとレスポンスハンドリング（200、401、403、404、422、500）を実装しています。

## 構成

```
src/api/
├── client.ts          # メインのAPIクライアント
├── types.ts           # 型定義
├── utils.ts           # ヘルパー関数
├── index.ts           # メインエクスポート
└── services/
    ├── index.ts       # サービスのエクスポート集約
    ├── userService.ts # ユーザー関連API
    └── productService.ts # プロダクト関連API（例）
```

## 基本的な使用方法

### 1. 直接APIクライアントを使用

```typescript
import apiClient from '@/api/client';

// GETリクエスト
const response = await apiClient.get<User[]>('/users');
if (response.success) {
  console.log('ユーザー一覧:', response.data);
} else {
  console.error('エラー:', response.error?.message);
}

// POSTリクエスト
const createResponse = await apiClient.post<User>('/users', {
  name: '田中太郎',
  email: 'tanaka@example.com'
});

// PUTリクエスト
const updateResponse = await apiClient.put<User>('/users/1', {
  name: '田中次郎'
});

// DELETEリクエスト
const deleteResponse = await apiClient.delete('/users/1');
```

### 2. サービスクラスを使用

```typescript
import { UserService } from '@/api/services/userService';
import { ApiResponseHandler, ErrorNotificationHandler } from '@/api/utils';

// ユーザー一覧取得
const response = await UserService.getUsers();

if (ApiResponseHandler.isSuccess(response)) {
  console.log('ユーザー一覧:', response.data);
} else {
  ErrorNotificationHandler.handleError(response);
}

// ログイン
const loginResponse = await UserService.login({
  email: 'user@example.com',
  password: 'password123'
});

if (ApiResponseHandler.isSuccess(loginResponse)) {
  console.log('ログイン成功:', loginResponse.data.user);
  // トークンは自動的に保存される
} else {
  ErrorNotificationHandler.handleError(loginResponse);
}
```

## エラーハンドリング

### ステータスコード別の処理

APIクライアントは以下のステータスコードを自動的にハンドリングします：

- **200**: 成功
- **401**: 認証エラー（トークンをクリアし、ログイン画面へリダイレクト）
- **403**: 権限エラー
- **404**: リソースが見つからない
- **422**: バリデーションエラー
- **500**: サーバーエラー

### エラーハンドリングの例

```typescript
import { ApiResponseHandler } from '@/api/utils';

const response = await UserService.getUser(1);

// 成功/失敗の判定
if (ApiResponseHandler.isSuccess(response)) {
  // 成功時の処理
  const user = response.data;
  console.log('ユーザー情報:', user);
} else {
  // エラー時の処理
  const errorMessage = ApiResponseHandler.getErrorMessage(response);
  
  // 特定のエラータイプの判定
  if (ApiResponseHandler.isNotFoundError(response)) {
    console.log('ユーザーが見つかりません');
  } else if (ApiResponseHandler.isAuthError(response)) {
    console.log('認証が必要です');
  } else {
    console.error('エラー:', errorMessage);
  }
}
```

## カスタム設定

### ベースURLの変更

```typescript
import apiClient from '@/api/client';

apiClient.setBaseURL('https://api.example.com');
```

### 認証トークンの設定

```typescript
import apiClient from '@/api/client';

// トークンを設定（localStorage に自動保存）
apiClient.setAuthToken('your-jwt-token');
```

### リクエストヘッダーのカスタマイズ

```typescript
const response = await apiClient.get('/users', {
  headers: {
    'X-Custom-Header': 'value'
  },
  timeout: 5000
});
```

## 環境変数

`.env.local` ファイルでAPIのベースURLを設定できます：

```
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```

## 新しいサービスの追加

新しいAPIエンドポイント用のサービスを追加する場合：

1. `src/api/services/` ディレクトリに新しいサービスファイルを作成
2. 必要な型定義を追加
3. APIクライアントを使用してメソッドを実装
4. `src/api/services/index.ts` でエクスポートを追加

例：

```typescript
// src/api/services/orderService.ts
import apiClient from '../client';
import { ApiResponse, RequestData } from '../types';

export interface Order {
  id: number;
  userId: number;
  total: number;
  status: string;
}

export class OrderService {
  static async getOrders(): Promise<ApiResponse<Order[]>> {
    return apiClient.get<Order[]>('/orders');
  }
  
  // その他のメソッド...
}
```

```typescript
// src/api/services/index.ts に追加
export { OrderService } from './orderService';
export type { Order } from './orderService';
```

この構成により、メインの `index.ts` ファイルの肥大化を防ぎ、各サービスの管理を `services/index.ts` に集約できます。
