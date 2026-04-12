'use client';

import React, { useState, useTransition } from 'react';
import Title from '@/components/Title';
import PasswordTable from './PasswordTable';
import { useRouter } from 'next/navigation';
import SubmitButton from '@/components/button/SubmitButton';
import Image from 'next/image';
import ArrowDown from '@/assets/images/arrow/arrowDown.svg';
import { ErrorMessage } from '@/components/form/ErrorMessage';
import { useQueryState } from 'nuqs';
import {
  PasswordActionMessage,
  PasswordApplicationOption,
  PasswordIndexRow,
} from '../types';
import { passwordApplicationIdParser } from '../_lib/searchParams';

type PasswordListProps = {
  title: string;
  rows: PasswordIndexRow[];
  applications: PasswordApplicationOption[];
  selectedApplicationId?: string;
  errorMessage?: string;
};

const PasswordList: React.FC<PasswordListProps> = ({
  title,
  rows,
  applications,
  selectedApplicationId = '',
  errorMessage,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [actionMessage, setActionMessage] =
    useState<PasswordActionMessage | null>(null);
  const [applicationId, setApplicationId] = useQueryState(
    'application_id',
    passwordApplicationIdParser.withOptions({
      shallow: false,
      startTransition,
    })
  );
  const resolvedApplicationId =
    applicationId?.toString() ?? selectedApplicationId ?? '';

  const handleCreateClick = () => {
    router.push('/passwords/create');
  };

  const handleApplicationChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setActionMessage(null);
    void setApplicationId(value ? Number(value) : null);
  };

  return (
    <main className="flex-1 p-4 md:p-6" role="main">
      <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between [&_h2]:mb-0">
        <Title title={title} />
        <div className="hidden w-full md:block md:w-auto">
          <SubmitButton onClick={handleCreateClick} text="新規登録" />
        </div>
      </div>

      {/* アプリケーション */}
      <div className="mb-6">
        <div className="relative w-full py-0 md:m-4 md:w-[97%] md:py-3">
          <select
            name="application_id"
            value={resolvedApplicationId}
            onChange={handleApplicationChange}
            className="w-full text-black px-4 py-3 pr-12 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent appearance-none"
          >
            <option value="">すべてのアプリケーション</option>
            {applications.map((application) => (
              <option key={application.id} value={application.id}>
                {application.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
            <Image src={ArrowDown} alt="選択" width={16} height={16} />
          </div>
        </div>
      </div>

      {isPending && (
        <p className="mb-4 text-sm text-gray-600" aria-live="polite">
          読み込み中...
        </p>
      )}

      {actionMessage?.type === 'success' && (
        <p className="mb-4 text-sm text-green-600" aria-live="polite">
          {actionMessage.text}
        </p>
      )}

      {actionMessage?.type === 'error' && (
        <ErrorMessage message={actionMessage.text} className="mb-4" />
      )}

      {errorMessage && <ErrorMessage message={errorMessage} className="mb-4" />}

      <PasswordTable
        rows={rows}
        onActionMessage={setActionMessage}
        emptyMessage={
          errorMessage
            ? 'パスワード一覧を表示できません。'
            : '表示できるパスワードはありません。'
        }
      />
    </main>
  );
};

export default PasswordList;
