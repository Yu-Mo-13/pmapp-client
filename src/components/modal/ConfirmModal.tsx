import React, { useState, useEffect, useRef } from 'react';
import SubmitButton from '../button/SubmitButton';
import { CloseButton } from '../button/CloseButton';

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  passphrase: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  passphrase,
  onConfirm,
  onCancel,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setInputValue('');
      setError('');
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    if (inputValue.trim() === passphrase) {
      onConfirm();
    } else {
      setError('入力された合言葉が正しくありません。');
    }
  };

  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50"
      onClick={onCancel}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 transform transition-all"
        onClick={handleModalContentClick}
      >
        <h2 className="text-xl font-bold mb-4 text-gray-900">{title}</h2>
        <p className="text-gray-700 mb-4">{message}</p>
        <div className="mb-4">
          <label
            htmlFor="passphrase-input"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            この操作を確定するには、「
            <span className="font-bold">{passphrase}</span>
            」と入力してください。
          </label>
          <input
            ref={inputRef}
            id="passphrase-input"
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (error) {
                setError('');
              }
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleConfirm();
              }
            }}
            placeholder={passphrase}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <CloseButton onClick={onCancel}>キャンセル</CloseButton>
          <SubmitButton onClick={handleConfirm} isSubmit={true} text="確認" />
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
