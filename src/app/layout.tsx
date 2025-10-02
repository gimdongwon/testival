import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl = 'https://testival.kr';
const defaultTitle = 'Testival';
const defaultDesc = 'Testival';
const defaultImage = `${siteUrl}/images/quiz/chuseok/ogImage.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: defaultTitle, template: '%s | 서비스 이름' },
  description: defaultDesc,
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: '서비스 이름',
    title: defaultTitle,
    description: defaultDesc,
    locale: 'ko_KR',
    images: [
      { url: defaultImage, width: 1200, height: 630, alt: '미리보기 이미지' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDesc,
    images: [defaultImage],
  },
  alternates: { canonical: siteUrl },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} body`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
