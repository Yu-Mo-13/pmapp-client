'use client';

import React, { useState, useEffect, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import CancelButton from '@/components/button/CancelButton';
import SubmitButton from '@/components/button/SubmitButton';
import NumberInput from '@/components/NumberInput';
import ToggleButton from '@/components/ToggleButton';
import { ErrorMessage } from '@/components/form/ErrorMessage';
import {
  ApplicationService,
  ApplicationShowResponse,
} from '@/api/services/application/applicationService';
import { updateApplication } from '../action/AppilicationUpdateActions';
import ConfirmModal from '@/components/modal/ConfirmModal';

type ApplicationEditFormProps = {
  application: ApplicationShowResponse;
};

const ApplicationEditForm: React.FC<ApplicationEditFormProps> = ({
  application: initialApplication,
}) => {
  const [application, setApplication] =
    useState<ApplicationShowResponse>(initialApplication);
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [state, formAction] = useActionState(updateApplication, {
    errors: undefined,
    success: false,
    shouldRedirect: false,
  });

  useEffect(() => {
    if (state.shouldRedirect) {
      router.push('/applications');
    }
  }, [state.shouldRedirect, router]);

  const handleOpenDeleteModal = () => setIsDeleteModalOpen(true);
  const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);

  const handleDeleteConfirm = async () => {
    try {
      const response = await ApplicationService.delete(application.id);
      if (response.success) {
        handleCloseDeleteModal();
        router.push('/applications');
      } else {
        console.error('Failed to delete application:', response.error);
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
        <input type="hidden" name="id" value={application.id} />
        {/* フォーム部分 */}
        <div className="px-6 space-y-6 text-[20px]">
          {/* アプリケーション名 */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label htmlFor="name" className="block text-gray-700 font-medium">
                アプリケーション名
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
              value={application.name || ''}
              className="w-[97%] m-4 text-black px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              onChange={(e) => {
                setApplication((prev) => ({
                  ...prev,
                  name: e.target.value,
                }));
              }}
            />
            {state?.errors?.application?.name && (
              <ErrorMessage
                className="ml-4"
                message={state.errors.application.name[0]}
              />
            )}
          </div>

          {/* アカウント区分 */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-[132px]">
              <label className="text-gray-700 font-medium">
                アカウント区分
              </label>
              <div className="flex items-center">
                <ToggleButton
                  name="account_class"
                  defaultValue={application.account_class}
                />
              </div>
            </div>
            {state?.errors?.application?.account_class && (
              <ErrorMessage
                message={state.errors.application.account_class[0]}
              />
            )}
          </div>

          {/* 定期通知区分 */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-[152px]">
              <label className="text-gray-700 font-medium">定期通知区分</label>
              <div className="flex items-center">
                <ToggleButton
                  name="notice_class"
                  defaultValue={application.notice_class}
                />
              </div>
            </div>
            {state?.errors?.application?.notice_class && (
              <ErrorMessage
                message={state.errors.application.notice_class[0]}
              />
            )}
          </div>

          {/* 記号区分 */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-48">
              <label className="text-gray-700 font-medium">記号区分</label>
              <div className="flex items-center">
                <ToggleButton
                  name="mark_class"
                  defaultValue={application.mark_class}
                />
              </div>
            </div>
            {state?.errors?.application?.mark_class && (
              <ErrorMessage message={state.errors.application.mark_class[0]} />
            )}
          </div>

          {/* 仮登録パスワード桁数 */}
          <div>
            <div className="flex items-center gap-[74px]">
              <label className="text-gray-700 font-medium">
                仮登録パスワード桁数
              </label>
              <NumberInput
                name="pre_password_size"
                defaultValue={application.pre_password_size || 10}
                min={1}
                step={1}
              />
            </div>
            {state?.errors?.application?.pre_password_size && (
              <ErrorMessage
                message={state.errors.application.pre_password_size[0]}
              />
            )}
          </div>
        </div>

        {/* ボタン部分 */}
        <div className="flex justify-center mt-14 gap-32">
          <CancelButton to="/applications" />
          <SubmitButton isSubmit text="更新" />
        </div>
      </form>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title={`アプリケーション ${initialApplication.name} を削除します`}
        message={`このアプリケーションを削除する場合は、「delete」を入力してください。`}
        passphrase="delete"
        onConfirm={handleDeleteConfirm}
        onCancel={handleCloseDeleteModal}
      />
    </>
  );
};

export default ApplicationEditForm;
