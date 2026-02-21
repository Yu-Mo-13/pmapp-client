import React from 'react';
import { Td, TableRowWrapper } from '@/components/table';
import Button from '../../../components/Button';
import { redirect } from 'next/navigation';
import { AccountTableRowProps } from '@/app/accounts/types';

const AccountTr: React.FC<AccountTableRowProps> = ({ account }) => {
  const handleDetailClick = async () => {
    'use server';
    redirect(`/accounts/${account.id}`);
  };

  const borderStyle = { borderColor: '#d1d5db' };

  return (
    <TableRowWrapper>
      <Td
        className="border-r text-left truncate"
        style={borderStyle}
        title={account.name}
      >
        {account.name && <span>{account.name}</span>}
      </Td>

      <Td
        className="border-r text-left truncate"
        style={borderStyle}
        title={account.application_name}
      >
        {account.application_name && <span>{account.application_name}</span>}
      </Td>

      <Td className="border-r text-center" style={borderStyle}>
        {account.notice_class ? 'あり' : 'なし'}
      </Td>

      <Td className="text-center">
        <form action={handleDetailClick}>
          <Button text="詳細" onClick={handleDetailClick} />
        </form>
      </Td>
    </TableRowWrapper>
  );
};

export default AccountTr;
