// components/table/DetailButton.tsx

'use client';

import React from 'react';

interface ButtonProps {
  text: string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, onClick }) => {
  return (
    <button
      type="button"
      className="text-white px-6 py-3 rounded text-sm font-medium hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-opacity duration-200"
      style={{backgroundColor: '#3CB371'}}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;