import React from 'react';
import { redirect } from 'next/navigation';
import CancelButton from '@/components/button/CancelButton';
import Title from '@/components/Title';
import ToggleButton from '@/components/ToggleButton';
import NumberInput from '@/components/NumberInput';
import SubmitButton from '@/components/button/SubmitButton';
import { ApplicationService, ApplicationCreateValidationError } from '@/api/services/application/applicationService';

interface ApplicationCreatePageProps {
  searchParams?: {
    errors?: string;
  };
}

const ApplicationCreatePage: React.FC<ApplicationCreatePageProps> = ({ searchParams }) => {
  let errors: ApplicationCreateValidationError | null = null;
  
  if (searchParams?.errors) {
    try {
      errors = JSON.parse(decodeURIComponent(searchParams.errors));
    } catch (e) {
      console.error('Error parsing validation errors:', e);
    }
  }

  const handleRegistClick = async (formData: FormData) => {
    "use server";
    
    const name = formData.get('name') as string;
    const accountClass = formData.get('account_class') === 'on';
    const noticeClass = formData.get('notice_class') === 'on';
    const markClass = formData.get('mark_class') === 'on';
    const prePasswordSize = parseInt(formData.get('pre_password_size') as string) || 10;
    
    try {
      const response = await ApplicationService.create({
        application: {
          name,
          account_class: accountClass,
          notice_class: noticeClass,
          mark_class: markClass,
          pre_password_size: prePasswordSize,
        }
      });
      
      if ('errors' in response && response.errors) {
        const errorParam = encodeURIComponent(JSON.stringify(response.errors));
        redirect(`/applications/create?errors=${errorParam}`);
      } else {
        redirect('/applications');
      }
    } catch (error) {
      console.error('Application creation failed:', error);
      const errorParam = encodeURIComponent(JSON.stringify({
        application: { name: ['登録に失敗しました。再度お試しください。'] }
      }));
      redirect(`/applications/create?errors=${errorParam}`);
    }
  };
  return (
    <main className="flex-1 p-6">
        {/* ヘッダー部分 */}
        <div className="flex justify-between items-center mb-8">
          <Title title="アプリケーション新規登録" />
        </div>

        {/* フォーム部分 */}
        <form action={handleRegistClick} className="px-6 space-y-6 text-[20px]">
          {/* アプリケーション名 */}
          <div>
            <label className="block text-gray-700 font-medium mb-3">
              アプリケーション名
            </label>
            <input
              type="text"
              name="name"
              className="w-[97%] m-4 text-black px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            {errors?.application?.name && (
              <div className="text-red-500 text-sm mt-1 ml-4">
                {errors.application.name.join(', ')}
              </div>
            )}
          </div>

          {/* アカウント区分 */}
          <div className="flex items-center gap-[132px]">
            <label className="text-gray-700 font-medium mb-3">
              アカウント区分
            </label>
            <div className="flex items-center">
              <ToggleButton name="account_class" />
            </div>
            {errors?.application?.account_class && (
              <div className="text-red-500 text-sm mt-1">
                {errors.application.account_class.join(', ')}
              </div>
            )}
          </div>

          {/* 定期通知区分 */}
          <div className="flex items-center gap-[152px]">
            <label className="text-gray-700 font-medium mb-3">
              定期通知区分
            </label>
            <div className="flex items-center">
              <ToggleButton name="notice_class" />
            </div>
            {errors?.application?.notice_class && (
              <div className="text-red-500 text-sm mt-1">
                {errors.application.notice_class.join(', ')}
              </div>
            )}
          </div>

          {/* 記号区分 */}
          <div className="flex items-center gap-48">
            <label className="text-gray-700 font-medium mb-3">
              記号区分
            </label>
            <div className="flex items-center">
              <ToggleButton name="mark_class" />
            </div>
            {errors?.application?.mark_class && (
              <div className="text-red-500 text-sm mt-1">
                {errors.application.mark_class.join(', ')}
              </div>
            )}
          </div>

          {/* 仮登録パスワード桁数 */}
          <div className="flex items-center gap-[74px]">
            <label className="text-gray-700 font-medium mb-3">
              仮登録パスワード桁数
            </label>
            <NumberInput name="pre_password_size" defaultValue={10} min={1} step={1} />
            {errors?.application?.pre_password_size && (
              <div className="text-red-500 text-sm mt-1">
                {errors.application.pre_password_size.join(', ')}
              </div>
            )}
          </div>

          {/* ボタン部分 */}
          <div className="flex justify-center mt-14 gap-32">
            <CancelButton to="/applications" />
            <SubmitButton onSubmit={() => {
              const form = document.querySelector('form');
              if (form) {
                const formData = new FormData(form as HTMLFormElement);
                handleRegistClick(formData);
              }
            }} text="登録" />
          </div>
        </form>
    </main>
  );
};

export default ApplicationCreatePage;
