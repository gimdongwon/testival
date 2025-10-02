// app/quiz/[id]/result/page.tsx
import ResultClient from './result.client';
import type { Metadata } from 'next';
type Props = { params: { id: string } };
export const revalidate = 600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;
  const SITE_URL = 'https://testival.kr';
  const title = 'Testival 결과 페이지';
  const desc = 'Testival 결과 페이지';
  const img = `${SITE_URL}/images/quiz/chuseok/ogResult.png`;

  return {
    title,
    description: desc,
    openGraph: {
      type: 'article',
      siteName: '서비스 이름',
      url: `${SITE_URL}/quiz/${id}/result`,
      title,
      description: desc,
      images: [{ url: img, width: 1200, height: 630 }],
      locale: 'ko_KR',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [img],
    },
    alternates: { canonical: `${SITE_URL}/quiz/${id}/result` },
  };
}

export default async function Page() {
  return <ResultClient />;
}
