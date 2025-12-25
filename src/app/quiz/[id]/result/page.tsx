// app/quiz/[id]/result/page.tsx
import { notFound } from 'next/navigation';
import ResultClient from './result.client';
import type { Metadata } from 'next';
import { getQuizRepository } from '@/infrastructure/quiz.repository';
import quizMeta from '@/content/quiz-meta.json';
import { getRecommendedQuizzes } from '@/lib/recommendedQuizzes';

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
  type QuizMetaEntry = Readonly<{
    id: string;
    title: string;
    description?: string;
  }>;
  const getMetaById = (
    quizId: string
  ): { title: string; description: string } => {
    const list = (quizMeta as { metas: QuizMetaEntry[] }).metas;
    const found = list.find((m) => m.id === quizId);
    if (!found) {
      return { title: 'Testival', description: 'Testival' };
    }
    const baseTitle = found.title ?? 'Testival';
    const baseDescription = found.description ?? `Testival - ${baseTitle}`;
    return { title: baseTitle, description: baseDescription };
  };
  const { title, description: desc } = getMetaById(id);
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

  // 추천 퀴즈 가져오기
  const recommendedQuizzes = await getRecommendedQuizzes(id, 3);

  return <ResultClient def={def} recommendedQuizzes={recommendedQuizzes} />;
}
