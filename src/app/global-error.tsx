'use client';

import { useEffect } from 'react';
import { ServerErrorIcon } from '@/app/_components/ErrorIcons';
import ErrorPageCard from '@/components/error/ErrorPageCard';

type GlobalErrorPageProps = {
  error: Error & { digest?: string };
};

export default function GlobalErrorPage({ error }: GlobalErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ja">
      <body>
        <ErrorPageCard
          title="500 Internal Server Error"
          message="システムに異常が発生しています。"
          actionHref="/passwords"
          icon={<ServerErrorIcon />}
        />
      </body>
    </html>
  );
}
