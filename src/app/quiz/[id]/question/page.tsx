import React from 'react';
import styles from './question.module.scss';
import { notFound } from 'next/navigation';
import { getQuizRepository } from '@/infrastructure/quiz.repository';
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

  return (
    <div
      className={styles.pageContainer}
      style={{
        backgroundImage: `url(/images/quiz/${id}/content_background.png)`,
      }}
    >
      <QuizQuestionClient def={def} />
    </div>
  );
};

export default QuestionPage;
