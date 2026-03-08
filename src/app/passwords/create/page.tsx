import Title from '@/components/Title';
import {
  AccountApplicationOption,
  AccountService,
} from '@/api/services/account/accountService';
import { getServerAuthConfig } from '@/lib/serverAuthConfig';
import PasswordForm from './_components/PasswordForm';

const PasswordCreatePage = async () => {
  const authConfig = await getServerAuthConfig();
  const res = await AccountService.applications(authConfig);
  const applications: AccountApplicationOption[] = Array.isArray(res.data)
    ? res.data
    : [];

  return (
    <main className="flex-1 p-6">
      {/* ヘッダー部分 */}
      <div className="flex justify-between items-center mb-8">
        <Title title="パスワード登録" />
      </div>

      {/* フォーム部分 */}
      <PasswordForm applications={applications} />
    </main>
  );
};

export default PasswordCreatePage;
