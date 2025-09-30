import React from 'react';
import { getQuizRepository } from '@/infrastructure/quiz.repository';
import LoadingContent from './loading.client';
import { notFound } from 'next/navigation';

const LoadingPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const repo = getQuizRepository();
  const { id } = await params;
  const def = await repo.getById(id);
  if (!def) return notFound();
  return <LoadingContent def={def} />;
};

export default LoadingPage;
