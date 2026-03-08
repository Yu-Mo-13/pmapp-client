'use client';

import React, { useEffect } from 'react';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SubmitButton from '@/components/button/SubmitButton';
import CancelButton from '@/components/button/CancelButton';
import ArrowDown from '@/assets/images/arrow/arrowDown.svg';
import { AccountApplicationOption } from '@/api/services/account/accountService';
import NumberInput from '@/components/NumberInput';
import Button from '@/components/Button';

interface AccountFormProps {
  applications: AccountApplicationOption[];
}

const AccountForm: React.FC<AccountFormProps> = ({ applications }) => {
  return (
    <form className="px-6 space-y-6 text-[20px]">
      {/* パスワード */}
      <div>
        <div className="flex gap-12">
          <label className="block text-gray-700 font-medium mb-3">
            パスワード
          </label>
          <Button text="生成" onClick={() => {}} />
        </div>
        <input
          type="text"
          name="password"
          className="w-[97%] m-4 text-black px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        />
        <div className="text-red-500 text-sm mt-1 ml-4">
          {'バリデーションエラー'}
        </div>
      </div>

      {/* アプリケーション */}
      <div>
        <label className="block text-gray-700 font-medium mb-3">
          アプリケーション
        </label>
        <div className="relative w-[97%] m-4 py-3">
          <select
            name="application_id"
            defaultValue=""
            className="w-full text-black px-4 py-3 pr-12 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent appearance-none"
          >
            <option value="" disabled>
              選択してください
            </option>
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
        <div className="text-red-500 text-sm mt-1 ml-4">
          {'バリデーションエラー'}
        </div>
      </div>

      {/* アカウント名 */}
      <div>
        <label className="block text-gray-700 font-medium mb-3">
          アカウント名
        </label>
        <div className="relative w-[97%] m-4 py-3">
          <select
            name="account_id"
            defaultValue=""
            className="w-full text-black px-4 py-3 pr-12 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent appearance-none"
          >
            <option value="" disabled>
              選択してください
            </option>
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
        <div className="text-red-500 text-sm mt-1 ml-4">
          {'バリデーションエラー'}
        </div>
      </div>

      {/* パスワード桁数 */}
      <div className="flex items-center gap-[74px]">
        <label className="text-gray-700 font-medium mb-3">パスワード桁数</label>
        <NumberInput name="password_size" defaultValue={10} min={1} step={1} />
        <div className="text-red-500 text-sm mt-1 ml-4">
          {'バリデーションエラー'}
        </div>
      </div>

      {/* ボタン部分 */}
      <div className="flex justify-center mt-14 gap-32">
        <CancelButton to="/passwords" />
        <SubmitButton isSubmit text="登録" />
      </div>
    </form>
  );
};

export default AccountForm;
