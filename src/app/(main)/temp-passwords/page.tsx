import React from 'react';
import {
  extractPreregistedPasswordIndexRows,
  PreregistedPasswordService,
} from '@/api/services/preregistedPassword/preregistedPasswordService';
import { guardApiResponse } from '@/app/_lib/responseGuard';
import { getServerAuthConfig } from '@/lib/serverAuthConfig';
import PreregistedPasswordList from './_components/PreregistedPasswordList';

const Page: React.FC = async () => {
  const authConfig = await getServerAuthConfig();
  const response = guardApiResponse(
    await PreregistedPasswordService.index(authConfig)
  );

  const rows = response.success
    ? extractPreregistedPasswordIndexRows(response.data)
    : [];

  return (
    <PreregistedPasswordList
      title="仮登録パスワード一覧"
      rows={rows}
    />
  );
};

export default Page;
