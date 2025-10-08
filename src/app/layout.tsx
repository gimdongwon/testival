import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import Providers from './providers';
import Script from 'next/script';
import GAListener from '@/lib/ga-listener';
import { Analytics } from '@vercel/analytics/next';

const siteUrl = 'https://testival.kr';
const defaultTitle = 'Testival';
const defaultDesc = 'Testival';
const defaultImage = `${siteUrl}/images/quiz/chuseok/ogImage.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: defaultTitle, template: '%s | testival' },
  description: defaultDesc,
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'testival',
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
      <head>
        {/* GA4 gtag.js */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy='afterInteractive'
        />
        <Script id='gtag-init' strategy='afterInteractive'>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);} 
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { send_page_view: false });
          `}
        </Script>
        <Script id='google-tag-manager' strategy='afterInteractive'>
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PVQVPLJC');`}
        </Script>
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
