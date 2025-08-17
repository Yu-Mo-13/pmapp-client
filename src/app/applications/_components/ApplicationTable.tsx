// components/ApplicationTable.tsx

import React from 'react';
import { ApplicationTableProps } from '../types';
import { Th, TableRowWrapper } from '@/components/table';
import ApplicationTr from '@/app/applications/_components/ApplicationTr';

const ApplicationTable: React.FC<ApplicationTableProps> = ({ applications }) => {
  const headerStyle = { backgroundColor: '#3E3E3E', borderColor: '#3E3E3E' };

  return (
    <div className="bg-white shadow overflow-hidden">
      <table className="w-full" role="table" aria-label="アプリケーション一覧">
        <thead>
          <TableRowWrapper className="text-white">
            <Th
              className="border-r"
              style={headerStyle}
            >
              アプリケーション名
            </Th>

            <Th
              className="border-r"
              style={headerStyle}
            >
              記号区分
            </Th>

            <Th
              className="border-r"
              style={headerStyle}
            >
              変更通知区分
            </Th>

            <Th
              className="border-r"
              style={headerStyle}
            >
              アカウント区分
            </Th>

            <Th style={headerStyle}>
              操作
            </Th>
          </TableRowWrapper>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {applications && applications.map((app) => (
            <ApplicationTr key={app.id} application={app} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationTable;