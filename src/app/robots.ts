import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/quiz/*/question',
          '/quiz/*/loading',
          '/quiz/*/new-result',
          '/*?type=*',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/quiz/*/question',
          '/quiz/*/loading',
          '/quiz/*/new-result',
          '/*?type=*',
        ],
      },
    ],
    sitemap: 'https://testival.kr/sitemap.xml',
  };
}
