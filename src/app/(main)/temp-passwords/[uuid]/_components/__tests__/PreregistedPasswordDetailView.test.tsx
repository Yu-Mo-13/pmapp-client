import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { PasswordService } from '@/api/services/password/passwordService';
import { PreregistedPasswordService } from '@/api/services/preregistedPassword/preregistedPasswordService';
import PreregistedPasswordDetailView from '../PreregistedPasswordDetailView';

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

describe('PreregistedPasswordDetailView', () => {
  const mockPush = jest.fn();
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

  const item = {
    uuid: 'pre-uuid',
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

  it('本登録成功後に仮登録パスワードを削除して一覧へ遷移する', async () => {
    const user = userEvent.setup();

    jest.spyOn(PasswordService, 'create').mockResolvedValue({
      success: true,
      data: {},
    });
    jest.spyOn(PreregistedPasswordService, 'delete').mockResolvedValue({
      success: true,
      data: {},
    });

    render(<PreregistedPasswordDetailView item={item} />);

    await user.click(screen.getByRole('button', { name: '登録' }));

    await waitFor(() => {
      expect(PasswordService.create).toHaveBeenCalledWith({
        password: {
          password: 'secret',
          application_id: 1,
          account_id: 2,
        },
      });
      expect(PreregistedPasswordService.delete).toHaveBeenCalledWith('pre-uuid');
      expect(mockPush).toHaveBeenCalledWith('/temp-passwords');
    });
  });

  it('削除失敗時は一覧へ遷移しない', async () => {
    const user = userEvent.setup();

    jest.spyOn(PasswordService, 'create').mockResolvedValue({
      success: true,
      data: {},
    });
    jest.spyOn(PreregistedPasswordService, 'delete').mockResolvedValue({
      success: false,
      error: { message: 'not found', status: 404 },
    });

    render(<PreregistedPasswordDetailView item={item} />);

    await user.click(screen.getByRole('button', { name: '登録' }));

    await waitFor(() => {
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('モバイル向けに詳細項目と操作ボタンを縦積みレイアウトで表示する', () => {
    render(<PreregistedPasswordDetailView item={item} />);

    expect(screen.getByText('アプリケーション').parentElement).toHaveClass('flex', 'flex-col', 'gap-2');
    expect(screen.getByText('アカウント名').parentElement).toHaveClass('flex', 'flex-col', 'gap-2');
    expect(
      screen.getByRole('link', { name: 'キャンセル' }).parentElement?.parentElement
    ).toHaveClass('flex', 'flex-row', 'justify-center', 'gap-4');
    expect(screen.getByRole('link', { name: 'キャンセル' })).toHaveClass('w-[162px]', 'md:w-auto');
    expect(screen.getByRole('button', { name: '登録' })).toHaveClass('w-[162px]', 'md:w-36');
  });

  it('パスワード欄でSPは24x24相当、PCは44x24相当の表示領域を持つ', () => {
    render(<PreregistedPasswordDetailView item={item} />);

    expect(screen.getByDisplayValue('secret')).toHaveClass(
      'px-4',
      'py-3',
      'border-gray-300'
    );
    expect(screen.getByRole('button', { name: 'パスワードを表示する' })).toHaveClass(
      'size-6',
      'md:h-6',
      'md:w-11'
    );
    expect(
      screen.getByRole('button', { name: 'パスワードを表示する' }).querySelector('img')
    ).toHaveAttribute('width', '44');
    expect(
      screen.getByRole('button', { name: 'パスワードを表示する' }).querySelector('img')
    ).toHaveAttribute('height', '24');
  });
});
