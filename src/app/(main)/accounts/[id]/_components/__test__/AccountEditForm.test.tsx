import React, { useActionState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccountService } from '@/api/services/account/accountService';
import AccountEditForm from '../AccountEditForm';

const mockPush = jest.fn();
const mockFormAction = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('react', () => {
  const actual = jest.requireActual('react');
  return {
    ...actual,
    useActionState: jest.fn(),
  };
});

const baseFormState = {
  errors: undefined,
  success: false,
  shouldRedirect: false,
};

describe('AccountEditForm', () => {
  const account = {
    id: 10,
    name: 'GitHub',
    application_id: 1,
    notice_class: true,
    application: {
      id: 1,
      name: 'Web App',
      account_class: true,
      notice_class: true,
      mark_class: false,
      pre_password_size: 8,
    },
  };

  beforeEach(() => {
    (useActionState as unknown as jest.Mock).mockReturnValue([
      baseFormState,
      mockFormAction,
    ]);
  });

  it('初期値を表示し、アカウント名入力を更新できる', async () => {
    const user = userEvent.setup();

    render(<AccountEditForm account={account} />);

    const nameInput = screen.getByLabelText('アカウント名') as HTMLInputElement;

    expect(nameInput.value).toBe('GitHub');
    expect(screen.getByText('Web App')).toBeInTheDocument();

    await user.clear(nameInput);
    await user.type(nameInput, 'Slack');

    expect(nameInput.value).toBe('Slack');
    expect(screen.getByDisplayValue('10')).toHaveAttribute('name', 'id');
  });

  it('バリデーションエラーを表示する', () => {
    (useActionState as unknown as jest.Mock).mockReturnValue([
      {
        errors: {
          account: {
            name: ['名前は必須です'],
            notice_class: ['通知区分を選択してください'],
          },
        },
        success: false,
        shouldRedirect: false,
      },
      mockFormAction,
    ]);

    render(<AccountEditForm account={account} />);

    expect(screen.getByText('名前は必須です')).toBeInTheDocument();
    expect(screen.getByText('通知区分を選択してください')).toBeInTheDocument();
  });

  it('更新成功時に一覧画面へ遷移する', async () => {
    (useActionState as unknown as jest.Mock).mockReturnValue([
      {
        errors: undefined,
        success: true,
        shouldRedirect: true,
      },
      mockFormAction,
    ]);

    render(<AccountEditForm account={account} />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/accounts');
    });
  });

  it('削除成功時に一覧画面へ遷移する', async () => {
    const user = userEvent.setup();

    jest.spyOn(AccountService, 'delete').mockResolvedValue({
      success: true,
    });

    render(<AccountEditForm account={account} />);

    await user.click(screen.getByRole('button', { name: '削除する' }));
    await user.type(screen.getByPlaceholderText('delete'), 'delete');
    await user.click(screen.getByRole('button', { name: '確認' }));

    await waitFor(() => {
      expect(AccountService.delete).toHaveBeenCalledWith(10);
      expect(mockPush).toHaveBeenCalledWith('/accounts');
    });
  });

  it('削除失敗時はエラーメッセージを表示する', async () => {
    const user = userEvent.setup();
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    jest.spyOn(AccountService, 'delete').mockResolvedValue({
      success: false,
      error: { message: 'failed', status: 500 },
    });

    render(<AccountEditForm account={account} />);

    await user.click(screen.getByRole('button', { name: '削除する' }));
    await user.type(screen.getByPlaceholderText('delete'), 'delete');
    await user.click(screen.getByRole('button', { name: '確認' }));

    await waitFor(() => {
      expect(AccountService.delete).toHaveBeenCalledWith(10);
      expect(alertSpy).toHaveBeenCalledWith('削除に失敗しました。');
      expect(mockPush).not.toHaveBeenCalledWith('/accounts');
    });

    alertSpy.mockRestore();
  });

  it('削除処理で例外発生時はエラーメッセージを表示する', async () => {
    const user = userEvent.setup();
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    jest.spyOn(AccountService, 'delete').mockRejectedValue(
      new Error('network error')
    );

    render(<AccountEditForm account={account} />);

    await user.click(screen.getByRole('button', { name: '削除する' }));
    await user.type(screen.getByPlaceholderText('delete'), 'delete');
    await user.click(screen.getByRole('button', { name: '確認' }));

    await waitFor(() => {
      expect(AccountService.delete).toHaveBeenCalledWith(10);
      expect(alertSpy).toHaveBeenCalledWith('削除中にエラーが発生しました。');
      expect(mockPush).not.toHaveBeenCalledWith('/accounts');
    });

    alertSpy.mockRestore();
  });
});
