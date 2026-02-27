'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CancelButton from '@/components/button/CancelButton';
import SubmitButton from '@/components/button/SubmitButton';
import { UnregistedPasswordShowResponse } from '@/api/services/unregistedPassword/unregistedPasswordService';
import { PasswordService } from '@/api/services/password/passwordService';
import { formatDateTime } from '../../_components/unregistedPasswordFormat';
import ToggleOff from '@/assets/images/toggle-password/invisible.svg';
import ToggleOn from '@/assets/images/toggle-password/visible.svg';

type UnregistedPasswordDetailViewProps = {
  item: UnregistedPasswordShowResponse;
};

const UnregistedPasswordDetailView: React.FC<
  UnregistedPasswordDetailViewProps
> = ({ item }) => {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordForDisplay = item.password ?? '-';
  const canTogglePassword = passwordForDisplay !== '-';
  const canRegister =
    typeof item.application_id === 'number' &&
    typeof item.account_id === 'number' &&
    passwordForDisplay !== '-';

  const handleRegister = async () => {
    if (!canRegister || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    const response = await PasswordService.create({
      password: {
        password: passwordForDisplay,
        application_id: item.application_id!,
        account_id: item.account_id!,
      },
    });

    if ('success' in response && response.success) {
      router.push('/unregisted-passwords');
      return;
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <div className="px-6 space-y-6 text-[20px]">
        <div className="flex items-center gap-28">
          <span className="text-gray-700 font-medium">アプリケーション</span>
          <span className="flex items-center text-gray-700 font-medium">
            {item.application_name}
          </span>
        </div>

        <div className="flex items-center gap-[150px]">
          <span className="text-gray-700 font-medium">アカウント名</span>
          <span className="flex items-center text-gray-700 font-medium">
            {item.account_name}
          </span>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="block text-gray-700 font-medium">パスワード</span>
          </div>
          <div className="relative w-[97%] m-4">
            <input
              type={
                canTogglePassword && !isPasswordVisible ? 'password' : 'text'
              }
              value={passwordForDisplay}
              readOnly
              className="w-full text-black px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            {canTogglePassword && (
              <button
                type="button"
                onClick={() => setIsPasswordVisible((prev) => !prev)}
                aria-label={
                  isPasswordVisible
                    ? 'パスワードを非表示にする'
                    : 'パスワードを表示する'
                }
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Image
                  src={isPasswordVisible ? ToggleOn : ToggleOff}
                  alt={isPasswordVisible ? 'Toggle On' : 'Toggle Off'}
                  width={44}
                  height={24}
                />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-48">
          <span className="text-gray-700 font-medium">作成日時</span>
          <span className="text-gray-700">
            {formatDateTime(item.created_at)}
          </span>
        </div>
      </div>

      <div className="flex justify-center mt-14 gap-32">
        <CancelButton to="/unregisted-passwords" />
        <SubmitButton text="登録" onClick={handleRegister} />
      </div>
    </>
  );
};

export default UnregistedPasswordDetailView;
