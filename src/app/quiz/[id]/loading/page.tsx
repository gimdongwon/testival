import React from 'react';
import { getQuizRepository } from '@/infrastructure/quiz.repository';
import LoadingContent from './loading.client';
import { notFound } from 'next/navigation';
import { getAvailableWebP } from '@/lib/resolveQuizImages';
import type { Metadata } from 'next';

// 진행용 기능 페이지(로딩) — 색인 제외
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const LoadingPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const repo = getQuizRepository();
  const { id } = await params;
  const def = await repo.getById(id);
  if (!def) return notFound();
  const webpFiles = getAvailableWebP(id);
  return <LoadingContent def={def} webpFiles={webpFiles} />;
};

export default LoadingPage;
