// app/quiz/[id]/result/page.tsx
import { notFound } from 'next/navigation';
import { getQuizRepository } from '@/infrastructure/quiz.repository';
import ResultClient from './result.client';

export const revalidate = 600;

export default async function Page({ params }: { params: { id: string } }) {
  const repo = getQuizRepository();
  const def = await repo.getById(params.id);
  if (!def) return notFound();
  return <ResultClient def={def} />;
}
