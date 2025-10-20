// app/quiz/[id]/result/page.tsx
import { notFound } from 'next/navigation';
import ResultClient from './result.client';
import type { Metadata } from 'next';
import { getQuizRepository } from '@/infrastructure/quiz.repository';

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
export const revalidate = 600;

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { id } = await params;
  const { type } = await searchParams;
  if (!type) return notFound();
  const SITE_URL = 'https://testival.kr';
  const title = `Testival ${id} 결과`;
  const desc = `Testival ${id} 결과 페이지`;
  const img = `${SITE_URL}/images/quiz/${id}/result_${type}.png`;

  return {
    title,
    description: desc,
    openGraph: {
      type: 'article',
      siteName: `Testival ${id}`,
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

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const repo = getQuizRepository();
  const def = await repo.getById(id);
  if (!def) return notFound();
  return <ResultClient def={def} />;
}
