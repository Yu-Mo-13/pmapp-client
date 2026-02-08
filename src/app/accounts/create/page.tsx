import React from 'react';
import Title from '@/components/Title';
// import AccountForm from './AccountForm';

const AccountCreatePage: React.FC = () => {
  return (
    <main className="flex-1 p-6">
      {/* ヘッダー部分 */}
      <div className="flex justify-between items-center mb-8">
        <Title title="アカウントの新規登録" />
      </div>

      {/* フォーム部分 */}
      {/* <AccountForm /> */}
    </main>
  );
};

export default AccountCreatePage;
