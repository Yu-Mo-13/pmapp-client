import React from 'react';
import { Account } from '@/api/services/account/accountService';
import AccountList from '@/app/accounts/_components/AccountList';
import { AccountService } from '@/api/services/account/accountService';
import { getServerAuthConfig } from '@/lib/serverAuthConfig';

const Page: React.FC = async () => {
  const authConfig = await getServerAuthConfig();
  const res = await AccountService.index(authConfig);
  const accounts: Account[] = Array.isArray(res.data) ? res.data : [];

  return <AccountList title={'アカウント一覧'} accounts={accounts} />;
};

export default Page;
