import type { Metadata } from 'next';
import { pretendard } from '@/styles/font';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'GJ NEWS',
  description: '긍정 뉴스만 뽑아보자!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pretendard.className} max-w-[1200px] mx-auto`}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
