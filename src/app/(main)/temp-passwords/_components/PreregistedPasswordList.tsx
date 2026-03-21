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
    <main className="flex-1 p-6" role="main">
      <div className="flex justify-between items-center mb-8">
        <Title title={title} />
      </div>

      {errorMessage && <ErrorMessage message={errorMessage} className="mb-4" />}

      <PreregistedPasswordTable rows={rows} />
    </main>
  );
};

export default PreregistedPasswordList;
