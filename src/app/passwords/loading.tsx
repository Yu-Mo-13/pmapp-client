import React from 'react';
import Title from '@/components/Title';

const Loading: React.FC = () => {
  return (
    <main className="flex-1 p-6" role="main">
      <div className="flex justify-between items-center mb-8">
        <Title title="パスワード検索" />
      </div>

      <p className="text-sm text-gray-600" aria-live="polite">
        読み込み中...
      </p>
    </main>
  );
};

export default Loading;
