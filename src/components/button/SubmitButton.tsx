"use client";

import { useState, useCallback } from 'react';

// デバウンス時間（ミリ秒）
const DEBOUNCE_MS = 1000;

interface SubmitButtonProps {
  onClick?: () => void;
  isSubmit?: boolean;
  text: string;
}

export default function SubmitButton(props: SubmitButtonProps) {
  const { onClick, isSubmit, text } = props;
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = useCallback(() => {
    if (isClicked) {
      return;
    }

    setIsClicked(true);
    onClick?.();

    // 指定時間後に再度クリック可能にする
    setTimeout(() => {
      setIsClicked(false);
    }, DEBOUNCE_MS);
  }, [isClicked, onClick]);

  return (
      <button
        className={`text-white w-36 px-6 py-3 rounded text-[18px] font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-opacity duration-200 ${
          isClicked 
            ? 'bg-gray-400 cursor-not-allowed opacity-60' 
            : 'bg-[#3CB371] hover:opacity-80'
        }`}
        type={isSubmit ? 'submit' : 'button'}
        onClick={handleClick}
        disabled={isClicked}
      >
        {text}
      </button>
  );
}
