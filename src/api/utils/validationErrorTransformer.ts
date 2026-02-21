/**
 * バックエンドから返されるバリデーションエラーを
 * フロントエンドで使いやすい形式に変換するユーティリティ関数
 */

export interface BackendValidationError {
  message: string;
  errors: Record<string, string[]> | ValidationErrorItem[];
}

export interface ValidationErrorItem {
  field?: string;
  message: string;
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
  const setError = (key: string, messages: string[]) => {
    const keyParts = key.split('.');
    if (keyParts.length >= 2) {
      const [parentKey, fieldKey] = keyParts;
      if (!transformedErrors[parentKey]) {
        transformedErrors[parentKey] = {};
      }
      const parent = transformedErrors[parentKey] as Record<string, string[]>;
      parent[fieldKey] = [...(parent[fieldKey] || []), ...messages];
      return;
    }
    transformedErrors[key] = [
      ...(((transformedErrors[key] as string[]) || []) as string[]),
      ...messages,
    ];
  };

  if (backendErrors.errors) {
    if (Array.isArray(backendErrors.errors)) {
      backendErrors.errors.forEach(({ field, message }) => {
        if (!message) {
          return;
        }
        setError(field || 'base', [message]);
      });
      return transformedErrors;
    }

    const recordErrors = backendErrors.errors as Record<string, string[]>;
    Object.keys(recordErrors).forEach((key) => {
      setError(key, recordErrors[key]);
    });
  }

  return transformedErrors;
}

/**
 * APIレスポンスからバリデーションエラーを抽出し、変換して返す
 */
export function extractValidationErrors(apiResponse: {
  validationErrors?: unknown;
}): FrontendValidationError | null {
  if (!apiResponse.validationErrors) {
    return null;
  }

  try {
    const backendErrors =
      apiResponse.validationErrors as BackendValidationError;
    return transformValidationErrors(backendErrors);
  } catch (error) {
    console.error('Failed to transform validation errors:', error);
    return null;
  }
}
