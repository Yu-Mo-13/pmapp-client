import React from 'react';
import { Account } from '@/api/services/account/accountService';
import { AccountService } from '@/api/services/account/accountService';
import { guardApiResponse } from '@/app/_lib/responseGuard';
import { getServerAuthConfig } from '@/lib/serverAuthConfig';
import AccountList from './_components/AccountList';

const Page: React.FC = async () => {
  const authConfig = await getServerAuthConfig();
  const res = guardApiResponse(await AccountService.index(authConfig));
  const accounts: Account[] = Array.isArray(res.data) ? res.data : [];

  return <AccountList title={'アカウント一覧'} accounts={accounts} />;
};

export default Page;
