import type { ReactNode } from 'react';
import { authorizePageAccess, APP_USER_ROLES } from '@/lib/authorization';

type AccountsLayoutProps = {
  children: ReactNode;
};

export default async function AccountsLayout({ children }: AccountsLayoutProps) {
  await authorizePageAccess([APP_USER_ROLES.admin]);

  return <>{children}</>;
}
