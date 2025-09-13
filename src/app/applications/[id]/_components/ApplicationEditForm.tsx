'use client';

import React, { useState } from 'react';
import CancelButton from '@/components/button/CancelButton';
import SubmitButton from '@/components/button/SubmitButton';
import NumberInput from '@/components/NumberInput';
import ToggleButton from '@/components/ToggleButton';
import { ApplicationShowResponse } from '@/api/services/application/applicationService';

type ApplicationEditFormProps = {
  application: ApplicationShowResponse;
  updateAction: (formData: FormData) => Promise<void>;
};

const ApplicationEditForm: React.FC<ApplicationEditFormProps> = ({
  application: initialApplication,
  updateAction,
}) => {
  const [application, setApplication] =
    useState<ApplicationShowResponse>(initialApplication);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // アプリケーション名を更新されたstateから取得
    formData.set('name', application.name);

    await updateAction(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* フォーム部分 */}
      <div className="px-6 space-y-6 text-[20px]">
        {/* アプリケーション名 */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-gray-700 font-medium">
              アプリケーション名
            </label>
            <button className="text-red-600 hover:text-red-400 font-medium underline">
              削除する
            </button>
          </div>
          <input
            type="text"
            value={application.name || ''}
            className="w-[97%] m-4 text-black px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            onChange={(e) => {
              setApplication((prev) => ({
                ...prev,
                name: e.target.value,
              }));
            }}
          />
        </div>

        {/* アカウント区分 */}
        <div className="flex items-center gap-[132px]">
          <label className="text-gray-700 font-medium mb-3">
            アカウント区分
          </label>
          <div className="flex items-center">
            <ToggleButton
              name="account_class"
              defaultValue={application.account_class}
            />
          </div>
        </div>

        {/* 定期通知区分 */}
        <div className="flex items-center gap-[152px]">
          <label className="text-gray-700 font-medium mb-3">定期通知区分</label>
          <div className="flex items-center">
            <ToggleButton
              name="notice_class"
              defaultValue={application.notice_class}
            />
          </div>
        </div>

        {/* 記号区分 */}
        <div className="flex items-center gap-48">
          <label className="text-gray-700 font-medium mb-3">記号区分</label>
          <div className="flex items-center">
            <ToggleButton
              name="mark_class"
              defaultValue={application.mark_class}
            />
          </div>
        </div>

        {/* 仮登録パスワード桁数 */}
        <div className="flex items-center gap-[74px]">
          <label className="text-gray-700 font-medium mb-3">
            仮登録パスワード桁数
          </label>
          <NumberInput
            name="pre_password_size"
            defaultValue={application.pre_password_size || 10}
            min={1}
            step={1}
          />
        </div>
      </div>

      {/* ボタン部分 */}
      <div className="flex justify-center mt-14 gap-32">
        <CancelButton to="/applications" />
        <SubmitButton isSubmit text="更新" />
      </div>
    </form>
  );
};

export default ApplicationEditForm;
