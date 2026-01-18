// components/ApplicationTable.tsx

import React from 'react';
import { Th, TableRowWrapper } from '@/components/table';
import { AccountTableProps } from '@/app/accounts/types';
import AccountTr from '@/app/accounts/_components/AccountTr';

const AccountTable: React.FC<AccountTableProps> = ({ accounts }) => {
  const headerStyle = { backgroundColor: '#3E3E3E', borderColor: '#3E3E3E' };

  return (
    <div className="bg-white shadow overflow-hidden">
      <table className="w-full" role="table" aria-label="アカウント一覧">
        <thead>
          <TableRowWrapper className="text-white">
            <Th className="border-r" style={headerStyle}>
              アカウント名
            </Th>

            <Th className="border-r" style={headerStyle}>
              アプリケーション
            </Th>

            <Th className="border-r w-[400px]" style={headerStyle}>
              変更通知区分
            </Th>

            <Th className="w-[300px]" style={headerStyle}>
              {''}
            </Th>
          </TableRowWrapper>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {accounts &&
            accounts.map((account) => (
              <AccountTr key={account.id} account={account} />
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountTable;
