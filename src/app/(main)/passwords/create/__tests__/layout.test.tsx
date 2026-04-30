import PasswordCreateLayout from '../layout';
import { authorizePageAccess, APP_USER_ROLES } from '@/lib/authorization';

jest.mock('@/lib/authorization', () => ({
  authorizePageAccess: jest.fn(),
  APP_USER_ROLES: {
    admin: 'admin',
    general: 'general',
    mobile: 'mobile',
  },
}));

describe('passwords/create layout', () => {
  const mockAuthorizePageAccess =
    authorizePageAccess as jest.MockedFunction<typeof authorizePageAccess>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('モバイルユーザーを許可せず admin と general のみ通す', async () => {
    const result = await PasswordCreateLayout({
      children: <div>password create</div>,
    });

    expect(mockAuthorizePageAccess).toHaveBeenCalledWith([
      APP_USER_ROLES.admin,
      APP_USER_ROLES.general,
    ]);
    expect(result.props.children).toEqual(<div>password create</div>);
  });
});
