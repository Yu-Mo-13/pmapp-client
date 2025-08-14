// components/PmappUI.tsx

import React from 'react';
import { Application } from '@/components/table/types';
import ApplicationList from '@/app/applications/_components/ApplicationList';

const PmappUI: React.FC = () => {
  // Next.jsでは通常、getServerSidePropsやgetStaticPropsでデータ取得
  const sampleApplications: Application[] = [
    {
      id: "aws",
      name: "Amazon Web Services",
      symbol: "あり",
      notification: "毎月",
      account: "個人",
    },
    {
      id: "gws",
      name: "Google Workspace",
      symbol: "あり",
      notification: "",
      account: "法人",
    },
    {
      id: "m365",
      name: "Microsoft 365",
      symbol: "なし",
      notification: "",
      account: "",
    },
  ];

  return (
    <ApplicationList
      title={'アプリケーション一覧'}
      applications={sampleApplications}
    />
  );
};

export default PmappUI;