import React from 'react';
import {
  extractUnregistedPasswordIndexRows,
  UnregistedPasswordService,
} from '@/api/services/unregistedPassword/unregistedPasswordService';
import { guardApiResponse } from '@/app/_lib/responseGuard';
import { getServerAuthConfig } from '@/lib/serverAuthConfig';
import UnregistedPasswordList from './_components/UnregistedPasswordList';

const Page: React.FC = async () => {
  const authConfig = await getServerAuthConfig();
  const response = guardApiResponse(
    await UnregistedPasswordService.index(authConfig)
  );

  const rows = response.success
    ? extractUnregistedPasswordIndexRows(response.data)
    : [];

  return (
    <UnregistedPasswordList
      title="未登録パスワード一覧"
      rows={rows}
    />
  );
};

export default Page;
