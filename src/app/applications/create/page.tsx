import React from 'react';
import Title from '@/components/Title';
import ApplicationForm from './ApplicationForm';

const ApplicationCreatePage: React.FC = () => {
  return (
    <main className="flex-1 p-6">
      {/* ヘッダー部分 */}
      <div className="flex justify-between items-center mb-8">
        <Title title="アプリケーション新規登録" />
      </div>

      {/* フォーム部分 */}
      <ApplicationForm />
    </main>
  );
};

export default ApplicationCreatePage;
