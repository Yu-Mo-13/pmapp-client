import React from 'react';
import { redirect } from 'next/navigation';
import SubmitButton from '@/components/button/SubmitButton';
import Title from '@/components/Title';
import { AccountListProps } from '../types';
import AccountTable from './AccountTable';

const AccountList: React.FC<AccountListProps> = (props: AccountListProps) => {
  const handleCreateClick = async () => {
    'use server';
    redirect('/accounts/create');
  };

  return (
    <main className="flex-1 p-6" role="main">
      <div className="flex justify-between items-center mb-8">
        <Title title={props.title!} />
        <SubmitButton onClick={handleCreateClick} text="新規登録" />
      </div>
      <AccountTable accounts={props.accounts} />
    </main>
  );
};

export default AccountList;
