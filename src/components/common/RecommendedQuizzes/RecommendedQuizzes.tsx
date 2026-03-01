'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './RecommendedQuizzes.module.scss';

interface QuizRecommendation {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
}

interface RecommendedQuizzesProps {
  quizzes: QuizRecommendation[];
  theme?: 'white' | 'black';
}

const RecommendedQuizzes: React.FC<RecommendedQuizzesProps> = ({
  quizzes,
  theme = 'black',
}) => {
  if (!quizzes || quizzes.length === 0) {
    return null;
  }

  const containerClass =
    theme === 'white' ? styles.containerWhite : styles.containerBlack;

  return (
    <section className={`${styles.container} ${containerClass}`}>
      <div className={styles.header}>
        <span className={styles.emoji}>🔥</span>
        <h2 className={styles.title}>다른 심리테스트 보기</h2>
        <span className={styles.emoji}>🔥</span>
      </div>

      <div className={styles.quizList}>
        {quizzes.map((quiz) => (
          <Link
            key={quiz.id}
            href={`/quiz/${quiz.id}`}
            className={styles.quizCard}
            tabIndex={0}
            aria-label={`${quiz.title} 퀴즈로 이동`}
          >
            <div className={styles.thumbnailWrapper}>
              <Image
                src={quiz.thumbnail}
                alt={quiz.title}
                width={160}
                height={160}
                loading='lazy'
                quality={80}
                placeholder='blur'
                blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
                sizes='160px'
                className={styles.thumbnail}
              />
            </div>
            <div className={styles.content}>
              <h3 className={styles.quizTitle}>{quiz.title}</h3>
              <div className={styles.views}>
                <span className={styles.playIcon}>▷</span>
                <span className={styles.count}>{quiz.views}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RecommendedQuizzes;
