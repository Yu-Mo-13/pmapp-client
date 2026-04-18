import type { ReactNode } from 'react';
import { authorizePageAccess, APP_USER_ROLES } from '@/lib/authorization';

type PasswordsLayoutProps = {
  children: ReactNode;
};

export default async function PasswordsLayout({
  children,
}: PasswordsLayoutProps) {
  await authorizePageAccess([
    APP_USER_ROLES.admin,
    APP_USER_ROLES.general,
    APP_USER_ROLES.mobile,
  ]);

  return <>{children}</>;
}
