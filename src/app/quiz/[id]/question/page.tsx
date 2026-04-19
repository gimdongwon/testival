import React from 'react';
import Image from 'next/image';
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
    `/images/quiz/${id}/content_background.png?v=1`,
    webpFiles,
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.bgWrapper}>
        <Image
          src={bgPath}
          alt=''
          fill
          priority
          quality={85}
          className={styles.bgImage}
        />
      </div>
      <QuizQuestionClient def={def} />
    </div>
  );
};

export default QuestionPage;
