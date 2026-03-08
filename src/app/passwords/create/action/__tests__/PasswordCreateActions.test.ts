import { createPassword } from '../PasswordCreateActions';
import { PasswordService } from '@/api/services/password/passwordService';
import { getServerAuthConfig } from '@/lib/serverAuthConfig';

jest.mock('@/api/services/password/passwordService', () => ({
  PasswordService: {
    create: jest.fn(),
  },
}));

jest.mock('@/lib/serverAuthConfig', () => ({
  getServerAuthConfig: jest.fn(),
}));

describe('createPassword', () => {
  const mockCreate = PasswordService.create as jest.MockedFunction<
    typeof PasswordService.create
  >;
  const mockGetServerAuthConfig = getServerAuthConfig as jest.MockedFunction<
    typeof getServerAuthConfig
  >;

  beforeEach(() => {
    mockCreate.mockReset();
    mockGetServerAuthConfig.mockReset();
    mockGetServerAuthConfig.mockResolvedValue({
      headers: {
        Authorization: 'Bearer token',
      },
    });
  });

  it('正しい payload で登録APIを呼び出す', async () => {
    mockCreate.mockResolvedValue({
      success: true,
      data: {},
    });

    const formData = new FormData();
    formData.set('password', 'secret');
    formData.set('application_id', '10');
    formData.set('account_id', '20');

    const result = await createPassword({}, formData);

    expect(mockCreate).toHaveBeenCalledWith(
      {
        password: {
          password: 'secret',
          application_id: 10,
          account_id: 20,
        },
      },
      {
        headers: {
          Authorization: 'Bearer token',
        },
      }
    );
    expect(result).toEqual({
      success: true,
      shouldRedirect: true,
    });
  });

  it('未入力時はフィールド単位でエラーを返す', async () => {
    mockCreate.mockResolvedValue({
      errors: {
        password: {
          password: ['パスワードを入力してください。'],
          application_id: ['アプリケーションを選択してください。'],
          account_id: ['アカウントを選択してください。'],
        },
      },
    });

    const formData = new FormData();

    const result = await createPassword({}, formData);

    expect(mockCreate).toHaveBeenCalled();
    expect(result.errors?.password?.password).toEqual([
      'パスワードを入力してください。',
    ]);
    expect(result.errors?.password?.application_id).toEqual([
      'アプリケーションを選択してください。',
    ]);
    expect(result.errors?.password?.account_id).toEqual([
      'アカウントを選択してください。',
    ]);
  });
});
