import React from 'react';
import { notFound } from 'next/navigation';
import Title from '@/components/Title';
import {
  extractPreregistedPasswordTarget,
  PreregistedPasswordService,
} from '@/api/services/preregistedPassword/preregistedPasswordService';
import { guardApiResponse } from '@/app/_lib/responseGuard';
import { getServerAuthConfig } from '@/lib/serverAuthConfig';
import PreregistedPasswordCreateView from './_components/PreregistedPasswordCreateView';

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const getSingleSearchParam = (
  value: string | string[] | undefined
): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

const Page: React.FC<PageProps> = async ({ searchParams }) => {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const applicationId = getSingleSearchParam(resolvedSearchParams.application_id);
  const accountId = getSingleSearchParam(resolvedSearchParams.account_id);

  if (!applicationId) {
    notFound();
  }

  const authConfig = await getServerAuthConfig();
  const response = guardApiResponse(
    await PreregistedPasswordService.target(applicationId, accountId, authConfig)
  );

  const item = extractPreregistedPasswordTarget(response.data);
  if (!item) {
    notFound();
  }

  return (
    <main className="flex-1 p-4 md:p-6" role="main">
      <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between [&_h2]:mb-0">
        <Title title="仮登録パスワード登録" />
      </div>
      <PreregistedPasswordCreateView item={item} />
    </main>
  );
};

export default Page;
