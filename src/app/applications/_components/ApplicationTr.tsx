'use client';

import React from 'react';
import { ApplicationTableRowProps } from '../types';
import { Td, TableRowWrapper } from '@/components/table';
import Button from '../../../components/Button';

const ApplicationTr: React.FC<ApplicationTableRowProps> = ({ application }) => {
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
        title={application.name}
      >
        {application.name && <span>{application.name}</span>}
      </Td>

      <Td
        className="border-r text-center"
        style={borderStyle}
      >
        {application.mark_class ? 'あり' : 'なし'}
      </Td>

      <Td
        className="border-r text-center"
        style={borderStyle}
      >
        {application.notice_class ? 'あり' : 'なし'}
      </Td>

      <Td
        className="border-r text-center"
        style={borderStyle}
      >
        {application.account_class ? 'あり' : 'なし'}
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

export default ApplicationTr;