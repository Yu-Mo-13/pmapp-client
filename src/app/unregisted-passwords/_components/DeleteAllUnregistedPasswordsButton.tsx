'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ConfirmModal from '@/components/modal/ConfirmModal';
import { UnregistedPasswordService } from '@/api/services/unregistedPassword/unregistedPasswordService';

type DeleteAllUnregistedPasswordsButtonProps = {
  disabled?: boolean;
};

const DeleteAllUnregistedPasswordsButton: React.FC<
  DeleteAllUnregistedPasswordsButtonProps
> = ({ disabled = false }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (isDeleting) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await UnregistedPasswordService.deleteAll();
      if (response.success) {
        alert(
          response.data?.message ??
            '未登録パスワードをすべて削除しました。'
        );
        setIsOpen(false);
        router.refresh();
        return;
      }

      alert(response.error?.message ?? '削除に失敗しました。');
      setIsOpen(false);
    } catch {
      alert('削除中にエラーが発生しました。');
      setIsOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        disabled={disabled || isDeleting}
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 w-36 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 border border-red-600 text-red-600 bg-white hover:bg-red-600 hover:text-white focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        全件削除
      </button>

      <ConfirmModal
        isOpen={isOpen}
        title="未登録パスワードを全件削除します"
        message="削除を実行する場合は、delete と入力してください。"
        passphrase="delete"
        onConfirm={handleConfirm}
        onCancel={() => setIsOpen(false)}
      />
    </>
  );
};

export default DeleteAllUnregistedPasswordsButton;
