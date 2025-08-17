// components/PmappUI.tsx

import React from 'react';
import { Application } from '@/api/services/application/applicationService';
import ApplicationList from '@/app/applications/_components/ApplicationList';
import { ApplicationService } from '@/api/services/application/applicationService';

const Page: React.FC = async () => {
  const res = await ApplicationService.index();
  console.log(res);
  const applications: Application[] = Array.isArray(res.data) ? res.data : [];

  return (
    <ApplicationList
      title={'アプリケーション一覧'}
      applications={applications}
    />
  );
};

export default Page;