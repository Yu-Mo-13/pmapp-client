import { NotFoundIcon } from '@/app/_components/ErrorIcons';
import ErrorPageCard from '@/components/error/ErrorPageCard';

export default function NotFoundPage() {
  return (
    <ErrorPageCard
      title="404 Not Found"
      message="指定したページが見つかりませんでした。"
      actionHref="/passwords"
      icon={<NotFoundIcon />}
    />
  );
}
