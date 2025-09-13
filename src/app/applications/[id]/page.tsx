import React from 'react';
import { redirect } from 'next/navigation';
import Title from '@/components/Title';
import { ApplicationService } from '@/api';
import ApplicationEditForm from './_components/ApplicationEditForm';

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

  // サーバーサイドでアプリケーション情報を取得
  const res = await ApplicationService.show(Number(id));
  const application = res.data;

  // 更新処理のServer Action
  const updateApplication = async (formData: FormData) => {
    'use server';
    // ここで実際の更新処理を実装
    console.log('Form data:', formData);
    redirect('/applications');
  };

  return (
    <main className="flex-1 p-6">
      {/* ヘッダー部分 */}
      <div className="flex justify-between items-center mb-8">
        <Title title="アプリケーション情報の編集" />
      </div>

      {/* フォーム部分 */}
      {application && (
        <ApplicationEditForm
          application={application}
          updateAction={updateApplication}
        />
      )}
    </main>
  );
};

export default ApplicationEditPage;
