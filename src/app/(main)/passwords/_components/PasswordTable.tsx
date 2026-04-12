import React from 'react';
import { Th, TableRowWrapper } from '@/components/table';
import { PasswordActionMessage, PasswordIndexRow } from '../types';
import PasswordTr from './PasswordTr';

type PasswordTableProps = {
  rows: PasswordIndexRow[];
  onActionMessage: (message: PasswordActionMessage | null) => void;
  emptyMessage?: string;
};

const PasswordTable: React.FC<PasswordTableProps> = ({
  rows,
  onActionMessage,
  emptyMessage = '表示できるパスワードはありません。',
}) => {
  const headerStyle = { backgroundColor: '#3E3E3E', borderColor: '#3E3E3E' };

  return (
    <>
      <div className="space-y-4 md:hidden">
        {rows.length === 0 ? (
          <div className="rounded-md border border-[#D9D9D9] bg-white px-4 py-6 text-center text-gray-600 shadow-[8px_8px_0_rgba(0,0,0,0.18)]">
            {emptyMessage}
          </div>
        ) : (
          rows.map((row) => (
            <PasswordTr
              key={`${row.application_id}-${row.account_id ?? 'none'}-card`}
              row={row}
              onActionMessage={onActionMessage}
              variant="card"
            />
          ))
        )}
      </div>

      <div className="hidden overflow-hidden bg-white shadow md:block">
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
                  key={`${row.application_id}-${row.account_id ?? 'none'}-table`}
                  row={row}
                  onActionMessage={onActionMessage}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PasswordTable;
