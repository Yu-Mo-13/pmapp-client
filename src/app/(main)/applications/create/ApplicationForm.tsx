'use client';

import React, { useEffect } from 'react';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import SubmitButton from '@/components/button/SubmitButton';
import CancelButton from '@/components/button/CancelButton';
import ToggleButton from '@/components/ToggleButton';
import NumberInput from '@/components/NumberInput';
import { createApplication, FormState } from './ApplicationCreateActions';

const ApplicationForm: React.FC = () => {
  const router = useRouter();
  const initialState: FormState = {
    errors: undefined,
    success: false,
    shouldRedirect: false,
  };
  const [state, formAction] = useActionState(createApplication, initialState);

  // 成功時のリダイレクト処理
  useEffect(() => {
    if (state.shouldRedirect) {
      router.push('/applications');
    }
  }, [state.shouldRedirect, router]);

  return (
    <form action={formAction} className="px-6 space-y-6 text-[20px]">
      {/* アプリケーション名 */}
      <div>
        <label className="block text-gray-700 font-medium mb-3">
          アプリケーション名
        </label>
        <input
          type="text"
          name="name"
          className="w-[97%] m-4 text-black px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        />
        {state.errors?.application?.name && (
          <div className="text-red-500 text-sm mt-1 ml-4">
            {state.errors.application.name.join(', ')}
          </div>
        )}
      </div>

      {/* アカウント区分 */}
      <div className="flex items-center gap-[132px]">
        <label className="text-gray-700 font-medium mb-3">アカウント区分</label>
        <div className="flex items-center">
          <ToggleButton name="account_class" />
        </div>
        {state.errors?.application?.account_class && (
          <div className="text-red-500 text-sm mt-1">
            {state.errors.application.account_class.join(', ')}
          </div>
        )}
      </div>

      {/* 定期通知区分 */}
      <div className="flex items-center gap-[152px]">
        <label className="text-gray-700 font-medium mb-3">定期通知区分</label>
        <div className="flex items-center">
          <ToggleButton name="notice_class" />
        </div>
        {state.errors?.application?.notice_class && (
          <div className="text-red-500 text-sm mt-1">
            {state.errors.application.notice_class.join(', ')}
          </div>
        )}
      </div>

      {/* 記号区分 */}
      <div className="flex items-center gap-48">
        <label className="text-gray-700 font-medium mb-3">記号区分</label>
        <div className="flex items-center">
          <ToggleButton name="mark_class" />
        </div>
        {state.errors?.application?.mark_class && (
          <div className="text-red-500 text-sm mt-1">
            {state.errors.application.mark_class.join(', ')}
          </div>
        )}
      </div>

      {/* 仮登録パスワード桁数 */}
      <div className="flex items-center gap-[74px]">
        <label className="text-gray-700 font-medium mb-3">
          仮登録パスワード桁数
        </label>
        <NumberInput
          name="pre_password_size"
          defaultValue={10}
          min={1}
          step={1}
        />
        {state.errors?.application?.pre_password_size && (
          <div className="text-red-500 text-sm mt-1">
            {state.errors.application.pre_password_size.join(', ')}
          </div>
        )}
      </div>

      {/* ボタン部分 */}
      <div className="flex justify-center mt-14 gap-32">
        <CancelButton to="/applications" />
        <SubmitButton isSubmit text="登録" />
      </div>
    </form>
  );
};

export default ApplicationForm;
