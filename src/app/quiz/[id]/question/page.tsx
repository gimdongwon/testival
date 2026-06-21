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
    `/images/quiz/${id}/content_background.png?v=2`,
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

      {/* SEO/크롤러용 — 모든 문항 텍스트를 SSR HTML에 노출. 사용자 화면에는 안 보임. */}
      <section className={styles.seoOnly} aria-hidden='true'>
        <h2>{def.meta.title} — 전체 문항 목록</h2>
        {def.meta.description && <p>{def.meta.description}</p>}
        <ol>
          {def.questions.map((q, i) => (
            <li key={q.id}>
              <p>
                Q{i + 1}. {q.title.replace(/\n/g, ' ').replace(/\*\*/g, '')}
              </p>
              <ul>
                {q.choices.map((c) => (
                  <li key={c.id}>{c.label}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
};

export default QuestionPage;
