// components/Sidebar.tsx
'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarProps } from '@/types/sidebar';
import { extractMenuItems, MenuService } from '@/api/services/menu/menuService';

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const pathname = usePathname();
  const [menuItems, setMenuItems] = useState<{ name: string; path: string }[]>(
    []
  );

  useEffect(() => {
    let ignore = false;

    const loadMenus = async () => {
      const response = await MenuService.index();

      if (ignore || !response.success) {
        return;
      }

      const items = extractMenuItems(response.data);
      if (items.length > 0) {
        setMenuItems(items);
      }
    };

    void loadMenus();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <nav
      className={`w-48 text-white min-h-screen ${className ?? ''}`.trim()}
      style={{ backgroundColor: '#3E3E3E' }}
      role="navigation"
      aria-label="メインナビゲーション"
    >
      {menuItems.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={`block w-full text-left px-4 py-4 text-sm cursor-pointer border-b border-gray-600 relative transition-colors duration-200 ${
            pathname.includes(item.path)
              ? 'font-medium'
              : 'hover:bg-gray-600'
          }`}
          style={
            pathname.includes(item.path) ? { backgroundColor: '#555555' } : {}
          }
          aria-current={pathname.includes(item.path) ? 'page' : undefined}
        >
          {item.name}
          {pathname.includes(item.path) && (
            <div
              className="absolute right-0 top-0 bottom-0 w-1"
              style={{ backgroundColor: '#3CB371' }}
              aria-hidden="true"
            />
          )}
        </Link>
      ))}
    </nav>
  );
};

export default Sidebar;
