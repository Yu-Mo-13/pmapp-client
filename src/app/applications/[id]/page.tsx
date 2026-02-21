import React from 'react';
import Title from '@/components/Title';
import { ApplicationService } from '@/api';
import ApplicationEditForm from './_components/ApplicationEditForm';
import { getServerAuthConfig } from '@/lib/serverAuthConfig';

type ApplicationEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const ApplicationEditPage: React.FC<ApplicationEditPageProps> = async ({
  params,
}) => {
  // paramsをawaitで取得
  const { id } = await params;
  const authConfig = await getServerAuthConfig();

  // サーバーサイドでアプリケーション情報を取得
  const res = await ApplicationService.show(Number(id), authConfig);
  const application = res.data;

  return (
    <main className="flex-1 p-6">
      {/* ヘッダー部分 */}
      <div className="flex justify-between items-center mb-8">
        <Title title="アプリケーション情報の編集" />
      </div>

      {/* フォーム部分 */}
      {application && <ApplicationEditForm application={application} />}
    </main>
  );
};

export default ApplicationEditPage;
