import React from 'react';
import { ApplicationListProps } from '@/app/applications/types';
import ApplicationTable from '@/app/applications/_components/ApplicationTable';
import { redirect } from 'next/navigation';

const ApplicationList: React.FC<ApplicationListProps> = (props: ApplicationListProps) => {
  const handleCreateClick = async () => {
    "use server";
    redirect('/applications/create');
  };

  return (
    <main className="flex-1 p-6" role="main">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">{props.title}</h2>
          <form action={handleCreateClick}>
            <button
              className="text-white w-36 px-6 py-3 rounded bg-[#3CB371] text-[18px] font-medium hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-opacity duration-200"
            >
              新規登録
            </button>
          </form>
        </div>
      <ApplicationTable applications={props.applications} />
    </main>
  );
};

export default ApplicationList;