// components/ApplicationTable.tsx

import React from 'react';
import { ApplicationTableProps, Application } from '@/components/table/types';
import { Th, Tr, TableRowWrapper } from '@/components/table';

const ApplicationTable: React.FC<ApplicationTableProps> = ({ applications = [] }) => {
  const defaultApplications: Application[] = [
    { id: "1", name: "Amazon", symbol: "あり", notification: "", account: "" },
    { id: "2", name: "XXX", symbol: "なし", notification: "", account: "" },
    { id: "3", name: "XXX", symbol: "...", notification: "", account: "" },
    { id: "4", name: "...", symbol: "", notification: "", account: "" },
  ];

  const data = applications.length > 0 ? applications : defaultApplications;
  const emptyRows = Math.max(0, 10 - data.length);

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
          {data.map((app, index) => (
            <Tr key={app.id || `app-${index}`} application={app} />
          ))}
          {Array.from({ length: emptyRows }, (_, index) => (
            <Tr key={`empty-${index}`} application={{}} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationTable;