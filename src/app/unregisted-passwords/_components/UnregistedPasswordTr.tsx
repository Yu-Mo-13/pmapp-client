import React from 'react';
import { redirect } from 'next/navigation';
import { Td, TableRowWrapper } from '@/components/table';
import { UnregistedPasswordIndexRow } from '@/api/services/unregistedPassword/unregistedPasswordService';
import Button from '@/components/Button';
import { formatListDate } from '@/lib/dateFormat';

type UnregistedPasswordTrProps = {
  row: UnregistedPasswordIndexRow;
};

const UnregistedPasswordTr: React.FC<UnregistedPasswordTrProps> = ({ row }) => {
  const borderStyle = { borderColor: '#d1d5db' };
  const handleDetailClick = async () => {
    'use server';
    redirect(`/unregisted-passwords/${encodeURIComponent(row.uuid)}`);
  };

  return (
    <TableRowWrapper>
      <Td className="border-r text-left w-[130px] whitespace-nowrap" style={borderStyle}>
        {formatListDate(row.created_at)}
      </Td>

      <Td className="border-r text-left truncate" style={borderStyle} title={row.application_name}>
        {row.application_name}
      </Td>

      <Td className="border-r text-left truncate" style={borderStyle} title={row.account_name}>
        {row.account_name}
      </Td>

      <Td className="text-center">
        <form action={handleDetailClick}>
          <Button text="詳細" onClick={handleDetailClick} />
        </form>
      </Td>
    </TableRowWrapper>
  );
};

export default UnregistedPasswordTr;
