'use client';

import React from 'react';
import SubmitButton from '@/components/button/SubmitButton';

const LoginForm: React.FC = () => {
  // フォームの送信処理
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('フォームが送信されました。');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#f0f0f0]">
      {/* ログインコンテナ (最大幅 max-w-md によりフォーム自体は小さいまま) */}
      <div className="w-full max-w-md p-8 bg-white/70 rounded shadow-xl backdrop-blur-sm">
        {/* PMAPP 題字 */}
        <h1 className="text-4xl font-bold text-center mb-10 text-[#3e3e3e]">
          PMAPP
        </h1>

        {/* ログインフォーム */}
        <form onSubmit={handleLogin}>
          {/* メールアドレス入力欄 */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3cb371] focus:border-2 text-base shadow-sm transition duration-150"
              placeholder="メールアドレス"
            />
          </div>

          {/* パスワード入力欄 */}
          <div className="mb-8">
            <label
              htmlFor="password"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              パスワード
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3cb371] focus:border-2 text-base shadow-sm transition duration-150"
              placeholder="パスワード"
            />
          </div>

          {/* ログインボタン */}
          <div className="text-center">
            <SubmitButton text="ログイン" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
