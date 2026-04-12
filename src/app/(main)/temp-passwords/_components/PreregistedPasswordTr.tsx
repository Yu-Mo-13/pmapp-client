import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Td, TableRowWrapper } from '@/components/table';
import Button from '@/components/Button';
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
      <Link
        href={`/temp-passwords/${encodeURIComponent(row.uuid)}`}
        className="flex min-h-[150px] w-full max-w-[335px] items-center rounded-md border border-[#334155] bg-white p-4 text-left shadow-[8px_8px_0_rgba(0,0,0,0.18)] transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        <dl className="w-full text-gray-900">
          <div className="space-y-1">
            <dd className="text-[15px] font-normal text-gray-900">
              {`登録日: ${formatListDate(row.created_at)}`}
            </dd>
          </div>
          <div
            className="mb-3 mt-[3px] h-px w-full bg-[#334155]"
            aria-hidden="true"
          />
          <div className="space-y-2">
            <dd className="break-all text-[16px] font-semibold leading-6">
              {`アプリケーション名: ${row.application_name}`}
            </dd>
          </div>
          <div className="mt-2 space-y-2">
            <dd className="break-all text-[16px] font-semibold leading-6">
              {`アカウント名: ${row.account_name}`}
            </dd>
          </div>
        </dl>
      </Link>
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
