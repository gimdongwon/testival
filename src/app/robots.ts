import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // 기능성 페이지(question/loading/new-result/result?type=)는 robots.txt로
  // 차단하지 않는다. 해당 페이지들은 각 page.tsx에서 `noindex`(robots meta)로
  // 색인 제외 처리되어 있는데, robots.txt로 크롤을 막으면 Googlebot이
  // noindex 자체를 읽지 못해 오히려 "차단됨" 상태로 색인에 남을 수 있다.
  // → 크롤은 허용하고 noindex로 확실히 제외한다.
  // robots.txt에는 크롤 자체가 불필요한 경로(/api, /admin)만 남긴다.
  const disallow = ['/api/', '/admin/'];
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow,
      },
    ],
    sitemap: 'https://testival.kr/sitemap.xml',
  };
}
