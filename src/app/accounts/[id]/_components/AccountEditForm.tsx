'use client';

import React, { useState, useEffect, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import CancelButton from '@/components/button/CancelButton';
import SubmitButton from '@/components/button/SubmitButton';
import ToggleButton from '@/components/ToggleButton';
import { ErrorMessage } from '@/components/form/ErrorMessage';
import {
  AccountService,
  AccountShowResponse,
} from '@/api/services/account/accountService';
import { updateAccount } from '../action/AccountUpdateActions';
import ConfirmModal from '@/components/modal/ConfirmModal';

type AccountEditFormProps = {
  account: AccountShowResponse;
};

const AccountEditForm: React.FC<AccountEditFormProps> = ({
  account: initialAccount,
}) => {
  const [account, setAccount] = useState<AccountShowResponse>(initialAccount);
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [state, formAction] = useActionState(updateAccount, {
    errors: undefined,
    success: false,
    shouldRedirect: false,
  });

  useEffect(() => {
    if (state.shouldRedirect) {
      router.push('/accounts');
    }
  }, [state.shouldRedirect, router]);

  const handleOpenDeleteModal = () => setIsDeleteModalOpen(true);
  const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);

  const handleDeleteConfirm = async () => {
    try {
      const response = await AccountService.delete(account.id);
      if (response.success) {
        handleCloseDeleteModal();
        router.push('/accounts');
      } else {
        console.error('Failed to delete account:', response.error);
        handleCloseDeleteModal();
        alert('削除に失敗しました。');
      }
    } catch (error) {
      console.error('An error occurred during deletion:', error);
      handleCloseDeleteModal();
      alert('削除中にエラーが発生しました。');
    }
  };

  return (
    <>
      <form action={formAction}>
        <input type="hidden" name="id" value={account.id} />
        {/* フォーム部分 */}
        <div className="px-6 space-y-6 text-[20px]">
          {/* アカウント名 */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label htmlFor="name" className="block text-gray-700 font-medium">
                アカウント名
              </label>
              <button
                type="button"
                onClick={handleOpenDeleteModal}
                className="text-red-600 hover:text-red-400 font-medium underline"
              >
                削除する
              </button>
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={account.name || ''}
              className="w-[97%] m-4 text-black px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              onChange={(e) => {
                setAccount((prev) => ({
                  ...prev,
                  name: e.target.value,
                }));
              }}
            />
            {state?.errors?.account?.name && (
              <ErrorMessage
                className="ml-4"
                message={state.errors.account.name[0]}
              />
            )}
          </div>

          {/* アプリケーション */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-28">
              <label className="text-gray-700 font-medium">
                アプリケーション
              </label>
              <div className="flex items-center text-gray-700 font-medium">
                {account.application.name}
              </div>
            </div>
          </div>

          {/* 定期通知区分 */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-[152px]">
              <label className="text-gray-700 font-medium">定期通知区分</label>
              <div className="flex items-center">
                <ToggleButton
                  name="notice_class"
                  defaultValue={account.notice_class}
                />
              </div>
            </div>
            {state?.errors?.account?.notice_class && (
              <ErrorMessage message={state.errors.account.notice_class[0]} />
            )}
          </div>
        </div>

        {/* ボタン部分 */}
        <div className="flex justify-center mt-14 gap-32">
          <CancelButton to="/accounts" />
          <SubmitButton isSubmit text="更新" />
        </div>
      </form>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title={`${initialAccount.name} を削除します`}
        message={`このアカウントを削除する場合は、「delete」を入力してください。`}
        passphrase="delete"
        onConfirm={handleDeleteConfirm}
        onCancel={handleCloseDeleteModal}
      />
    </>
  );
};

export default AccountEditForm;
