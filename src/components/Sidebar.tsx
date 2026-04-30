// components/Sidebar.tsx
'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarProps } from '@/types/sidebar';
import { extractMenuItems, MenuService } from '@/api/services/menu/menuService';

const Sidebar: React.FC<SidebarProps> = ({
  className,
  isMobileMenuOpen,
  onMobileNavigate,
}) => {
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
      setMenuItems(items);
    };

    void loadMenus();
    return () => {
      ignore = true;
    };
  }, [pathname]);

  if (menuItems.length === 0) {
    return null;
  }

  return (
    <>
      <nav
        className={`hidden w-48 min-h-screen text-white md:block ${
          className ?? ''
        }`.trim()}
        style={{ backgroundColor: '#3E3E3E' }}
        role="navigation"
        aria-label="メインナビゲーション"
      >
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`block w-full text-left px-4 py-4 text-sm cursor-pointer border-b border-gray-600 relative transition-colors duration-200 ${
              pathname.includes(item.path) ? 'font-medium' : 'hover:bg-gray-600'
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
      {isMobileMenuOpen && (
        <div
          className="fixed inset-x-0 bottom-0 top-14 z-40 bg-black/10 md:hidden"
          onClick={onMobileNavigate}
        >
          <div
            id="mobile-navigation"
            className="mx-5 mt-4 overflow-hidden border border-white text-white shadow-lg"
            style={{ backgroundColor: '#3E3E3E' }}
            role="navigation"
            aria-label="モバイルメインナビゲーション"
            onClick={(event) => event.stopPropagation()}
          >
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block w-full px-4 py-5 text-center text-[18px] border-b border-gray-300 last:border-b-0 active:bg-[#555555] ${
                  pathname.includes(item.path) ? 'font-medium' : ''
                }`}
                style={{ backgroundColor: '#3E3E3E' }}
                aria-current={pathname.includes(item.path) ? 'page' : undefined}
                onClick={onMobileNavigate}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
