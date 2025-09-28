// app/quiz/[id]/result/page.tsx
import { notFound } from 'next/navigation';
import { getQuizRepository } from '@/infrastructure/quiz.repository';
import ResultClient from './result.client';

export const revalidate = 600;

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const repo = getQuizRepository();
  const { id } = await params;
  const def = await repo.getById(id);
  if (!def) return notFound();
  return <ResultClient def={def} />;
}
