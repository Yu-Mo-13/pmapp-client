import React from 'react';
import Title from '@/components/Title';
import AccountForm from './_components/AccountForm';
import {
  AccountApplicationOption,
  AccountService,
} from '@/api/services/account/accountService';
import { getServerAuthConfig } from '@/lib/serverAuthConfig';

const AccountCreatePage = async () => {
  const authConfig = await getServerAuthConfig();
  const res = await AccountService.applications(authConfig);
  const applications: AccountApplicationOption[] = Array.isArray(res.data)
    ? res.data
    : [];

  return (
    <main className="flex-1 p-6">
      {/* ヘッダー部分 */}
      <div className="flex justify-between items-center mb-8">
        <Title title="アカウントの新規登録" />
      </div>

      {/* フォーム部分 */}
      <AccountForm applications={applications} />
    </main>
  );
};

export default AccountCreatePage;
