import React from 'react';
import Image from 'next/image';
import ToggleOff from '@/assets/images/toggle/toggleOff.svg';
// import ToggleOn from '@/assets/images/toggle/toggleOn.svg';
import ArrowUp from '@/assets/images/arrow/arrowUp.svg';
import ArrowDown from '@/assets/images/arrow/arrowDown.svg';
import { redirect } from 'next/navigation';

const ApplicationCreatePage: React.FC = () => {
  const handleCancelClick = async () => {
    "use server";
    redirect('/applications');
  }
  const handleRegistClick = async () => {
    "use server";
    redirect('/applications');
  };
  return (
    <main className="flex-1 p-6">
        {/* ヘッダー部分 */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">アプリケーション新規登録</h2>
        </div>

        {/* フォーム部分 */}
        <div className="px-6 space-y-6 text-[20px]">
          {/* アプリケーション名 */}
          <div>
            <label className="block text-gray-700 font-medium mb-3">
              アプリケーション名
            </label>
            <input
              type="text"
              className="w-[97%] m-4 text-black px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          {/* アカウント区分 */}
          <div className="flex items-center gap-[132px]">
            <label className="text-gray-700 font-medium mb-3">
              アカウント区分
            </label>
            <div className="flex items-center">
              <button type="button" className="mb-3">
                <Image src={ToggleOff} alt="Toggle Off" width={44} height={24} />
              </button>
            </div>
          </div>

          {/* 定期通知区分 */}
          <div className="flex items-center gap-[152px]">
            <label className="text-gray-700 font-medium mb-3">
              定期通知区分
            </label>
            <div className="flex items-center">
              <button type="button" className="mb-3">
                <Image src={ToggleOff} alt="Toggle Off" width={44} height={24} />
              </button>
            </div>
          </div>

          {/* 記号区分 */}
          <div className="flex items-center gap-48">
            <label className="text-gray-700 font-medium mb-3">
              記号区分
            </label>
            <div className="flex items-center">
              <button type="button" className="mb-3">
                <Image src={ToggleOff} alt="Toggle Off" width={44} height={24} />
              </button>
            </div>
          </div>

          {/* 仮登録パスワード桁数 */}
          <div className="flex items-center gap-[74px]">
            <label className="text-gray-700 font-medium mb-3">
              仮登録パスワード桁数
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                defaultValue={10}
                min={1}
                step={1}
                className="px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white w-24 pr-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <div className="absolute right-1 flex flex-col">
                <button
                  type="button"
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Image src={ArrowUp} alt="増加" width={16} height={16} />
                </button>
                <button
                  type="button"
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Image src={ArrowDown} alt="減少" width={16} height={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ボタン部分 */}
        <div className="flex justify-center mt-14 gap-32">
          <form action={handleCancelClick}>
            <button className="px-8 py-3 text-[18px] border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">
              キャンセル
            </button>
          </form>
          <form action={handleRegistClick}>
            <button
              className="text-white w-36 px-6 py-3 rounded bg-[#3CB371] text-[18px] font-medium hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-opacity duration-200"
            >
              登録
            </button>
          </form>
        </div>
    </main>
  );
};

export default ApplicationCreatePage;
