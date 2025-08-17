import { ApiResponseHandler, ErrorNotificationHandler } from '../utils';
import { ApiResponse } from '../types';

describe('ApiResponseHandler', () => {
  const successResponse: ApiResponse<{ id: number; name: string }> = {
    success: true,
    data: { id: 1, name: 'Test User' }
  };

  const errorResponse: ApiResponse<unknown> = {
    success: false,
    error: {
      message: 'Test error',
      status: 404,
      code: 'NOT_FOUND'
    }
  };

  describe('isSuccess', () => {
    it('成功レスポンスの場合trueを返す', () => {
      expect(ApiResponseHandler.isSuccess(successResponse)).toBe(true);
    });

    it('エラーレスポンスの場合falseを返す', () => {
      expect(ApiResponseHandler.isSuccess(errorResponse)).toBe(false);
    });

    it('dataが未定義の場合falseを返す', () => {
      const responseWithoutData: ApiResponse<unknown> = {
        success: true
      };
      expect(ApiResponseHandler.isSuccess(responseWithoutData)).toBe(false);
    });
  });

  describe('isError', () => {
    it('エラーレスポンスの場合trueを返す', () => {
      expect(ApiResponseHandler.isError(errorResponse)).toBe(true);
    });

    it('成功レスポンスの場合falseを返す', () => {
      expect(ApiResponseHandler.isError(successResponse)).toBe(false);
    });

    it('errorが未定義の場合falseを返す', () => {
      const responseWithoutError: ApiResponse<unknown> = {
        success: false
      };
      expect(ApiResponseHandler.isError(responseWithoutError)).toBe(false);
    });
  });

  describe('getErrorMessage', () => {
    it('エラーレスポンスからメッセージを取得する', () => {
      const message = ApiResponseHandler.getErrorMessage(errorResponse);
      expect(message).toBe('Test error');
    });

    it('エラーでない場合はデフォルトメッセージを返す', () => {
      const message = ApiResponseHandler.getErrorMessage(successResponse);
      expect(message).toBe('エラーが発生しました');
    });
  });

  describe('isStatusError', () => {
    it('指定されたステータスコードのエラーの場合trueを返す', () => {
      expect(ApiResponseHandler.isStatusError(errorResponse, 404)).toBe(true);
    });

    it('異なるステータスコードの場合falseを返す', () => {
      expect(ApiResponseHandler.isStatusError(errorResponse, 500)).toBe(false);
    });

    it('成功レスポンスの場合falseを返す', () => {
      expect(ApiResponseHandler.isStatusError(successResponse, 404)).toBe(false);
    });
  });

  describe('specific error type checks', () => {
    const createErrorResponse = (status: number): ApiResponse<unknown> => ({
      success: false,
      error: {
        message: 'Error message',
        status,
        code: 'TEST_ERROR'
      }
    });

    it('isValidationError - 422エラーを正しく判定する', () => {
      const validationError = createErrorResponse(422);
      expect(ApiResponseHandler.isValidationError(validationError)).toBe(true);
      expect(ApiResponseHandler.isValidationError(createErrorResponse(400))).toBe(false);
    });

    it('isAuthError - 401エラーを正しく判定する', () => {
      const authError = createErrorResponse(401);
      expect(ApiResponseHandler.isAuthError(authError)).toBe(true);
      expect(ApiResponseHandler.isAuthError(createErrorResponse(403))).toBe(false);
    });

    it('isForbiddenError - 403エラーを正しく判定する', () => {
      const forbiddenError = createErrorResponse(403);
      expect(ApiResponseHandler.isForbiddenError(forbiddenError)).toBe(true);
      expect(ApiResponseHandler.isForbiddenError(createErrorResponse(401))).toBe(false);
    });

    it('isNotFoundError - 404エラーを正しく判定する', () => {
      const notFoundError = createErrorResponse(404);
      expect(ApiResponseHandler.isNotFoundError(notFoundError)).toBe(true);
      expect(ApiResponseHandler.isNotFoundError(createErrorResponse(400))).toBe(false);
    });

    it('isServerError - 500エラーを正しく判定する', () => {
      const serverError = createErrorResponse(500);
      expect(ApiResponseHandler.isServerError(serverError)).toBe(true);
      expect(ApiResponseHandler.isServerError(createErrorResponse(404))).toBe(false);
    });
  });
});

describe('ErrorNotificationHandler', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('handleError', () => {
    it('401エラーを適切に処理する', () => {
      const authError: ApiResponse<unknown> = {
        success: false,
        error: {
          message: '認証エラー',
          status: 401,
          code: 'UNAUTHORIZED'
        }
      };

      ErrorNotificationHandler.handleError(authError);
      expect(consoleSpy).toHaveBeenCalledWith('認証エラー:', '認証エラー');
    });

    it('403エラーを適切に処理する', () => {
      const forbiddenError: ApiResponse<unknown> = {
        success: false,
        error: {
          message: '権限エラー',
          status: 403,
          code: 'FORBIDDEN'
        }
      };

      ErrorNotificationHandler.handleError(forbiddenError);
      expect(consoleSpy).toHaveBeenCalledWith('権限エラー:', '権限エラー');
    });

    it('404エラーを適切に処理する', () => {
      const notFoundError: ApiResponse<unknown> = {
        success: false,
        error: {
          message: 'リソースが見つかりません',
          status: 404,
          code: 'NOT_FOUND'
        }
      };

      ErrorNotificationHandler.handleError(notFoundError);
      expect(consoleSpy).toHaveBeenCalledWith('リソースが見つかりません:', 'リソースが見つかりません');
    });

    it('422バリデーションエラーを適切に処理する', () => {
      const validationError: ApiResponse<unknown> = {
        success: false,
        error: {
          message: 'バリデーションエラー',
          status: 422,
          code: 'VALIDATION_ERROR'
        }
      };

      ErrorNotificationHandler.handleError(validationError);
      expect(consoleSpy).toHaveBeenCalledWith('入力エラー:', 'バリデーションエラー');
    });

    it('500サーバーエラーを適切に処理する', () => {
      const serverError: ApiResponse<unknown> = {
        success: false,
        error: {
          message: 'サーバーエラー',
          status: 500,
          code: 'INTERNAL_SERVER_ERROR'
        }
      };

      ErrorNotificationHandler.handleError(serverError);
      expect(consoleSpy).toHaveBeenCalledWith('サーバーエラー:', 'サーバーエラー');
    });

    it('その他のエラーを適切に処理する', () => {
      const unknownError: ApiResponse<unknown> = {
        success: false,
        error: {
          message: '不明なエラー',
          status: 400,
          code: 'UNKNOWN'
        }
      };

      ErrorNotificationHandler.handleError(unknownError);
      expect(consoleSpy).toHaveBeenCalledWith('エラー:', '不明なエラー');
    });

    it('成功レスポンスの場合は何も出力しない', () => {
      const successResponse: ApiResponse<{ id: number }> = {
        success: true,
        data: { id: 1 }
      };

      ErrorNotificationHandler.handleError(successResponse);
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

  describe('handleSuccess', () => {
    let consoleLogSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
      consoleLogSpy.mockRestore();
    });

    it('成功メッセージを出力する', () => {
      const message = '操作が完了しました';
      ErrorNotificationHandler.handleSuccess(message);
      expect(consoleLogSpy).toHaveBeenCalledWith('成功:', message);
    });
  });
});
