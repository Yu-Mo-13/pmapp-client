import React from 'react';
import { redirect } from 'next/navigation';
import { Td, TableRowWrapper } from '@/components/table';
import Button from '@/components/Button';
import MobileInfoCard from '@/components/MobileInfoCard';
import { PreregistedPasswordIndexRow } from '@/api/services/preregistedPassword/preregistedPasswordService';
import { formatListDate } from '@/lib/dateFormat';

type PreregistedPasswordTrProps = {
  row: PreregistedPasswordIndexRow;
  variant?: 'table' | 'card';
};

const PreregistedPasswordTr: React.FC<PreregistedPasswordTrProps> = ({
  row,
  variant = 'table',
}) => {
  const borderStyle = { borderColor: '#d1d5db' };
  const handleDetailClick = async () => {
    'use server';
    redirect(`/temp-passwords/${encodeURIComponent(row.uuid)}`);
  };

  if (variant === 'card') {
    return (
      <MobileInfoCard
        href={`/temp-passwords/${encodeURIComponent(row.uuid)}`}
        headerText={`登録日: ${formatListDate(row.created_at)}`}
        primaryText={`アプリケーション名: ${row.application_name}`}
        secondaryText={`アカウント名: ${row.account_name}`}
        centerContent
      />
    );
  }

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
