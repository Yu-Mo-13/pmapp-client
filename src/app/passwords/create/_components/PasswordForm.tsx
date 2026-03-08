'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SubmitButton from '@/components/button/SubmitButton';
import CancelButton from '@/components/button/CancelButton';
import ArrowDown from '@/assets/images/arrow/arrowDown.svg';
import {
  AccountIndexRow,
} from '@/api/services/account/accountService';
import { Application } from '@/api/services/application/applicationService';
import Button from '@/components/Button';
import NumberInput from '@/components/NumberInput';
import {
  createPassword,
  FormState,
} from '../action/PasswordCreateActions';

interface PasswordFormProps {
  applications: Pick<Application, 'id' | 'name' | 'mark_class'>[];
  accounts: AccountIndexRow[];
}

const generatePassword = (size: number, includeSymbols: boolean): string => {
  const chars = includeSymbols
    ? 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*'
    : 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  return Array.from({ length: size }, () => {
    const index = Math.floor(Math.random() * chars.length);
    return chars[index];
  }).join('');
};

const PasswordForm: React.FC<PasswordFormProps> = ({ applications, accounts }) => {
  const router = useRouter();
  const initialState: FormState = {
    errors: undefined,
    success: false,
    shouldRedirect: false,
  };
  const [state, formAction, isPending] = useActionState(
    createPassword,
    initialState
  );
  const [password, setPassword] = useState('');
  const [selectedApplicationId, setSelectedApplicationId] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [passwordSize, setPasswordSize] = useState(10);

  const filteredAccounts = useMemo(
    () =>
      accounts.filter(
        (account) => `${account.application_id}` === selectedApplicationId
      ),
    [accounts, selectedApplicationId]
  );
  const selectedApplication = useMemo(
    () =>
      applications.find(
        (application) => `${application.id}` === selectedApplicationId
      ),
    [applications, selectedApplicationId]
  );

  useEffect(() => {
    if (
      selectedAccountId &&
      !filteredAccounts.some((account) => `${account.id}` === selectedAccountId)
    ) {
      setSelectedAccountId('');
    }
  }, [filteredAccounts, selectedAccountId]);

  useEffect(() => {
    if (!state.shouldRedirect) {
      return;
    }

    const timerId = window.setTimeout(() => {
      router.push('/passwords');
    }, 800);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [router, state.shouldRedirect]);

  return (
    <form action={formAction} className="px-6 space-y-6 text-[20px]">
      {/* パスワード */}
      <div>
        <div className="flex gap-12">
          <label className="block text-gray-700 font-medium mb-3">
            パスワード
          </label>
          <Button
            text="生成"
            onClick={() =>
              setPassword(
                generatePassword(passwordSize, selectedApplication?.mark_class ?? false)
              )
            }
          />
        </div>
        <input
          type="text"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-[97%] m-4 text-black px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        />
        {state.errors?.password?.password && (
          <div className="text-red-500 text-sm mt-1 ml-4">
            {state.errors.password.password.join(', ')}
          </div>
        )}
      </div>

      {/* アプリケーション */}
      <div>
        <label className="block text-gray-700 font-medium mb-3">
          アプリケーション
        </label>
        <div className="relative w-[97%] m-4 py-3">
          <select
            name="application_id"
            value={selectedApplicationId}
            onChange={(event) => setSelectedApplicationId(event.target.value)}
            className="w-full text-black px-4 py-3 pr-12 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent appearance-none"
          >
            <option value="">選択してください</option>
            {applications.map((application) => (
              <option key={application.id} value={application.id}>
                {application.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
            <Image src={ArrowDown} alt="選択" width={16} height={16} />
          </div>
        </div>
        {state.errors?.password?.application_id && (
          <div className="text-red-500 text-sm mt-1 ml-4">
            {state.errors.password.application_id.join(', ')}
          </div>
        )}
      </div>

      {/* アカウント名 */}
      <div>
        <label className="block text-gray-700 font-medium mb-3">
          アカウント名
        </label>
        <div className="relative w-[97%] m-4 py-3">
          <select
            name="account_id"
            value={selectedAccountId}
            onChange={(event) => setSelectedAccountId(event.target.value)}
            disabled={!selectedApplicationId || filteredAccounts.length === 0}
            className="w-full text-black px-4 py-3 pr-12 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent appearance-none disabled:bg-gray-100 disabled:text-gray-500"
          >
            <option value="">
              {selectedApplicationId
                ? '選択してください'
                : '先にアプリケーションを選択してください'}
            </option>
            {filteredAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
            <Image src={ArrowDown} alt="選択" width={16} height={16} />
          </div>
        </div>
        {state.errors?.password?.account_id && (
          <div className="text-red-500 text-sm mt-1 ml-4">
            {state.errors.password.account_id.join(', ')}
          </div>
        )}
      </div>

      {/* パスワード桁数 */}
      <div className="flex items-center gap-[74px]">
        <label className="text-gray-700 font-medium mb-3">パスワード桁数</label>
        <NumberInput
          name="password_size"
          defaultValue={10}
          value={passwordSize}
          min={1}
          step={1}
          onChange={setPasswordSize}
        />
      </div>

      {/* ボタン部分 */}
      <div className="flex justify-center mt-14 gap-32">
        <CancelButton to="/passwords" />
        <SubmitButton isSubmit text="登録" disabled={isPending} />
      </div>
    </form>
  );
};

export default PasswordForm;
