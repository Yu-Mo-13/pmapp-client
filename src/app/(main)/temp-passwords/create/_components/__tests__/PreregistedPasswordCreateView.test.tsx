import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { PreregistedPasswordService } from '@/api/services/preregistedPassword/preregistedPasswordService';
import PreregistedPasswordCreateView from '../PreregistedPasswordCreateView';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('PreregistedPasswordCreateView', () => {
  const mockPush = jest.fn();
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

  const item = {
    application: {
      id: 1,
      name: 'GitHub',
    },
    account: {
      id: 2,
      name: 'octocat',
    },
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

  it('仮登録成功後に一覧へ遷移する', async () => {
    const user = userEvent.setup();

    jest.spyOn(PreregistedPasswordService, 'create').mockResolvedValue({
      success: true,
      data: {},
    });

    render(<PreregistedPasswordCreateView item={item} />);

    await user.click(screen.getByRole('button', { name: '仮登録' }));

    await waitFor(() => {
      expect(PreregistedPasswordService.create).toHaveBeenCalledWith({
        preregisted_password: {
          application_id: 1,
          account_id: 2,
        },
      });
      expect(mockPush).toHaveBeenCalledWith('/temp-passwords');
    });
  });

  it('アカウントなしのアプリでも仮登録リクエストを送信する', async () => {
    const user = userEvent.setup();

    jest.spyOn(PreregistedPasswordService, 'create').mockResolvedValue({
      success: true,
      data: {},
    });

    render(
      <PreregistedPasswordCreateView
        item={{
          application: {
            id: 3,
            name: 'アカウントなしアプリ',
          },
          account: null,
        }}
      />
    );

    await user.click(screen.getByRole('button', { name: '仮登録' }));

    await waitFor(() => {
      expect(PreregistedPasswordService.create).toHaveBeenCalledWith({
        preregisted_password: {
          application_id: 3,
        },
      });
    });
  });

  it('バリデーションエラーを表示する', async () => {
    const user = userEvent.setup();

    jest.spyOn(PreregistedPasswordService, 'create').mockResolvedValue({
      errors: {
        preregisted_password: {
          account_id: ['アカウントが不正です'],
        },
      },
    });

    render(<PreregistedPasswordCreateView item={item} />);

    await user.click(screen.getByRole('button', { name: '仮登録' }));

    expect(await screen.findByText('アカウントが不正です')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('モバイル向けに詳細項目と操作ボタンを縦積みレイアウトで表示する', () => {
    render(<PreregistedPasswordCreateView item={item} />);

    expect(screen.getByText('アプリケーション').parentElement).toHaveClass(
      'flex',
      'flex-col',
      'gap-2'
    );
    expect(screen.getByText('アカウント名').parentElement).toHaveClass(
      'flex',
      'flex-col',
      'gap-2'
    );
    expect(
      screen.getByRole('link', { name: 'キャンセル' }).parentElement?.parentElement
    ).toHaveClass('flex', 'flex-row', 'justify-center', 'gap-4');
    expect(screen.getByRole('link', { name: 'キャンセル' })).toHaveClass(
      'w-[162px]',
      'md:w-auto'
    );
    expect(screen.getByRole('button', { name: '仮登録' })).toHaveClass(
      'w-[162px]',
      'md:w-36'
    );
  });
});
