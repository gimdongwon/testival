'use client';

import type { CSSProperties } from 'react';
import type { ResultLayoutProps } from '../ClassicResult';
import styles from './GoodBoyfriendResult.module.scss';

const stripHtml = (html: string): string =>
  html.replace(/<[^>]*>/g, '');

/**
 * GoodBoyfriendResult — 착한 남자친구 테스트 전용 결과 레이아웃
 *
 * description의 인라인 HTML을 그대로 렌더링하되,
 * 컴포넌트 자체의 구조(히어로/이미지/콘텐츠)를 커스텀합니다.
 */
const GoodBoyfriendResult = ({ result, config }: ResultLayoutProps) => {
  const {
    resultFontFamily: fontFamily,
    resultHeroColor: heroColor,
    contentBorderColor,
    contentBorderRadius,
    resultImageBorder,
    resultImageBorderRadius,
  } = config;

  const heroStyle: CSSProperties = {
    ...(fontFamily ? { fontFamily } : {}),
    ...(heroColor ? { color: heroColor } : {}),
  };

  const imageFrameStyle: CSSProperties | undefined =
    resultImageBorder || resultImageBorderRadius
      ? {
          ...(resultImageBorder ? { border: resultImageBorder } : {}),
          ...(resultImageBorderRadius ? { borderRadius: resultImageBorderRadius } : {}),
        }
      : undefined;

  const contentCardStyle: CSSProperties | undefined =
    contentBorderColor || contentBorderRadius
      ? {
          ...(contentBorderColor ? { borderColor: contentBorderColor } : {}),
          ...(contentBorderRadius ? { borderRadius: contentBorderRadius } : {}),
          backgroundColor: '#FFFFFF',
        }
      : undefined;

  return (
    <div className={styles.card}>
      {/* ── Hero: 결과 이름 + 부제 ── */}
      <div className={styles.heroSection}>
        <p className={styles.heroTitle}>{result.title}</p>
        <h2 className={styles.heroName} style={heroStyle}>
          {stripHtml(result.name)}
        </h2>
      </div>

      {/* ── 결과 이미지 ── */}
      {result.image && (
        <div className={styles.imageCard} style={imageFrameStyle}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.resultImage}
            src={result.image}
            alt={`${stripHtml(result.name)} 결과 이미지`}
            draggable={false}
          />
        </div>
      )}

      {/* ── 콘텐츠 카드: description HTML 렌더링 ── */}
      <div className={styles.contentCard} style={contentCardStyle}>
        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: result.description.replace(/\n/g, '<br/>') }}
        />
      </div>
    </div>
  );
};

export default GoodBoyfriendResult;
