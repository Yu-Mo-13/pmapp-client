'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CancelButton from '@/components/button/CancelButton';
import SubmitButton from '@/components/button/SubmitButton';
import {
  PreregistedPasswordService,
  PreregistedPasswordTargetResponse,
} from '@/api/services/preregistedPassword/preregistedPasswordService';

type PreregistedPasswordCreateViewProps = {
  item: PreregistedPasswordTargetResponse;
};

const PreregistedPasswordCreateView: React.FC<
  PreregistedPasswordCreateViewProps
> = ({ item }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCreate = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const preregistedPassword = item.account
      ? {
          application_id: item.application.id,
          account_id: item.account.id,
        }
      : {
          application_id: item.application.id,
        };

    const response = await PreregistedPasswordService.create({
      preregisted_password: preregistedPassword,
    });

    if ('success' in response && response.success) {
      router.push('/temp-passwords');
      return;
    }

    let message = '仮登録に失敗しました。';

    if ('errors' in response) {
      message =
        response.errors?.preregisted_password?.application_id?.[0] ??
        response.errors?.preregisted_password?.account_id?.[0] ??
        message;
    } else if ('error' in response) {
      message = response.error?.message ?? message;
    }

    setErrorMessage(message);
    setIsSubmitting(false);
  };

  return (
    <>
      <div className="space-y-6 px-0 text-base md:px-6 md:text-[20px]">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-28">
          <span className="text-gray-700 font-medium">アプリケーション</span>
          <span className="flex items-center text-gray-700 font-medium">
            {item.application.name}
          </span>
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-[150px]">
          <span className="text-gray-700 font-medium">アカウント名</span>
          <span className="flex items-center text-gray-700 font-medium">
            {item.account?.name ?? '-'}
          </span>
        </div>
      </div>

      {errorMessage && (
        <p className="mt-6 px-0 text-sm text-red-500 md:px-6">{errorMessage}</p>
      )}

      <div className="mt-10 flex flex-row justify-center gap-4 md:mt-14 md:gap-32">
        <div className="w-full md:w-auto">
          <CancelButton to="/temp-passwords" className="w-[162px] md:w-auto" />
        </div>
        <div className="w-full md:w-auto">
          <SubmitButton
            text="仮登録"
            onClick={handleCreate}
            disabled={isSubmitting}
            className="w-[162px] md:w-36"
          />
        </div>
      </div>
    </>
  );
};

export default PreregistedPasswordCreateView;
