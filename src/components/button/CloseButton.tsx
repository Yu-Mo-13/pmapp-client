import React from 'react';

type CloseButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
};

export const CloseButton: React.FC<CloseButtonProps> = ({
  onClick,
  children,
  disabled,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-6 py-3 w-36 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
                 border border-red-600 text-red-600 bg-white
                 hover:bg-red-600 hover:text-white focus:ring-red-500
                 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={disabled}
    >
      {children}
    </button>
  );
};
