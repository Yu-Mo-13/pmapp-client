import React, { Suspense } from 'react';
import PasswordList from './_components/PasswordList';
import { PasswordApplicationOption } from './types';
import { ApplicationService } from '@/api/services/application/applicationService';
import {
  extractPasswordIndexRows,
  PasswordService,
} from '@/api/services/password/passwordService';
import { guardApiResponse } from '@/app/_lib/responseGuard';
import { getServerAuthConfig } from '@/lib/serverAuthConfig';

type PasswordPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const extractApplicationOptions = (value: unknown): PasswordApplicationOption[] => {
  const list = Array.isArray(value)
    ? value
    : isObject(value) && Array.isArray(value.data)
      ? value.data
      : [];

  return list
    .map((item) => {
      if (!isObject(item)) {
        return null;
      }

      const id = item.id;
      const name = item.name;

      if (typeof id !== 'number' || typeof name !== 'string' || name.length === 0) {
        return null;
      }

      return { id, name };
    })
    .filter((item): item is PasswordApplicationOption => item !== null);
};

const parseApplicationId = (
  value: string | string[] | undefined
): number | undefined => {
  const rawValue = Array.isArray(value) ? value[0] : value;

  if (!rawValue) {
    return undefined;
  }

  const parsedValue = Number(rawValue);
  return Number.isInteger(parsedValue) ? parsedValue : undefined;
};

const Page: React.FC<PasswordPageProps> = async ({ searchParams }) => {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const selectedApplicationId = parseApplicationId(
    resolvedSearchParams.application_id
  );
  const authConfig = await getServerAuthConfig();
  const [applicationsResponse, passwordsResponse] = await Promise.all([
    ApplicationService.index(authConfig),
    PasswordService.index(selectedApplicationId ?? undefined, authConfig),
  ]).then(([applications, passwords]) => [
    guardApiResponse(applications),
    guardApiResponse(passwords),
  ]);

  const applications = applicationsResponse.success
    ? extractApplicationOptions(applicationsResponse.data)
    : [];
  const rows = passwordsResponse.success
    ? extractPasswordIndexRows(passwordsResponse.data)
    : [];
  return (
    <PasswordList
      title="パスワード検索"
      rows={rows}
      applications={applications}
      selectedApplicationId={selectedApplicationId?.toString()}
    />
  );
};

const PasswordListFallback: React.FC = () => (
  <main className="flex-1 p-6" role="main">
    <div className="flex justify-between items-center mb-8">
      <span className="text-2xl font-bold">パスワード検索</span>
    </div>
    <p className="text-sm text-gray-600">読み込み中...</p>
  </main>
);

const PasswordPage: React.FC<PasswordPageProps> = async (props) => {
  return (
    <Suspense fallback={<PasswordListFallback />}>
      <Page {...props} />
    </Suspense>
  );
};

export default PasswordPage;
