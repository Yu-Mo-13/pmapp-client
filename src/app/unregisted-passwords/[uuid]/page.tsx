import React from 'react';
import { notFound, redirect } from 'next/navigation';
import Title from '@/components/Title';
import {
  extractUnregistedPasswordShow,
  UnregistedPasswordService,
} from '@/api/services/unregistedPassword/unregistedPasswordService';
import { getServerAuthConfig } from '@/lib/serverAuthConfig';
import UnregistedPasswordDetailView from './_components/UnregistedPasswordDetailView';

type PageProps = {
  params: Promise<{
    uuid: string;
  }>;
};

const Page: React.FC<PageProps> = async ({ params }) => {
  const { uuid } = await params;
  const authConfig = await getServerAuthConfig();
  const response = await UnregistedPasswordService.show(uuid, authConfig);
  if (!response.success && response.error?.status === 401) {
    redirect('/login');
  }

  if (!response.success) {
    notFound();
  }

  const item = extractUnregistedPasswordShow(response.data);
  if (!item) {
    notFound();
  }

  return (
    <main className="flex-1 p-6" role="main">
      <div className="flex justify-between items-center mb-8">
        <Title title="未登録パスワード登録" />
      </div>
      <UnregistedPasswordDetailView item={item} />
    </main>
  );
};

export default Page;
