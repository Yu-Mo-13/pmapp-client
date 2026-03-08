import Title from '@/components/Title';
import {
  AccountIndexRow,
  AccountService,
} from '@/api/services/account/accountService';
import {
  Application,
  ApplicationService,
} from '@/api/services/application/applicationService';
import { getServerAuthConfig } from '@/lib/serverAuthConfig';
import PasswordForm from './_components/PasswordForm';
import { redirect } from 'next/navigation';

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const extractApplications = (
  value: unknown
): Pick<Application, 'id' | 'name' | 'mark_class'>[] => {
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
      const markClass = item.mark_class;
      if (
        typeof id !== 'number' ||
        typeof name !== 'string' ||
        typeof markClass !== 'boolean'
      ) {
        return null;
      }

      return { id, name, mark_class: markClass };
    })
    .filter(
      (item): item is Pick<Application, 'id' | 'name' | 'mark_class'> =>
        item !== null
    );
};

const extractAccounts = (value: unknown): AccountIndexRow[] => {
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
      const applicationId = item.application_id;
      const applicationName = item.application_name;
      const noticeClass = item.notice_class;

      if (
        typeof id !== 'number' ||
        typeof name !== 'string' ||
        typeof applicationId !== 'number' ||
        typeof applicationName !== 'string' ||
        typeof noticeClass !== 'boolean'
      ) {
        return null;
      }

      return {
        id,
        name,
        application_id: applicationId,
        application_name: applicationName,
        notice_class: noticeClass,
      };
    })
    .filter((item): item is AccountIndexRow => item !== null);
};

const PasswordCreatePage = async () => {
  const authConfig = await getServerAuthConfig();
  const [applicationsResponse, accountsResponse] = await Promise.all([
    ApplicationService.index(authConfig),
    AccountService.index(authConfig),
  ]);

  if (
    (!applicationsResponse.success &&
      applicationsResponse.error?.status === 401) ||
    (!accountsResponse.success && accountsResponse.error?.status === 401)
  ) {
    redirect('/login');
  }

  const applications = applicationsResponse.success
    ? extractApplications(applicationsResponse.data)
    : [];
  const accounts = accountsResponse.success
    ? extractAccounts(accountsResponse.data)
    : [];

  return (
    <main className="flex-1 p-6">
      {/* ヘッダー部分 */}
      <div className="flex justify-between items-center mb-8">
        <Title title="パスワード登録" />
      </div>

      {/* フォーム部分 */}
      <PasswordForm applications={applications} accounts={accounts} />
    </main>
  );
};

export default PasswordCreatePage;
