// components/Sidebar.tsx

import React from 'react';
import { SidebarProps } from '@/types/sidebar';

const Sidebar: React.FC<SidebarProps> = (props: SidebarProps) => {
  const menuItems = [
    'アプリケーション一覧',
    'アカウント一覧',
    'パスワード検索',
    '未登録パスワード一覧',
    '仮登録パスワード一覧',
  ] as const;

  return (
    <nav
      className="w-48 text-white min-h-screen"
      style={{ backgroundColor: '#3E3E3E' }}
      role="navigation"
      aria-label="メインナビゲーション"
    >
      {menuItems.map((item) => (
        <button
          key={item}
          type="button"
          className={`w-full text-left px-4 py-4 text-sm cursor-pointer border-b border-gray-600 relative transition-colors duration-200 ${
            item === props.activeMenu ? 'font-medium' : 'hover:bg-gray-600'
          }`}
          style={
            item === props.activeMenu ? { backgroundColor: '#555555' } : {}
          }
          // onClick={() => props.onMenuClick?.(item)}
          aria-current={item === props.activeMenu ? 'page' : undefined}
        >
          {item}
          {item === props.activeMenu && (
            <div
              className="absolute right-0 top-0 bottom-0 w-1"
              style={{ backgroundColor: '#3CB371' }}
              aria-hidden="true"
            />
          )}
        </button>
      ))}
    </nav>
  );
};

export default Sidebar;
