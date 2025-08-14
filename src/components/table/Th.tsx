// components/table/TableHeader.tsx

import React from 'react';
import { TableHeaderProps } from '@/components/table/types';

const Th: React.FC<TableHeaderProps> = (props: TableHeaderProps) => {
  return (
    <th
      scope="col"
      className={`px-6 py-3 text-center text-base font-medium ${props.className}`}
      style={props.style}
    >
      {props.children}
    </th>
  );
};

export default Th;