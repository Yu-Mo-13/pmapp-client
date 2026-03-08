import React from 'react';
import Title from '@/components/Title';
import PasswordTable from './PasswordTable';
import { redirect } from 'next/navigation';
import SubmitButton from '@/components/button/SubmitButton';
import Image from 'next/image';
import ArrowDown from '@/assets/images/arrow/arrowDown.svg';
import { PasswordIndexRow } from '../types';

type PasswordListProps = {
  title: string;
  rows: PasswordIndexRow[];
};

const PasswordList: React.FC<PasswordListProps> = ({ title, rows }) => {
  const handleCreateClick = async () => {
    'use server';
    redirect('/passwords/create');
  };

  return (
    <main className="flex-1 p-6" role="main">
      <div className="flex justify-between items-center mb-8">
        <Title title={title} />
        <SubmitButton onClick={handleCreateClick} text="新規登録" />
      </div>

      {/* アプリケーション */}
      <div>
        <div className="relative w-[97%] m-4 py-3">
          <select
            name="application_id"
            defaultValue=""
            className="w-full text-black px-4 py-3 pr-12 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent appearance-none"
          >
            <option value="" disabled>
              アプリケーションを選択してください
            </option>
            <option value={1}>アプリケーション名</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
            <Image src={ArrowDown} alt="選択" width={16} height={16} />
          </div>
        </div>
      </div>

      <PasswordTable rows={rows} />
    </main>
  );
};

export default PasswordList;
