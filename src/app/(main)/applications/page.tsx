import React from 'react';
import { Application } from '@/api/services/application/applicationService';
import { ApplicationService } from '@/api/services/application/applicationService';
import { guardApiResponse } from '@/app/_lib/responseGuard';
import { getServerAuthConfig } from '@/lib/serverAuthConfig';
import ApplicationList from './_components/ApplicationList';

const Page: React.FC = async () => {
  const authConfig = await getServerAuthConfig();
  const res = guardApiResponse(await ApplicationService.index(authConfig));
  const applications: Application[] = Array.isArray(res.data) ? res.data : [];

  return (
    <ApplicationList
      title={'アプリケーション一覧'}
      applications={applications}
    />
  );
};

export default Page;
