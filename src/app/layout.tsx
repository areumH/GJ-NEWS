import type { Metadata } from 'next';
import { Toaster } from 'sonner';
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
      <body className={`${pretendard.className} max-w-3xl mx-auto`}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Toaster position="top-center" closeButton richColors />
      </body>
    </html>
  );
}
