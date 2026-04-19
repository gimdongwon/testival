'use client';

import type { CSSProperties } from 'react';
import type { ResultLayoutProps } from './ClassicResult';
import styles from '../common/ResultCard/ResultCard.module.scss';

const stripHtml = (html: string): string =>
  html.replace(/<[^>]*>/g, '');

/**
 * GradeResult — 등급/점수 표시 전용 레이아웃
 *
 * name 필드에 인라인 HTML(점수 + 부제)이 포함된 콘텐츠용.
 * 사용 콘텐츠: mid-term
 */
const GradeResult = ({ result, config }: ResultLayoutProps) => {
  const {
    resultFontFamily: fontFamily,
    resultTextStroke: textStroke,
    resultHeroColor: heroColor,
    resultHeroFontWeight: heroFontWeight,
    resultHeroHeadlineStyle,
    resultTitleStyle: resultTitleStyleOverride,
    descriptionStyle: descriptionStyleOverride,
    resultImageBorderRadius,
  } = config;

  const heroStyle: CSSProperties = {
    ...(fontFamily ? { fontFamily } : {}),
    ...(heroColor ? { color: heroColor } : {}),
    ...(heroFontWeight ? { fontWeight: heroFontWeight } : {}),
    ...(textStroke
      ? { WebkitTextStroke: textStroke, paintOrder: 'stroke fill' as const }
      : {}),
  };

  const heroHeadlineStyle = (resultHeroHeadlineStyle ?? {}) as CSSProperties;

  const titleStyle: CSSProperties = {
    ...(fontFamily ? { fontFamily } : {}),
    ...(textStroke
      ? { WebkitTextStroke: textStroke, paintOrder: 'stroke fill' as const }
      : {}),
    ...(resultTitleStyleOverride as CSSProperties | undefined),
  };

  const descStyle: CSSProperties | undefined = descriptionStyleOverride
    ? (descriptionStyleOverride as CSSProperties)
    : undefined;

  const imageFrameStyle: CSSProperties | undefined = resultImageBorderRadius
    ? { borderRadius: resultImageBorderRadius }
    : undefined;

  return (
    <div className={styles.card}>
      <div className={styles.heroSection}>
        {/* name에 인라인 HTML(점수 + 부제)이 들어 있으므로 dangerouslySetInnerHTML 사용 */}
        <h2 className={styles.heroName} style={{ ...heroStyle, ...heroHeadlineStyle }}
          dangerouslySetInnerHTML={{ __html: result.name.replace(/\n/g, '<br/>') }}
        />
      </div>

      {result.image && (
        <div
          className={styles.imageCard}
          style={imageFrameStyle}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.resultImage}
            src={result.image}
            alt={`${stripHtml(result.name)} 결과 이미지`}
            draggable={false}
          />
        </div>
      )}

      <div className={styles.contentCard}>
        <h3 className={styles.resultTitle} style={Object.keys(titleStyle).length > 0 ? titleStyle : undefined}>
          {result.title}
        </h3>
        <div
          className={styles.description}
          style={descStyle}
          dangerouslySetInnerHTML={{ __html: result.description.replace(/\n/g, '<br/>') }}
        />

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

export default GradeResult;
