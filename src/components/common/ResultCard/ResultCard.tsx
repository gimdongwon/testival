'use client';

import type { CSSProperties } from 'react';
import type { ResultDetail } from '@/domain/quiz.schema';
import styles from './ResultCard.module.scss';

type ResultCardProps = {
  quizTitle: string;
  result: ResultDetail;
  theme: 'black' | 'white';
  scoreLabel?: string;
  fontFamily?: string;
  textStroke?: string;
  heroColor?: string;
};

const ResultCard = ({ result, scoreLabel, fontFamily, textStroke, heroColor }: ResultCardProps) => {
  const heroStyle: CSSProperties = {
    ...(fontFamily ? { fontFamily } : {}),
    ...(heroColor ? { color: heroColor } : {}),
    ...(textStroke
      ? { WebkitTextStroke: textStroke, paintOrder: 'stroke fill' as const }
      : {}),
  };

  const titleStyle: CSSProperties | undefined = fontFamily
    ? { fontFamily }
    : undefined;

  return (
    <div className={styles.card}>
      <div className={styles.heroSection}>
        {scoreLabel && (
          <p className={styles.heroScore} style={heroStyle}>
            {scoreLabel}
          </p>
        )}
        <h2 className={styles.heroName} style={heroStyle}>
          {result.name}
        </h2>
      </div>

      <div className={styles.imageCard}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.resultImage}
          src={result.image}
          alt={`${result.name} 결과 이미지`}
          draggable={false}
        />
      </div>

      <div className={styles.contentCard}>
        <h3 className={styles.resultTitle} style={titleStyle}>
          {result.title}
        </h3>
        <p className={styles.description}>{result.description}</p>

        {result.keywords.length > 0 && (
          <ul className={styles.keywords} aria-label='결과 키워드'>
            {result.keywords.map((keyword) => (
              <li key={keyword} className={styles.keyword}>
                #{keyword}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ResultCard;
