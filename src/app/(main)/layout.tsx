import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

type MainLayoutProps = {
  children: ReactNode;
};

export default async function MainLayout({ children }: MainLayoutProps) {
  const cookieStore = await cookies();
  const userName = cookieStore.get('auth_user_name')?.value;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header userName={userName ?? 'ゲスト'} />
      <div className="flex">
        <Sidebar />
        {children}
      </div>
    </div>
  );
}
