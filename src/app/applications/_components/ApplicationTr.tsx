import React from 'react';
import { ApplicationTableRowProps } from '../types';
import { Td, TableRowWrapper } from '@/components/table';
import Button from '../../../components/Button';
import { redirect } from 'next/navigation';

const ApplicationTr: React.FC<ApplicationTableRowProps> = ({ application }) => {
  const handleDetailClick = async () => {
    "use server";
    redirect(`/applications/${application.id}`);
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
        <form action={handleDetailClick}>
          <Button
            text='詳細'
            onClick={handleDetailClick}
          />
        </form>
      </Td>
    </TableRowWrapper>
  );
};

export default ApplicationTr;