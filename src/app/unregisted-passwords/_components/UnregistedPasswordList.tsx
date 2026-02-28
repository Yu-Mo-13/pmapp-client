import React from 'react';
import Title from '@/components/Title';
import { ErrorMessage } from '@/components/form/ErrorMessage';
import { UnregistedPasswordIndexRow } from '@/api/services/unregistedPassword/unregistedPasswordService';
import UnregistedPasswordTable from './UnregistedPasswordTable';
import DeleteAllUnregistedPasswordsButton from './DeleteAllUnregistedPasswordsButton';

type UnregistedPasswordListProps = {
  title: string;
  rows: UnregistedPasswordIndexRow[];
  errorMessage?: string;
};

const UnregistedPasswordList: React.FC<UnregistedPasswordListProps> = ({
  title,
  rows,
  errorMessage,
}) => {
  return (
    <main className="flex-1 p-6" role="main">
      <div className="flex justify-between items-center mb-8">
        <Title title={title} />
        <DeleteAllUnregistedPasswordsButton disabled={rows.length === 0} />
      </div>

      {errorMessage && <ErrorMessage message={errorMessage} className="mb-4" />}

      <UnregistedPasswordTable rows={rows} />
    </main>
  );
};

export default UnregistedPasswordList;
