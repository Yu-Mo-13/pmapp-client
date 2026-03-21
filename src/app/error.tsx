'use client';

import { useEffect } from 'react';
import { ServerErrorIcon } from '@/app/_components/ErrorIcons';
import ErrorPageCard from '@/components/error/ErrorPageCard';

type ErrorPageProps = {
  error: Error & { digest?: string };
};

export default function ErrorPage({ error }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorPageCard
      title="500 Internal Server Error"
      message="システムに異常が発生しています。"
      actionHref="/passwords"
      icon={<ServerErrorIcon />}
    />
  );
}
