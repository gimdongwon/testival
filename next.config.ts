// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 이미지 최적화 설정
  images: {
    formats: ['image/avif', 'image/webp'], // AVIF와 WebP 포맷 우선 사용
    minimumCacheTTL: 31536000, // 1년 캐싱
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // 디바이스별 최적화된 크기
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // 작은 이미지 크기
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  webpack(config) {
    // 1) 기존 asset 처리에서 svg 제외
    const assetRule = config.module.rules.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (rule: any) => rule && rule.test?.test?.('.svg')
    );
    if (assetRule) {
      assetRule.exclude = /\.svg$/i;
    }

    // 2) SVGR 규칙 추가
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/, // TS/JS에서 import 할 때만
      oneOf: [
        // import url from './icon.svg?url' → URL 문자열로 사용
        { resourceQuery: /url/, type: 'asset' },

        // import Icon from './icon.svg?component' → React 컴포넌트로 사용
        {
          resourceQuery: /component/,
          use: [
            {
              loader: '@svgr/webpack',
              options: {
                svgo: true,
                svgoConfig: {
                  plugins: [{ name: 'removeViewBox', active: false }],
                },
                prettier: false,
                titleProp: true,
                ref: true,
                // 기본 검은색을 currentColor로 치환 → 부모 color에 따라 색 변경 가능
                replaceAttrValues: {
                  '#000': 'currentColor',
                  '#000000': 'currentColor',
                },
              },
            },
          ],
        },

        // import Icon from './icon.svg' → 기본도 컴포넌트로
        {
          use: [
            {
              loader: '@svgr/webpack',
              options: {
                svgo: true,
                svgoConfig: {
                  plugins: [{ name: 'removeViewBox', active: false }],
                },
                prettier: false,
                titleProp: true,
                ref: true,
                replaceAttrValues: {
                  '#000': 'currentColor',
                  '#000000': 'currentColor',
                },
              },
            },
          ],
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
