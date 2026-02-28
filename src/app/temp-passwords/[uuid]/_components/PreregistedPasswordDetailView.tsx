'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CancelButton from '@/components/button/CancelButton';
import SubmitButton from '@/components/button/SubmitButton';
import { ErrorMessage } from '@/components/form/ErrorMessage';
import { PasswordService } from '@/api/services/password/passwordService';
import { PreregistedPasswordShowResponse } from '@/api/services/preregistedPassword/preregistedPasswordService';
import { formatDateTime } from '@/app/unregisted-passwords/_components/unregistedPasswordFormat';
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
  const [registerError, setRegisterError] = useState<string | undefined>();
  const passwordForDisplay = item.password ?? '-';
  const canTogglePassword = passwordForDisplay !== '-';

  const handleRegister = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setRegisterError(undefined);

    const response = await PasswordService.create({
      password: {
        password: passwordForDisplay,
        application_id: item.application_id!,
        account_id: item.account_id!,
      },
    });

    if ('success' in response && response.success) {
      router.push('/temp-passwords');
      return;
    }

    if ('errors' in response && response.errors?.password) {
      const firstError =
        response.errors.password.password?.[0] ??
        response.errors.password.application_id?.[0] ??
        response.errors.password.account_id?.[0];
      setRegisterError(firstError ?? '本登録に失敗しました。');
      setIsSubmitting(false);
      return;
    }

    if ('error' in response && response.error?.message) {
      setRegisterError(response.error.message);
      setIsSubmitting(false);
      return;
    }

    setRegisterError('本登録に失敗しました。');
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
                  src={isPasswordVisible ? ToggleOff : ToggleOn}
                  alt={isPasswordVisible ? 'Toggle Off' : 'Toggle On'}
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
        <CancelButton to="/temp-passwords" />
        <div className="flex flex-col items-center">
          <SubmitButton text="登録" onClick={handleRegister} />
          {registerError && (
            <ErrorMessage className="mt-2" message={registerError} />
          )}
        </div>
      </div>
    </>
  );
};

export default PreregistedPasswordDetailView;
