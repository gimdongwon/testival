import React from 'react';
import { getQuizRepository } from '@/infrastructure/quiz.repository';
import { getAvailableWebP } from '@/lib/resolveQuizImages';
import LoadingContent from './loading.client';
import { notFound } from 'next/navigation';

const LoadingPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const repo = getQuizRepository();
  const { id } = await params;
  const def = await repo.getById(id);
  if (!def) return notFound();
  const webpFiles = getAvailableWebP(id);
  return <LoadingContent def={def} webpFiles={webpFiles} />;
};

export default LoadingPage;
