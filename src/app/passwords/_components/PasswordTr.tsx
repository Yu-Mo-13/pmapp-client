'use client';

import React, { useState } from 'react';
import { Td, TableRowWrapper } from '@/components/table';
import { PasswordService } from '@/api/services/password/passwordService';
import { PasswordActionMessage, PasswordIndexRow } from '../types';
import { formatDateTimeToMinute } from '@/lib/dateFormat';

type PasswordTrProps = {
  row: PasswordIndexRow;
  onActionMessage: (message: PasswordActionMessage | null) => void;
};

const PASSWORD_NOT_FOUND_MESSAGE =
  '最新パスワードが見つかりません。条件を確認してください。';
const PASSWORD_COPY_SUCCESS_MESSAGE = 'パスワードをコピーしました。';
const PASSWORD_COPY_ERROR_MESSAGE = 'パスワードのコピーに失敗しました。';

const PasswordTr: React.FC<PasswordTrProps> = ({ row, onActionMessage }) => {
  const borderStyle = { borderColor: '#d1d5db' };
  const [isLoading, setIsLoading] = useState(false);

  const handleGetLatestPassword = async () => {
    if (isLoading) {
      return;
    }

    onActionMessage(null);
    setIsLoading(true);

    const response = await PasswordService.latest({
      application_id: row.application_id,
      ...(typeof row.account_id === 'number'
        ? { account_id: row.account_id }
        : {}),
    });

    setIsLoading(false);

    if (!response.success) {
      onActionMessage({
        type: 'error',
        text:
          response.error?.status === 404
            ? PASSWORD_NOT_FOUND_MESSAGE
            : response.error?.message ?? '最新パスワードの取得に失敗しました。',
      });
      return;
    }

    const latestPassword = response.data?.password;
    if (!latestPassword) {
      onActionMessage({
        type: 'error',
        text: PASSWORD_NOT_FOUND_MESSAGE,
      });
      return;
    }

    try {
      if (
        typeof navigator === 'undefined' ||
        typeof navigator.clipboard?.writeText !== 'function'
      ) {
        throw new Error('Clipboard API is unavailable');
      }

      await navigator.clipboard.writeText(latestPassword);
      onActionMessage({
        type: 'success',
        text: PASSWORD_COPY_SUCCESS_MESSAGE,
      });
    } catch {
      onActionMessage({
        type: 'error',
        text: PASSWORD_COPY_ERROR_MESSAGE,
      });
    }
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
        <button
          type="button"
          onClick={handleGetLatestPassword}
          disabled={isLoading}
          className="text-white px-6 py-3 rounded text-sm font-medium bg-[#3CB371] hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? '取得中...' : '取得'}
        </button>
      </Td>
    </TableRowWrapper>
  );
};

export default PasswordTr;
