import React from 'react';
import styles from './question.module.scss';
import { notFound } from 'next/navigation';
import { getQuizRepository } from '@/infrastructure/quiz.repository';
import QuizQuestionClient from './question.client';

interface QuestionPageProps {
  params: { id: string };
}

const QuestionPage = async ({ params }: QuestionPageProps) => {
  const repo = getQuizRepository();
  const def = await repo.getById(params.id);
  if (!def) return notFound();

  return (
    <div
      className={styles.pageContainer}
      style={{
        backgroundImage: `url(${
          def.meta.thumbnail ?? '/content_background.png'
        })`,
      }}
    >
      <QuizQuestionClient def={def} />
    </div>
  );
};

export default QuestionPage;
