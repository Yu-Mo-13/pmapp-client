import React from 'react';
import { redirect, useRouter } from 'next/navigation';
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

    const TOGGLE_ON = '1';
    const request = {
      application: {
        name: formData.get('name') as string,
        account_class: formData.get('account_class') === TOGGLE_ON,
        notice_class: formData.get('notice_class') === TOGGLE_ON,
        mark_class: formData.get('mark_class') === TOGGLE_ON,
        pre_password_size: Number(formData.get('pre_password_size')),
      },
    };

    await ApplicationService.update(Number(id), request);

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
