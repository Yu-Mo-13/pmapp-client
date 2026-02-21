import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'パスワード管理システム',
  description: 'パスワード管理システム(WEB)',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const userName = cookieStore.get('auth_user_name')?.value;

  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-gray-100">
          <Header userName={userName ?? 'ゲスト'} />
          <div className="flex">
            <Sidebar />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
