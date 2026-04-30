import React from 'react';
import { notFound } from 'next/navigation';
import Title from '@/components/Title';
import {
  extractPreregistedPasswordShow,
  PreregistedPasswordService,
} from '@/api/services/preregistedPassword/preregistedPasswordService';
import { guardApiResponse } from '@/app/_lib/responseGuard';
import { getServerAuthConfig } from '@/lib/serverAuthConfig';
import PreregistedPasswordDetailView from './_components/PreregistedPasswordDetailView';

type PageProps = {
  params: Promise<{
    uuid: string;
  }>;
};

const Page: React.FC<PageProps> = async ({ params }) => {
  const { uuid } = await params;
  const authConfig = await getServerAuthConfig();
  const response = guardApiResponse(
    await PreregistedPasswordService.show(uuid, authConfig)
  );

  const item = extractPreregistedPasswordShow(response.data);
  if (!item) {
    notFound();
  }

  return (
    <main className="flex-1 p-4 md:p-6" role="main">
      <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between [&_h2]:mb-0">
        <Title title="仮登録パスワード登録" />
      </div>
      <PreregistedPasswordDetailView item={item} />
    </main>
  );
};

export default Page;
