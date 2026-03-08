import React from 'react';
import { Th, TableRowWrapper } from '@/components/table';
import { PasswordIndexRow } from '../types';
import PasswordTr from './PasswordTr';

type PasswordTableProps = {
  rows: PasswordIndexRow[];
  emptyMessage?: string;
};

const PasswordTable: React.FC<PasswordTableProps> = ({
  rows,
  emptyMessage = '表示できるパスワードはありません。',
}) => {
  const headerStyle = { backgroundColor: '#3E3E3E', borderColor: '#3E3E3E' };

  return (
    <div className="bg-white shadow overflow-hidden">
      <table className="w-full" role="table" aria-label="パスワード検索">
        <thead>
          <TableRowWrapper className="text-white">
            <Th className="border-r w-[130px]" style={headerStyle}>
              更新日
            </Th>

            <Th className="border-r" style={headerStyle}>
              アプリケーション名
            </Th>

            <Th className="border-r" style={headerStyle}>
              アカウント名
            </Th>

            <Th className="w-[220px]" style={headerStyle}>
              {''}
            </Th>
          </TableRowWrapper>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-6 text-center text-gray-600">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <PasswordTr
                key={`${row.application_id}-${row.account_id ?? 'none'}`}
                row={row}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PasswordTable;
