import React from 'react';
import Title from '@/components/Title';
import { AccountService } from '@/api/services/account/accountService';
import AccountEditForm from './_components/AccountEditForm';

type AccountEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const AccountEditPage: React.FC<AccountEditPageProps> = async ({ params }) => {
  // paramsをawaitで取得
  const { id } = await params;

  // サーバーサイドでアカウント情報を取得
  const res = await AccountService.show(Number(id));
  const account = res.data;

  return (
    <main className="flex-1 p-6">
      {/* ヘッダー部分 */}
      <div className="flex justify-between items-center mb-8">
        <Title title="アカウント情報の編集" />
      </div>

      {/* フォーム部分 */}
      {account && <AccountEditForm account={account} />}
    </main>
  );
};

export default AccountEditPage;
