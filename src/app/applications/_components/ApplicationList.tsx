// components/MainContent.tsx

import React from 'react';
import { ApplicationListProps } from '@/components/table/types';
import ApplicationTable from '@/app/applications/_components/ApplicationTable';

const ApplicationList: React.FC<ApplicationListProps> = (props: ApplicationListProps) => {
  return (
    <main className="flex-1 p-6" role="main">
      <h2 className="text-xl font-bold text-gray-800 mb-6">{props.title}</h2>
      <ApplicationTable applications={props.applications} />
    </main>
  );
};

export default ApplicationList;