import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasswordService } from '@/api/services/password/passwordService';
import { formatDateTimeToMinute } from '@/lib/dateFormat';
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
    jest.restoreAllMocks();
  });

  const mockExecCommand = ({
    result,
    dispatchCopyEvent = false,
  }: {
    result: boolean;
    dispatchCopyEvent?: boolean;
  }) => {
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: jest.fn().mockImplementation(() => {
        if (dispatchCopyEvent) {
          const event = new Event('copy', {
            bubbles: true,
            cancelable: true,
          }) as ClipboardEvent;

          Object.defineProperty(event, 'clipboardData', {
            configurable: true,
            value: {
              setData: jest.fn(),
            },
          });

          document.dispatchEvent(event);
        }

        return result;
      }),
    });
  };

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

    await user.click(screen.getByRole('button'));

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

    await user.click(screen.getByRole('button'));

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

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(onActionMessage).toHaveBeenLastCalledWith({
        type: 'error',
        text: '最新パスワードが見つかりません。条件を確認してください。',
      });
    });
  });

  it('クリップボードAPIが使えない場合はフォールバックでコピーする', async () => {
    const user = userEvent.setup();

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: undefined,
    });
    mockExecCommand({ result: true, dispatchCopyEvent: true });
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
        type: 'success',
        text: 'パスワードをコピーしました。',
      });
    });
  });

  it('Clipboard API が失敗した場合はフォールバックでコピーする', async () => {
    const user = userEvent.setup();

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: jest.fn().mockRejectedValue(new Error('copy failed')),
      },
    });
    mockExecCommand({ result: true, dispatchCopyEvent: true });
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
        type: 'success',
        text: 'パスワードをコピーしました。',
      });
    });
  });

  it('フォールバックでもコピーできない場合はエラーメッセージを表示する', async () => {
    const user = userEvent.setup();

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: undefined,
    });
    mockExecCommand({ result: false });
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

    expect(
      screen.getByRole('dialog', {
        name: 'パスワードを手動でコピーしてください',
      })
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue('secret-password')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '閉じる' }));

    expect(
      screen.queryByRole('dialog', {
        name: 'パスワードを手動でコピーしてください',
      })
    ).not.toBeInTheDocument();
  });

  it('カード表示でも取得操作ができる', async () => {
    const user = userEvent.setup();

    jest.spyOn(PasswordService, 'latest').mockResolvedValue({
      success: true,
      data: { password: 'secret-password' },
    });

    render(
      <PasswordTr row={row} onActionMessage={onActionMessage} variant="card" />
    );

    expect(
      screen.getByText(`更新日: ${formatDateTimeToMinute(row.latest_updated_at)}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText('アプリケーション名: GitHub')
    ).toBeInTheDocument();
    expect(screen.getByText('アカウント名: octocat')).toBeInTheDocument();

    await user.click(screen.getByRole('button'));

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
});
