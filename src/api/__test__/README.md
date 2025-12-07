# API Client Tests

APIクライアントのユニットテストスイートです。Jest と axios-mock-adapter を使用してテストを実行しています。

## テスト構成

```
src/api/__test__/
├── client.test.ts          # APIクライアントのテスト
├── utils.test.ts           # ユーティリティ関数のテスト
├── userService.test.ts     # UserServiceのテスト
├── productService.test.ts  # ProductServiceのテスト
└── README.md              # このファイル
```

## テストの実行方法

### 全てのテストを実行

```bash
npm test
```

### 特定のテストファイルを実行

```bash
npm test client.test.ts
npm test userService.test.ts
```

### ウォッチモードでテストを実行

```bash
npm run test:watch
```

### カバレッジレポートを生成

```bash
npm run test:coverage
```

## テスト内容

### 1. APIクライアント (`client.test.ts`)

- ✅ コンストラクタのテスト
- ✅ GET/POST/PUT/DELETEリクエストのテスト
- ✅ エラーハンドリング（401、403、404、422、500）
- ✅ 認証トークン管理
- ✅ リクエスト設定（ヘッダー、タイムアウト）

### 2. ユーティリティ (`utils.test.ts`)

- ✅ ApiResponseHandler の各メソッド
- ✅ エラータイプ判定（認証、権限、バリデーション等）
- ✅ ErrorNotificationHandler のエラー処理

### 3. UserService (`userService.test.ts`)

- ✅ ユーザー一覧取得
- ✅ 特定ユーザー取得
- ✅ ユーザー作成・更新・削除
- ✅ ログイン・ログアウト
- ✅ エラーケース（404、422、401、403、500）

### 4. ProductService (`productService.test.ts`)

- ✅ プロダクト一覧取得（ページング含む）
- ✅ 特定プロダクト取得
- ✅ プロダクト作成・更新・削除
- ✅ カテゴリ別プロダクト取得
- ✅ エラーケース（404、422、403、500）

## モック設定

### LocalStorage

```javascript
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;
```

### Axios

```javascript
import MockAdapter from 'axios-mock-adapter';
const mockAxios = new MockAdapter(axios);
```

## テストパターン

### 成功ケース

- 正常なレスポンスの処理
- データの正確性
- 副作用（トークン保存等）の確認

### エラーケース

- 各HTTPステータスコードの処理
- エラーメッセージの適切な設定
- エラー時の副作用処理

### エッジケース

- 空のデータ
- 無効なパラメータ
- ネットワークエラー

## 新しいテストの追加

新しいサービスにテストを追加する場合：

1. `src/api/__test__/` にテストファイルを作成
2. 必要なmockを設定
3. 成功・エラー・エッジケースをカバー
4. レスポンス形式とエラーハンドリングを確認

### テストファイルのテンプレート

```typescript
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { YourService } from '../services/yourService';

const mockAxios = new MockAdapter(axios);

describe('YourService', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('yourMethod', () => {
    it('正常ケースのテスト', async () => {
      // テストコード
    });

    it('エラーケースのテスト', async () => {
      // テストコード
    });
  });
});
```

## 注意事項

- テスト実行前に必ずmockをリセットする
- 副作用（localStorage操作等）は必ずテストで確認する
- エラーケースのテストを網羅的に実施する
- レスポンス形式の型安全性を確認する
