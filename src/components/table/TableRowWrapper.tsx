// components/table/TableRowWrapper.tsx

'use client';

import React from 'react';
import { TableRowWrapperProps } from '@/components/table/types';

const TableRowWrapper: React.FC<TableRowWrapperProps> = (props: TableRowWrapperProps) => {
  return (
    <tr className={`h-16 ${props.className}`}>
      {props.children}
    </tr>
  );
};

export default TableRowWrapper;