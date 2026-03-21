import React from 'react';
import { notFound } from 'next/navigation';
import Title from '@/components/Title';
import {
  extractUnregistedPasswordShow,
  UnregistedPasswordService,
} from '@/api/services/unregistedPassword/unregistedPasswordService';
import { guardApiResponse } from '@/app/_lib/responseGuard';
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
  const response = guardApiResponse(
    await UnregistedPasswordService.show(uuid, authConfig)
  );

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
