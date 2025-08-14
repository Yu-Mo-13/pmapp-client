// components/Header.tsx

import React from 'react';
import { HeaderProps } from '@/types/header';

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const appName = process.env.APP_NAME || 'PMAPP';
  return (
    <header
      className="text-white p-4 flex justify-between items-center w-full"
      style={{backgroundColor: '#3E3E3E'}}
    >
      <h1 className="text-xl font-bold">{appName}</h1>
      <span className="text-xl">{props.userName}</span>
    </header>
  );
};

export default Header;