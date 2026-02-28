import React from 'react';
import { redirect } from 'next/navigation';
import { Td, TableRowWrapper } from '@/components/table';
import Button from '@/components/Button';
import { PreregistedPasswordIndexRow } from '@/api/services/preregistedPassword/preregistedPasswordService';
import { formatListDate } from '@/app/unregisted-passwords/_components/unregistedPasswordFormat';

type PreregistedPasswordTrProps = {
  row: PreregistedPasswordIndexRow;
};

const PreregistedPasswordTr: React.FC<PreregistedPasswordTrProps> = ({ row }) => {
  const borderStyle = { borderColor: '#d1d5db' };
  const handleDetailClick = async () => {
    'use server';
    redirect(`/temp-passwords/${encodeURIComponent(row.uuid)}`);
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

export default PreregistedPasswordTr;
