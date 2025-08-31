/**
 * バックエンドから返されるバリデーションエラーを
 * フロントエンドで使いやすい形式に変換するユーティリティ関数
 */

export interface BackendValidationError {
  message: string;
  errors: Record<string, string[]>;
}

export interface FrontendValidationError {
  [key: string]: unknown;
}

/**
 * バックエンドのバリデーションエラー形式をフロントエンドの期待する形式に変換
 * 例: 'user.name' -> { user: { name: [...] } }
 * 例: 'application.name' -> { application: { name: [...] } }
 * 例: 'product.title' -> { product: { title: [...] } }
 */
export function transformValidationErrors(
  backendErrors: BackendValidationError
): FrontendValidationError {
  const transformedErrors: FrontendValidationError = {};

  if (backendErrors.errors) {
    Object.keys(backendErrors.errors).forEach(key => {
      // ドット記法のキーを階層構造に変換
      const keyParts = key.split('.');
      if (keyParts.length >= 2) {
        const [parentKey, fieldKey] = keyParts;
        
        // 親オブジェクトが存在しない場合は作成
        if (!transformedErrors[parentKey]) {
          transformedErrors[parentKey] = {};
        }
        
        // フィールドエラーを設定
        (transformedErrors[parentKey] as Record<string, string[]>)[fieldKey] = backendErrors.errors[key];
      } else {
        // ドット記法でない場合はそのまま設定
        transformedErrors[key] = backendErrors.errors[key];
      }
    });
  }

  return transformedErrors;
}

/**
 * APIレスポンスからバリデーションエラーを抽出し、変換して返す
 */
export function extractValidationErrors(
  apiResponse: { validationErrors?: unknown }
): FrontendValidationError | null {
  if (!apiResponse.validationErrors) {
    return null;
  }

  try {
    const backendErrors = apiResponse.validationErrors as BackendValidationError;
    return transformValidationErrors(backendErrors);
  } catch (error) {
    console.error('Failed to transform validation errors:', error);
    return null;
  }
}
