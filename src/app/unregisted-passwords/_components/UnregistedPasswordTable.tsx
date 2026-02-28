import React from 'react';
import { Th, TableRowWrapper } from '@/components/table';
import { UnregistedPasswordIndexRow } from '@/api/services/unregistedPassword/unregistedPasswordService';
import UnregistedPasswordTr from './UnregistedPasswordTr';

type UnregistedPasswordTableProps = {
  rows: UnregistedPasswordIndexRow[];
  emptyMessage?: string;
};

const UnregistedPasswordTable: React.FC<UnregistedPasswordTableProps> = ({
  rows,
  emptyMessage = '表示できる未登録パスワードはありません。',
}) => {
  const headerStyle = { backgroundColor: '#3E3E3E', borderColor: '#3E3E3E' };

  return (
    <div className="bg-white shadow overflow-hidden">
      <table className="w-full" role="table" aria-label="未登録パスワード一覧">
        <thead>
          <TableRowWrapper className="text-white">
            <Th className="border-r w-[130px]" style={headerStyle}>
              登録日
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
            rows.map((row) => <UnregistedPasswordTr key={row.uuid} row={row} />)
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UnregistedPasswordTable;
