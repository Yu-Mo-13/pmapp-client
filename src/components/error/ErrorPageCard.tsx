'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

type ErrorPageCardProps = {
  title: string;
  message: string;
  actionHref: string;
  icon: ReactNode;
};

export default function ErrorPageCard({
  title,
  message,
  actionHref,
  icon,
}: ErrorPageCardProps) {
  return (
    <main className="fixed inset-0 z-[100] flex items-center justify-center bg-[#efefef] px-4 py-6 sm:px-6">
      <div className="w-full max-w-[572px] rounded-[2px] bg-white px-8 py-12 shadow-[0_2px_8px_rgba(0,0,0,0.24)] sm:px-16 sm:py-[66px]">
        <div className="mx-auto flex max-w-[420px] flex-col items-center text-center">
          <div className="mb-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f7fb] text-[#425166]">
            {icon}
          </div>
          <h1 className="text-[28px] font-bold leading-tight text-[#3e3e3e] sm:text-[36px]">
            {title}
          </h1>
          <p className="mt-10 text-[18px] font-semibold leading-8 text-[#3e3e3e]">
            {message}
          </p>
          <Link
            href={actionHref}
            className="mt-16 inline-flex h-10 w-full max-w-[200px] items-center justify-center whitespace-nowrap rounded-[8px] bg-[#41be78] px-6 text-[14px] font-medium text-white transition-opacity duration-200 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[#41be78] focus:ring-offset-2"
          >
            トップページに戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
