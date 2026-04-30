import React from 'react';
import Title from '@/components/Title';
import { ErrorMessage } from '@/components/form/ErrorMessage';
import { PreregistedPasswordIndexRow } from '@/api/services/preregistedPassword/preregistedPasswordService';
import PreregistedPasswordTable from './PreregistedPasswordTable';

type PreregistedPasswordListProps = {
  title: string;
  rows: PreregistedPasswordIndexRow[];
  errorMessage?: string;
};

const PreregistedPasswordList: React.FC<PreregistedPasswordListProps> = ({
  title,
  rows,
  errorMessage,
}) => {
  return (
    <main className="flex-1 p-4 md:p-6" role="main">
      <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between [&_h2]:mb-0">
        <Title title={title} />
      </div>

      {errorMessage && <ErrorMessage message={errorMessage} className="mb-4" />}

      <PreregistedPasswordTable rows={rows} />
    </main>
  );
};

export default PreregistedPasswordList;
