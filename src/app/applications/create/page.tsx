import React from 'react';

const ApplicationCreatePage: React.FC = () => {
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
              className="w-full m-4 text-black px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          {/* アカウント区分 */}
          <div className="flex items-center gap-[132px]">
            <label className="text-gray-700 font-medium mb-3">
              アカウント区分
            </label>
            <div className="flex items-center">
              <button
                type="button"
                className="relative inline-flex h-6 w-11 mb-3 items-center rounded-full transition-colors bg-gray-300"
              >
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
              </button>
            </div>
          </div>

          {/* 定期通知区分 */}
          <div className="flex items-center gap-[152px]">
            <label className="text-gray-700 font-medium mb-3">
              定期通知区分
            </label>
            <div className="flex items-center">
              <button
                type="button"
                className="relative inline-flex h-6 w-11 mb-3 items-center rounded-full transition-colors bg-green-500"
              >
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
              </button>
            </div>
          </div>

          {/* 記号区分 */}
          <div className="flex items-center gap-48">
            <label className="text-gray-700 font-medium mb-3">
              記号区分
            </label>
            <div className="flex items-center">
              <button
                type="button"
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-gray-300 mb-3"
              >
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
              </button>
            </div>
          </div>

          {/* 仮登録パスワード桁数 */}
          <div className="flex items-center gap-[72px]">
            <label className="text-gray-700 font-medium mb-3">
              仮登録パスワード桁数
            </label>
            <select
              defaultValue={8}
              className="px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
            >
              <option value={4}>4</option>
              <option value={6}>6</option>
              <option value={8}>8</option>
              <option value={10}>10</option>
              <option value={12}>12</option>
            </select>
          </div>
        </div>

        {/* ボタン部分 */}
        <div className="flex justify-center mt-20 gap-32">
          <button className="px-8 py-3 text-[18px] border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">
            キャンセル
          </button>
          <button
            className="text-white w-36 px-6 py-3 rounded bg-[#3CB371] text-[18px] font-medium hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-opacity duration-200"
          >
            更新
          </button>
        </div>
    </main>
  );
};

export default ApplicationCreatePage;
