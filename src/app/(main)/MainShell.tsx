'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

type MainShellProps = {
  children: ReactNode;
  userName: string;
};

export default function MainShell({ children, userName }: MainShellProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen((current) => !current);
  };

  const handleMobileNavigate = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <Header
        userName={userName}
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={handleMobileMenuToggle}
      />
      <div className="relative flex">
        <Sidebar
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileNavigate={handleMobileNavigate}
        />
        {children}
      </div>
    </>
  );
}
