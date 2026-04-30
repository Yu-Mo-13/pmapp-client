import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import AuthSessionGuard from './AuthSessionGuard';
import MainShell from './MainShell';

type MainLayoutProps = {
  children: ReactNode;
};

export default async function MainLayout({ children }: MainLayoutProps) {
  const cookieStore = await cookies();
  const userName = cookieStore.get('auth_user_name')?.value;

  return (
    <div className="min-h-screen bg-gray-100">
      <AuthSessionGuard />
      <MainShell userName={userName ?? 'ゲスト'}>{children}</MainShell>
    </div>
  );
}
