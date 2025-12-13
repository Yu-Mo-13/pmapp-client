'use client';

import React from 'react';

const LoginForm: React.FC = () => {
  // フォームの送信処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('フォームが送信されました。');
  };

  // カスタムカラースペック
  const BG_COLOR = '#f0f0f0';
  const HEADER_COLOR = '#3e3e3e';
  const BUTTON_COLOR = '#3cb371';
  const BUTTON_HOVER_COLOR = '#34a465';

  return (
    // 修正点:
    // 1. `w-full` を追加し、親要素の幅を確実に確保します。
    // 2. `min-h-screen` (画面の最小高さ), `flex`, `items-center` (垂直中央), `justify-center` (水平中央) を適用します。
    <div
      style={{ backgroundColor: BG_COLOR }}
      className="min-h-screen w-full flex items-center justify-center p-4"
    >
      {/* ログインコンテナ (最大幅 max-w-md によりフォーム自体は小さいまま) */}
      <div className="w-full max-w-md p-8 bg-white/70 rounded shadow-xl backdrop-blur-sm">
        {/* PMAPP 題字 */}
        <h1
          style={{ color: HEADER_COLOR }}
          className="text-4xl font-bold text-center mb-10"
        >
          PMAPP
        </h1>

        {/* ログインフォーム */}
        <form onSubmit={handleSubmit}>
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
              style={
                {
                  '--tw-ring-color': BUTTON_COLOR,
                  '--tw-border-color': BUTTON_COLOR,
                } as React.CSSProperties
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-2 text-base shadow-sm transition duration-150"
              placeholder=""
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
              style={
                {
                  '--tw-ring-color': BUTTON_COLOR,
                  '--tw-border-color': BUTTON_COLOR,
                } as React.CSSProperties
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-2 text-base shadow-sm transition duration-150"
              placeholder=""
            />
          </div>

          {/* ログインボタン */}
          <div className="text-center">
            <button
              type="submit"
              style={{ backgroundColor: BUTTON_COLOR }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = BUTTON_HOVER_COLOR)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = BUTTON_COLOR)
              }
              className="w-full max-w-[150px] text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition duration-150 ease-in-out text-lg shadow-md"
            >
              ログイン
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
