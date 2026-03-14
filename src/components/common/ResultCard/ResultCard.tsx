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
  heroFontWeight?: number;
  descriptionHeader?: string;
  heroGap?: string;
  stampImage?: string;
};

const parseGradeNumber = (name: string): string | null => {
  const match = name.match(/(\d+)/);
  return match ? match[1] : null;
};

const ResultCard = ({
  result,
  scoreLabel,
  fontFamily,
  textStroke,
  heroColor,
  heroFontWeight,
  descriptionHeader,
  heroGap,
  stampImage,
}: ResultCardProps) => {
  const heroStyle: CSSProperties = {
    ...(fontFamily ? { fontFamily } : {}),
    ...(heroColor ? { color: heroColor } : {}),
    ...(heroFontWeight ? { fontWeight: heroFontWeight } : {}),
    ...(textStroke
      ? { WebkitTextStroke: textStroke, paintOrder: 'stroke fill' as const }
      : {}),
  };

  const titleStyle: CSSProperties = {
    ...(fontFamily ? { fontFamily } : {}),
    ...(textStroke
      ? { WebkitTextStroke: textStroke, paintOrder: 'stroke fill' as const }
      : {}),
  };

  const hasImage = !!result.image;

  if (!hasImage) {
    const gradeNumber = parseGradeNumber(result.name);

    return (
      <div className={styles.card}>
        <div className={styles.resultOuterCard}>
          <div
            className={styles.heroSectionNoImage}
            style={heroGap !== undefined ? { gap: heroGap } : undefined}
          >
            <h2 className={styles.heroTitleLarge} style={Object.keys(titleStyle).length > 0 ? titleStyle : undefined}>
              {result.title}
            </h2>
            <p className={styles.heroGradeLabel}>{result.name}</p>
          </div>

          <div className={styles.borderedContentCard}>
            {descriptionHeader && (
              <div className={styles.descriptionHeader}>
                <span>{descriptionHeader}</span>
              </div>
            )}
            <div className={styles.descriptionBody}>
              <p className={styles.description}>{result.description}</p>
            </div>

            {gradeNumber && stampImage && (
              <div className={styles.stamp} aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.stampImg}
                  src={stampImage}
                  alt=""
                  draggable={false}
                />
                <div className={styles.stampTextOverlay}>
                  <span className={styles.stampNumber}>{gradeNumber}</span>
                  <span className={styles.stampLabel}>등급</span>
                </div>
              </div>
            )}
          </div>
        </div>

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
    );
  }

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
        <h3 className={styles.resultTitle} style={Object.keys(titleStyle).length > 0 ? titleStyle : undefined}>
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
