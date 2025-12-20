'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SubmitButton from '@/components/button/SubmitButton';
import { ErrorMessage } from '@/components/form/ErrorMessage';
import {
  AuthService,
  LoginValidationError,
} from '@/api/services/auth/authService';

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginValidationError>({});

  // フォームの送信処理
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const response = await AuthService.login({ email, password });

      // バリデーションエラー
      if ('errors' in response && response.errors) {
        setErrors(response.errors);
        return;
      }

      // 成功
      if (
        'success' in response &&
        response.success &&
        response.data?.access_token
      ) {
        // 実際にはトークンを保存する処理が必要
        localStorage.setItem('token', response.data.access_token);
        router.push('/applications');
        return;
      }

      // その他のAPIエラー
      console.error('Login failed with response:', response);
    } catch (error) {
      console.error('An unexpected error occurred during login:', error);
    }
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3cb371] focus:border-2 text-base shadow-sm transition duration-150"
              placeholder="メールアドレス"
            />
            {errors.email && <ErrorMessage message={errors.email?.[0]} />}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3cb371] focus:border-2 text-base shadow-sm transition duration-150"
              placeholder="パスワード"
            />
            {errors.password && <ErrorMessage message={errors.password?.[0]} />}
          </div>

          {/* ログインボタン */}
          <div className="text-center">
            <SubmitButton isSubmit text="ログイン" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
