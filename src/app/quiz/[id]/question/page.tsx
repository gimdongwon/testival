import React from 'react';
import styles from './question.module.scss';
import { notFound } from 'next/navigation';
import { getQuizRepository } from '@/infrastructure/quiz.repository';
import { getAvailableWebP } from '@/lib/resolveQuizImages';
import { resolveImage } from '@/lib/imageUtils';
import QuizQuestionClient from './question.client';

const QuestionPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const repo = getQuizRepository();
  const { id } = await params;
  const def = await repo.getById(id);
  if (!def) return notFound();

  const webpFiles = getAvailableWebP(id);
  const bgPath = resolveImage(
    `/images/quiz/${id}/content_background.png`,
    webpFiles
  );

  return (
    <div
      className={styles.pageContainer}
      style={{ backgroundImage: `url("${bgPath}")` }}
    >
      <QuizQuestionClient def={def} />
    </div>
  );
};

export default QuestionPage;
