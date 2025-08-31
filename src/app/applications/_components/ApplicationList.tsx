import React from 'react';
import { ApplicationListProps } from '@/app/applications/types';
import ApplicationTable from '@/app/applications/_components/ApplicationTable';
import { redirect } from 'next/navigation';
import SubmitButton from '@/components/button/SubmitButton';

const ApplicationList: React.FC<ApplicationListProps> = (props: ApplicationListProps) => {
  const handleCreateClick = async () => {
    "use server";
    redirect('/applications/create');
  };

  return (
    <main className="flex-1 p-6" role="main">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">{props.title}</h2>
          <SubmitButton onSubmit={handleCreateClick} text="新規登録" />
        </div>
      <ApplicationTable applications={props.applications} />
    </main>
  );
};

export default ApplicationList;