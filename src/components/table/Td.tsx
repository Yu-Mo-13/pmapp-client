// components/table/TableCell.tsx

'use client';

import React from 'react';
import { TableCellProps } from '@/components/table/types';

const Td: React.FC<TableCellProps> = (props: TableCellProps) => {
  return (
    <td
      className={`px-6 py-4 text-base text-gray-900 ${props.className}`}
      style={props.style}
      title={props.title}
      onClick={props.onClick}
      aria-label={props.ariaLabel}
    >
      {props.children}
    </td>
  );
};

export default Td;
