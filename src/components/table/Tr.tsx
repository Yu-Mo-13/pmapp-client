// components/TableRow.tsx

'use client';

import React from 'react';
import { TableRowProps } from '@/components/table/types';
import { Td, TableRowWrapper } from '@/components/table';
import Button from '../Button';

const TableRow: React.FC<TableRowProps> = ({ application }) => {
  const {
    name = "",
    symbol = "",
    notification = "",
    account = "",
  } = application;

  const handleDetailClick = () => {
      // Next.jsでは router.push() を使用することを想定
      console.log(`詳細ページへ遷移: ${name}`);
      // router.push(`/applications/${application.id}/detail`);
  };

  const borderStyle = { borderColor: '#d1d5db' };

  return (
    <TableRowWrapper>
      <Td
        className="border-r text-left truncate"
        style={borderStyle}
        title={name || undefined}
      >
        {name && <span>{name}</span>}
      </Td>

      <Td
        className="border-r text-center"
        style={borderStyle}
      >
        {symbol}
      </Td>

      <Td
        className="border-r text-center"
        style={borderStyle}
      >
        {notification}
      </Td>

      <Td
        className="border-r text-center"
        style={borderStyle}
      >
        {account}
      </Td>

      <Td className="text-center">
          <Button
          text='詳細'
            onClick={handleDetailClick}
          />
      </Td>
    </TableRowWrapper>
  );
};

export default TableRow;