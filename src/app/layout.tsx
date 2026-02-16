import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import Providers from './providers';
import Script from 'next/script';
import GAListener from '@/lib/ga-listener';
import { Analytics } from '@vercel/analytics/next';

const siteUrl = 'https://testival.kr';
const defaultTitle = 'Testival - 테스티발 심리테스트';
const defaultDesc = '재미있는 심리테스트를 무료로 즐겨보세요.';
const defaultImage = `${siteUrl}/images/quiz/common/og-image.png`;
const defaultImageAlt =
  'Testival 심리테스트 플랫폼 - 나를 발견하는 재미있는 테스트';
const defaultImageWidth = 1200;
const defaultImageHeight = 630;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: defaultTitle, template: '%s | Testival' },
  description: defaultDesc,
  keywords: [
    '심리테스트',
    '성격테스트',
    '여행테스트',
    'MBTI',
    '심리분석',
    '재미테스트',
    '성향테스트',
    '무료테스트',
    '온라인테스트',
    '퀴즈',
  ],
  authors: [{ name: 'Testival' }],
  creator: 'Testival',
  publisher: 'Testival',
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [{ url: '/images/quiz/common/favicon.png', type: 'image/png' }],
    apple: [{ url: '/images/quiz/common/favicon.png', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Testival',
    title: defaultTitle,
    description: defaultDesc,
    locale: 'ko_KR',
    images: [
      {
        url: `${defaultImage}?v=${new Date().getTime()}`,
        width: defaultImageWidth,
        height: defaultImageHeight,
        alt: defaultImageAlt,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDesc,
    images: [defaultImage],
  },
  alternates: { canonical: siteUrl },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // Google Search Console에서 발급받은 코드로 변경
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <head>
        {/* Google Tag Manager */}
        <Script id='google-tag-manager' strategy='afterInteractive'>
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PVQVPLJC');`}
        </Script>
        {/* Google Analytics 4 (gtag.js) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy='afterInteractive'
        />
        <Script id='google-analytics' strategy='afterInteractive'>
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { send_page_view: false });`}
        </Script>
        {/* Google AdSense */}
        <Script
          id='adsbygoogle'
          async
          strategy='afterInteractive'
          src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9943215492404656'
          crossOrigin='anonymous'
        />
      </head>
      <body>
        <noscript>
          <iframe
            src='https://www.googletagmanager.com/ns.html?id=GTM-PVQVPLJC'
            height='0'
            width='0'
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* SPA page_view tracking */}
        <Suspense fallback={null}>
          <GAListener />
          <Analytics />
        </Suspense>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
