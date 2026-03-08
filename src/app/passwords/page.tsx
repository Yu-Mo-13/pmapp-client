import React from 'react';
import PasswordList from './_components/PasswordList';
import { PasswordIndexRow } from './types';

const Page: React.FC = async () => {
  const rows: PasswordIndexRow[] = [
    {
      latest_updated_at: '2024-06-01',
      application_name: 'アプリケーション名',
      account_name: 'アカウント名',
    },
    {
      latest_updated_at: '2024-06-01',
      application_name: 'アプリケーション名',
      account_name: 'アカウント名',
    },
    {
      latest_updated_at: '2024-06-01',
      application_name: 'アプリケーション名',
      account_name: 'アカウント名',
    },
  ];

  return <PasswordList title="パスワード検索" rows={rows} />;
};

export default Page;
