import React from 'react';
import { Td, TableRowWrapper } from '@/components/table';
import { PasswordIndexRow } from '../types';
import Button from '@/components/Button';
import { formatDateTimeToMinute } from '@/lib/dateFormat';

type PasswordTrProps = {
  row: PasswordIndexRow;
};

const PasswordTr: React.FC<PasswordTrProps> = ({ row }) => {
  const borderStyle = { borderColor: '#d1d5db' };
  const handleDetailClick = () => {
    // パスワード取得導線は別Issueで実装予定。
    console.log('Copying password to clipboard');
  };

  return (
    <TableRowWrapper>
      <Td
        className="border-r text-left w-[130px] whitespace-nowrap"
        style={borderStyle}
      >
        {formatDateTimeToMinute(row.latest_updated_at)}
      </Td>

      <Td
        className="border-r text-left truncate"
        style={borderStyle}
        title={row.application_name}
      >
        {row.application_name}
      </Td>

      <Td
        className="border-r text-left truncate"
        style={borderStyle}
        title={row.account_name}
      >
        {row.account_name}
      </Td>

      <Td className="text-center">
        <Button text="取得" onClick={handleDetailClick} />
      </Td>
    </TableRowWrapper>
  );
};

export default PasswordTr;
