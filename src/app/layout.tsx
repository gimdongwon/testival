import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import Script from 'next/script';

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
      <head>
        <Script id='google-tag-manager'>
          {`
        // Google Tag Manager
        <Script id='google-tag-manager-noscript'>
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PVQVPLJC');
// End Google Tag Manager
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} body`}>
        <Providers>{children}</Providers>
        {`
        // Google Tag Manager (noscript)
        <noscript>
          <iframe
            src='https://www.googletagmanager.com/ns.html?id=GTM-PVQVPLJC'
            height='0'
            width='0'
            style='display:none;visibility:hidden'
          ></iframe>
        </noscript>
        // End Google Tag Manager (noscript)
        `}
      </body>
    </html>
  );
}
