import type { ReactNode } from 'react';
import { authorizePageAccess, APP_USER_ROLES } from '@/lib/authorization';

type ApplicationsLayoutProps = {
  children: ReactNode;
};

export default async function ApplicationsLayout({
  children,
}: ApplicationsLayoutProps) {
  await authorizePageAccess([APP_USER_ROLES.admin]);

  return <>{children}</>;
}
