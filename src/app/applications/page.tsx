import React from 'react';
import { Application } from '@/api/services/application/applicationService';
import ApplicationList from '@/app/applications/_components/ApplicationList';
import { ApplicationService } from '@/api/services/application/applicationService';
import { getServerAuthConfig } from '@/lib/serverAuthConfig';

const Page: React.FC = async () => {
  const authConfig = await getServerAuthConfig();
  const res = await ApplicationService.index(authConfig);
  const applications: Application[] = Array.isArray(res.data) ? res.data : [];

  return (
    <ApplicationList
      title={'アプリケーション一覧'}
      applications={applications}
    />
  );
};

export default Page;
