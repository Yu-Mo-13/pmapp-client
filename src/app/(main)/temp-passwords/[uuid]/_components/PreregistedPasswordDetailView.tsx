'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CancelButton from '@/components/button/CancelButton';
import SubmitButton from '@/components/button/SubmitButton';
import { PasswordService } from '@/api/services/password/passwordService';
import { PreregistedPasswordShowResponse } from '@/api/services/preregistedPassword/preregistedPasswordService';
import { PreregistedPasswordService } from '@/api/services/preregistedPassword/preregistedPasswordService';
import { formatDateTime } from '@/lib/dateFormat';
import ToggleOff from '@/assets/images/toggle-password/invisible.svg';
import ToggleOn from '@/assets/images/toggle-password/visible.svg';

type PreregistedPasswordDetailViewProps = {
  item: PreregistedPasswordShowResponse;
};

const PreregistedPasswordDetailView: React.FC<
  PreregistedPasswordDetailViewProps
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
      const deleteResponse = await PreregistedPasswordService.delete(item.uuid);

      if (deleteResponse.success) {
        router.push('/temp-passwords');
        return;
      }

      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
  };

  return (
    <>
      <div className="space-y-6 px-0 text-base md:px-6 md:text-[20px]">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-28">
          <span className="text-gray-700 font-medium">アプリケーション</span>
          <span className="flex items-center text-gray-700 font-medium">
            {item.application_name}
          </span>
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-[150px]">
          <span className="text-gray-700 font-medium">アカウント名</span>
          <span className="flex items-center text-gray-700 font-medium">
            {item.account_name}
          </span>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="block text-gray-700 font-medium">パスワード</span>
          </div>
          <div className="relative w-full md:m-4 md:w-[97%]">
            <input
              type={
                canTogglePassword && !isPasswordVisible ? 'password' : 'text'
              }
              value={passwordForDisplay}
              readOnly
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
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
                className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center md:h-6 md:w-11 bg-white"
              >
                <Image
                  src={isPasswordVisible ? ToggleOff : ToggleOn}
                  alt={isPasswordVisible ? 'Toggle Off' : 'Toggle On'}
                  width={44}
                  height={24}
                  className="size-6 md:h-6 md:w-11"
                />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-48">
          <span className="text-gray-700 font-medium">作成日時</span>
          <span className="text-gray-700">
            {formatDateTime(item.created_at)}
          </span>
        </div>
      </div>

      <div className="mt-10 flex flex-row justify-center gap-4 md:mt-14 md:gap-32">
        <div className="w-full md:w-auto">
          <CancelButton to="/temp-passwords" className="w-[162px] md:w-auto" />
        </div>
        <div className="w-full md:w-auto">
          <SubmitButton
            text="登録"
            onClick={handleRegister}
            disabled={!canRegister || isSubmitting}
            className="w-[162px] md:w-36"
          />
        </div>
      </div>
    </>
  );
};

export default PreregistedPasswordDetailView;
