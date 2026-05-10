'use client';

import React, { useState } from 'react';
import { Td, TableRowWrapper } from '@/components/table';
import MobileInfoCard from '@/components/MobileInfoCard';
import { PasswordService } from '@/api/services/password/passwordService';
import { PasswordActionMessage, PasswordIndexRow } from '../types';
import { formatDateTimeToMinute } from '@/lib/dateFormat';

type PasswordTrProps = {
  row: PasswordIndexRow;
  onActionMessage: (message: PasswordActionMessage | null) => void;
  variant?: 'table' | 'card';
};

const PASSWORD_NOT_FOUND_MESSAGE =
  '最新パスワードが見つかりません。条件を確認してください。';
const PASSWORD_COPY_SUCCESS_MESSAGE = 'パスワードをコピーしました。';
const PASSWORD_COPY_ERROR_MESSAGE = 'パスワードのコピーに失敗しました。';

const actionButtonClassName =
  'text-white rounded text-sm font-medium bg-[#3CB371] hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-60';

const copyWithClipboardEvent = (text: string) => {
  if (
    typeof document === 'undefined' ||
    typeof document.execCommand !== 'function'
  ) {
    return false;
  }

  let copied = false;
  const handleCopy = (event: ClipboardEvent) => {
    event.preventDefault();
    event.clipboardData?.setData('text/plain', text);
    copied = true;
  };

  document.addEventListener('copy', handleCopy);

  try {
    return document.execCommand('copy') && copied;
  } finally {
    document.removeEventListener('copy', handleCopy);
  }
};

const fallbackCopyText = (text: string) => {
  if (
    typeof document === 'undefined' ||
    !document.body ||
    typeof document.execCommand !== 'function'
  ) {
    return false;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '-9999px';
  textarea.style.fontSize = '16px';
  textarea.style.pointerEvents = 'none';

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, text.length);

  const copied = document.execCommand('copy');
  document.body.removeChild(textarea);

  return copied;
};

const copyPasswordToClipboard = async (text: string) => {
  if (typeof navigator !== 'undefined') {
    try {
      if (typeof navigator.clipboard?.writeText === 'function') {
        await navigator.clipboard.writeText(text);
        return;
      }
    } catch {
      // iPhone Safari can reject the Clipboard API even from a user gesture.
    }
  }

  if (copyWithClipboardEvent(text)) {
    return;
  }

  if (!fallbackCopyText(text)) {
    throw new Error('Clipboard copy failed');
  }
};

const PasswordTr: React.FC<PasswordTrProps> = ({
  row,
  onActionMessage,
  variant = 'table',
}) => {
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
            : (response.error?.message ??
              '最新パスワードの取得に失敗しました。'),
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
      await copyPasswordToClipboard(latestPassword);
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

  if (variant === 'card') {
    return (
      <MobileInfoCard
        onClick={handleGetLatestPassword}
        disabled={isLoading}
        headerText={`更新日: ${formatDateTimeToMinute(row.latest_updated_at)}`}
        primaryText={`アプリケーション名: ${row.application_name}`}
        secondaryText={`アカウント名: ${row.account_name}`}
        statusText={isLoading ? '取得中...' : undefined}
      />
    );
  }

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
          className={`${actionButtonClassName} px-6 py-3`}
        >
          {isLoading ? '取得中...' : '取得'}
        </button>
      </Td>
    </TableRowWrapper>
  );
};

export default PasswordTr;
