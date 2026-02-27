import React from 'react';
import { redirect } from 'next/navigation';
import {
  extractUnregistedPasswordIndexRows,
  UnregistedPasswordService,
} from '@/api/services/unregistedPassword/unregistedPasswordService';
import { getServerAuthConfig } from '@/lib/serverAuthConfig';
import UnregistedPasswordList from './_components/UnregistedPasswordList';

const Page: React.FC = async () => {
  const authConfig = await getServerAuthConfig();
  const response = await UnregistedPasswordService.index(authConfig);
  if (!response.success && response.error?.status === 401) {
    redirect('/login');
  }

  const rows = response.success
    ? extractUnregistedPasswordIndexRows(response.data)
    : [];

  return (
    <UnregistedPasswordList
      title="未登録パスワード一覧"
      rows={rows}
      errorMessage={response.success ? undefined : response.error?.message}
    />
  );
};

export default Page;
