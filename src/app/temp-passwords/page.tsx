import React from 'react';
import { redirect } from 'next/navigation';
import {
  extractPreregistedPasswordIndexRows,
  PreregistedPasswordService,
} from '@/api/services/preregistedPassword/preregistedPasswordService';
import { getServerAuthConfig } from '@/lib/serverAuthConfig';
import PreregistedPasswordList from './_components/PreregistedPasswordList';

const Page: React.FC = async () => {
  const authConfig = await getServerAuthConfig();
  const response = await PreregistedPasswordService.index(authConfig);
  if (!response.success && response.error?.status === 401) {
    redirect('/login');
  }

  const rows = response.success
    ? extractPreregistedPasswordIndexRows(response.data)
    : [];

  return (
    <PreregistedPasswordList
      title="仮登録パスワード一覧"
      rows={rows}
      errorMessage={response.success ? undefined : response.error?.message}
    />
  );
};

export default Page;
