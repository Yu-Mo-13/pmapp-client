import type { ReactNode } from 'react';
import { authorizePageAccess, APP_USER_ROLES } from '@/lib/authorization';

type PasswordCreateLayoutProps = {
  children: ReactNode;
};

export default async function PasswordCreateLayout({
  children,
}: PasswordCreateLayoutProps) {
  await authorizePageAccess([APP_USER_ROLES.admin, APP_USER_ROLES.general]);

  return <>{children}</>;
}
