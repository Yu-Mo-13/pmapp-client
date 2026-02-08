'use client';

import React, { useEffect } from 'react';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import SubmitButton from '@/components/button/SubmitButton';
import CancelButton from '@/components/button/CancelButton';
import ToggleButton from '@/components/ToggleButton';
import { createAccount, FormState } from '../action/AccountCreateActions';

const AccountForm: React.FC = () => {
  const router = useRouter();
  const initialState: FormState = {
    errors: undefined,
    success: false,
    shouldRedirect: false,
  };
  const [state, formAction] = useActionState(createAccount, initialState);

  // 成功時のリダイレクト処理
  useEffect(() => {
    if (state.shouldRedirect) {
      router.push('/accounts');
    }
  }, [state.shouldRedirect, router]);

  return (
    <form action={formAction} className="px-6 space-y-6 text-[20px]">
      {/* アカウント名 */}
      <div>
        <label className="block text-gray-700 font-medium mb-3">
          アカウント名
        </label>
        <input
          type="text"
          name="name"
          className="w-[97%] m-4 text-black px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        />
        {state.errors?.account?.name && (
          <div className="text-red-500 text-sm mt-1 ml-4">
            {state.errors.account.name.join(', ')}
          </div>
        )}
      </div>

      {/* 定期通知区分 */}
      <div className="flex items-center gap-[152px]">
        <label className="text-gray-700 font-medium mb-3">定期通知区分</label>
        <div className="flex items-center">
          <ToggleButton name="notice_class" />
        </div>
        {state.errors?.account?.notice_class && (
          <div className="text-red-500 text-sm mt-1">
            {state.errors.account.notice_class.join(', ')}
          </div>
        )}
      </div>

      {/* ボタン部分 */}
      <div className="flex justify-center mt-14 gap-32">
        <CancelButton to="/accounts" />
        <SubmitButton isSubmit text="登録" />
      </div>
    </form>
  );
};

export default AccountForm;
