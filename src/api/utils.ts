import { ApiResponse, ApiError } from './types';

/**
 * APIレスポンスのエラーハンドリングヘルパー
 */
export class ApiResponseHandler {
  /**
   * APIレスポンスが成功かどうかを判定
   */
  static isSuccess<T>(
    response: ApiResponse<T>
  ): response is ApiResponse<T> & { success: true; data: T } {
    return response.success && response.data !== undefined;
  }

  /**
   * APIレスポンスが失敗かどうかを判定
   */
  static isError<T>(
    response: ApiResponse<T>
  ): response is ApiResponse<T> & { success: false; error: ApiError } {
    return !response.success && response.error !== undefined;
  }

  /**
   * エラーメッセージを取得
   */
  static getErrorMessage<T>(response: ApiResponse<T>): string {
    if (this.isError(response)) {
      return response.error.message;
    }
    return 'エラーが発生しました';
  }

  /**
   * 特定のステータスコードのエラーかどうかを判定
   */
  static isStatusError<T>(response: ApiResponse<T>, status: number): boolean {
    return this.isError(response) && response.error.status === status;
  }

  /**
   * バリデーションエラーかどうかを判定
   */
  static isValidationError<T>(response: ApiResponse<T>): boolean {
    return this.isStatusError(response, 422);
  }

  /**
   * 認証エラーかどうかを判定
   */
  static isAuthError<T>(response: ApiResponse<T>): boolean {
    return this.isStatusError(response, 401);
  }

  /**
   * 権限エラーかどうかを判定
   */
  static isForbiddenError<T>(response: ApiResponse<T>): boolean {
    return this.isStatusError(response, 403);
  }

  /**
   * Not Foundエラーかどうかを判定
   */
  static isNotFoundError<T>(response: ApiResponse<T>): boolean {
    return this.isStatusError(response, 404);
  }

  /**
   * サーバーエラーかどうかを判定
   */
  static isServerError<T>(response: ApiResponse<T>): boolean {
    return this.isStatusError(response, 500);
  }
}

/**
 * APIエラーを通知するためのヘルパー
 * 実際のプロジェクトでは、toastライブラリやモーダルを使用
 */
export class ErrorNotificationHandler {
  /**
   * エラーに応じた適切な通知を表示
   */
  static handleError<T>(response: ApiResponse<T>): void {
    if (!ApiResponseHandler.isError(response)) {
      return;
    }

    const error = response.error;

    switch (error.status) {
      case 401:
        console.error('認証エラー:', error.message);
        // 実際の実装では、ログイン画面にリダイレクトなど
        break;
      case 403:
        console.error('権限エラー:', error.message);
        // 実際の実装では、権限不足の通知など
        break;
      case 404:
        console.error('リソースが見つかりません:', error.message);
        break;
      case 422:
        console.error('入力エラー:', error.message);
        // 実際の実装では、フォームのバリデーションエラー表示など
        break;
      case 500:
        console.error('サーバーエラー:', error.message);
        break;
      default:
        console.error('エラー:', error.message);
    }
  }

  /**
   * 成功メッセージを表示
   */
  static handleSuccess(message: string): void {
    console.log('成功:', message);
    // 実際の実装では、成功トーストなど
  }
}
