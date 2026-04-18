import type { ReactNode } from 'react';
import { authorizePageAccess, APP_USER_ROLES } from '@/lib/authorization';

type TempPasswordsLayoutProps = {
  children: ReactNode;
};

export default async function TempPasswordsLayout({
  children,
}: TempPasswordsLayoutProps) {
  await authorizePageAccess([
    APP_USER_ROLES.admin,
    APP_USER_ROLES.general,
    APP_USER_ROLES.mobile,
  ]);

  return <>{children}</>;
}
