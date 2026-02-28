import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { PasswordService } from '@/api/services/password/passwordService';
import { UnregistedPasswordService } from '@/api/services/unregistedPassword/unregistedPasswordService';
import UnregistedPasswordDetailView from '../UnregistedPasswordDetailView';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next/image', () => {
  return function MockImage({
    src,
    alt,
    width,
    height,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
  }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} width={width} height={height} />;
  };
});

describe('UnregistedPasswordDetailView', () => {
  const mockPush = jest.fn();
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

  const item = {
    uuid: 'unreg-uuid',
    password: 'secret',
    application_id: 1,
    account_id: 2,
    created_at: '2026-02-28T12:00:00+09:00',
    application_name: 'GitHub',
    account_name: 'octocat',
  };

  beforeEach(() => {
    jest.restoreAllMocks();
    mockPush.mockReset();
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    } as ReturnType<typeof useRouter>);
  });

  it('本登録成功後に未登録パスワードを削除して一覧へ遷移する', async () => {
    const user = userEvent.setup();

    jest.spyOn(PasswordService, 'create').mockResolvedValue({
      success: true,
      data: {},
    });
    jest.spyOn(UnregistedPasswordService, 'delete').mockResolvedValue({
      success: true,
      data: {},
    });

    render(<UnregistedPasswordDetailView item={item} />);

    await user.click(screen.getByRole('button', { name: '登録' }));

    await waitFor(() => {
      expect(PasswordService.create).toHaveBeenCalledWith({
        password: {
          password: 'secret',
          application_id: 1,
          account_id: 2,
        },
      });
      expect(UnregistedPasswordService.delete).toHaveBeenCalledWith('unreg-uuid');
      expect(mockPush).toHaveBeenCalledWith('/unregisted-passwords');
    });
  });

  it('削除失敗時は一覧へ遷移しない', async () => {
    const user = userEvent.setup();

    jest.spyOn(PasswordService, 'create').mockResolvedValue({
      success: true,
      data: {},
    });
    jest.spyOn(UnregistedPasswordService, 'delete').mockResolvedValue({
      success: false,
      error: { message: 'not found', status: 404 },
    });

    render(<UnregistedPasswordDetailView item={item} />);

    await user.click(screen.getByRole('button', { name: '登録' }));

    await waitFor(() => {
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
