import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasswordService } from '@/api/services/password/passwordService';
import PasswordTr from '../PasswordTr';

describe('PasswordTr', () => {
  const onActionMessage = jest.fn();
  const row = {
    application_id: 10,
    account_id: 20,
    latest_updated_at: '2026-03-08T12:34:00+09:00',
    application_name: 'GitHub',
    account_name: 'octocat',
  };

  beforeEach(() => {
    onActionMessage.mockReset();
  });

  it('取得成功時にコピー完了メッセージを表示する', async () => {
    const user = userEvent.setup();

    jest.spyOn(PasswordService, 'latest').mockResolvedValue({
      success: true,
      data: { password: 'secret-password' },
    });

    render(
      <table>
        <tbody>
          <PasswordTr row={row} onActionMessage={onActionMessage} />
        </tbody>
      </table>
    );

    await user.click(screen.getByRole('button', { name: '取得' }));

    await waitFor(() => {
      expect(PasswordService.latest).toHaveBeenCalledWith({
        application_id: 10,
        account_id: 20,
      });
      expect(onActionMessage).toHaveBeenLastCalledWith({
        type: 'success',
        text: 'パスワードをコピーしました。',
      });
    });
  });

  it('account_id が null のときは application_id のみで取得する', async () => {
    const user = userEvent.setup();

    jest.spyOn(PasswordService, 'latest').mockResolvedValue({
      success: true,
      data: { password: 'secret-password' },
    });

    render(
      <table>
        <tbody>
          <PasswordTr
            row={{ ...row, account_id: null, account_name: 'アカウントなし' }}
            onActionMessage={onActionMessage}
          />
        </tbody>
      </table>
    );

    await user.click(screen.getByRole('button', { name: '取得' }));

    await waitFor(() => {
      expect(PasswordService.latest).toHaveBeenCalledWith({
        application_id: 10,
      });
    });
  });

  it('404 時は共通文言を表示する', async () => {
    const user = userEvent.setup();

    jest.spyOn(PasswordService, 'latest').mockResolvedValue({
      success: false,
      error: { message: 'not found', status: 404 },
    });

    render(
      <table>
        <tbody>
          <PasswordTr row={row} onActionMessage={onActionMessage} />
        </tbody>
      </table>
    );

    await user.click(screen.getByRole('button', { name: '取得' }));

    await waitFor(() => {
      expect(onActionMessage).toHaveBeenLastCalledWith({
        type: 'error',
        text: '最新パスワードが見つかりません。条件を確認してください。',
      });
    });
  });

  it('クリップボードAPIが使えない場合はエラーメッセージを表示する', async () => {
    const user = userEvent.setup();

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: undefined,
    });
    jest.spyOn(PasswordService, 'latest').mockResolvedValue({
      success: true,
      data: { password: 'secret-password' },
    });

    render(
      <table>
        <tbody>
          <PasswordTr row={row} onActionMessage={onActionMessage} />
        </tbody>
      </table>
    );

    await user.click(screen.getByRole('button', { name: '取得' }));

    await waitFor(() => {
      expect(onActionMessage).toHaveBeenLastCalledWith({
        type: 'error',
        text: 'パスワードのコピーに失敗しました。',
      });
    });
  });
});
