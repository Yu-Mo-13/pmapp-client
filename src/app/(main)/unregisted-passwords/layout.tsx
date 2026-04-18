import type { ReactNode } from 'react';
import { authorizePageAccess, APP_USER_ROLES } from '@/lib/authorization';

type UnregistedPasswordsLayoutProps = {
  children: ReactNode;
};

export default async function UnregistedPasswordsLayout({
  children,
}: UnregistedPasswordsLayoutProps) {
  await authorizePageAccess([APP_USER_ROLES.admin, APP_USER_ROLES.general]);

  return <>{children}</>;
}
