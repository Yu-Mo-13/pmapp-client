import React from 'react';
import { render, screen } from '@testing-library/react';
import PreregistedPasswordTr from '../PreregistedPasswordTr';

describe('PreregistedPasswordTr', () => {
  const row = {
    uuid: 'pre-uuid',
    created_at: '2026-02-28T12:00:00+09:00',
    application_name: 'GitHub',
    account_name: 'octocat',
  };

  it('カード表示で必要な情報を表示する', () => {
    render(<PreregistedPasswordTr row={row} variant="card" />);

    expect(screen.getByText('登録日: 2026-02-28')).toBeInTheDocument();
    expect(
      screen.getByText('アプリケーション名: GitHub')
    ).toBeInTheDocument();
    expect(screen.getByText('アカウント名: octocat')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/temp-passwords/pre-uuid'
    );
  });
});
