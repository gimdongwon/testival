'use client';

import type { CSSProperties } from 'react';
import type { ResultLayoutProps } from './ClassicResult';
import styles from '../common/ResultCard/ResultCard.module.scss';

const stripHtml = (html: string): string =>
  html.replace(/<[^>]*>/g, '');

/** name의 첫 줄 → contentCard의 title로 사용 */
const springCardTitleFromName = (name: string): string => {
  const first = name.split('\n')[0];
  return first?.trim() ?? name;
};

/** name에서 [대괄호] 안 텍스트 → hero headline로 사용 */
const springHeadlineFromName = (name: string): string => {
  const lines = name
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
  if (lines.length === 0) return name;
  const afterFirst = lines.slice(1).join('\n');
  const multiLineBracket = afterFirst.match(/^\[([\\s\S]+)\]$/);
  if (multiLineBracket) return multiLineBracket[1]?.trim() ?? afterFirst;
  const last = lines[lines.length - 1] ?? '';
  const bracket = last.match(/^\[(.+)\]$/);
  if (bracket) return bracket[1] ?? last;
  return lines.length >= 2 ? last : lines[0] ?? '';
};

/**
 * SpringResult — 봄 나들이 전용 레이아웃
 *
 * quote(title) + headline(name에서 파싱) + 원형 이미지 + contentCard
 * 사용 콘텐츠: spring
 */
const SpringResult = ({ result, config }: ResultLayoutProps) => {
  const {
    resultHeroQuoteStyle,
    resultHeroHeadlineStyle,
    resultTitleStyle: resultTitleStyleOverride,
    descriptionStyle: descriptionStyleOverride,
    contentBorderColor,
    contentBorderRadius,
    resultImageBorder,
    resultImageBorderRadius,
    resultImageAspectRatio,
  } = config;

  const heroQuoteStyle = (resultHeroQuoteStyle ?? {}) as CSSProperties;
  const heroHeadlineStyle = (resultHeroHeadlineStyle ?? {}) as CSSProperties;

  const titleStyle: CSSProperties = {
    ...(resultTitleStyleOverride as CSSProperties | undefined),
  };

  const descStyle: CSSProperties | undefined = descriptionStyleOverride
    ? (descriptionStyleOverride as CSSProperties)
    : undefined;

  const contentCardBorderStyle: CSSProperties | undefined =
    contentBorderColor || contentBorderRadius
      ? {
          ...(contentBorderColor ? { borderColor: contentBorderColor } : {}),
          ...(contentBorderRadius ? { borderRadius: contentBorderRadius } : {}),
        }
      : undefined;

  const imageFrameStyle: CSSProperties | undefined =
    resultImageBorder || resultImageBorderRadius || resultImageAspectRatio
      ? {
          ...(resultImageBorder ? { border: resultImageBorder } : {}),
          ...(resultImageBorderRadius ? { borderRadius: resultImageBorderRadius } : {}),
          ...(resultImageAspectRatio ? { aspectRatio: resultImageAspectRatio } : {}),
        }
      : undefined;

  return (
    <div className={styles.card}>
      <div className={`${styles.heroSection} ${styles.heroSectionSpring}`}>
        <p className={styles.heroQuote} style={heroQuoteStyle}>
          {result.title}
        </p>
        <h2 className={styles.heroName} style={heroHeadlineStyle}
          dangerouslySetInnerHTML={{ __html: springHeadlineFromName(result.name).replace(/\n/g, '<br/>') }}
        />
      </div>

      <div
        className={`${styles.imageCard} ${resultImageAspectRatio ? styles.imageCardAspectFill : ''} ${
          resultImageBorder ? styles.imageCardInset : ''
        }`}
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

      <div className={styles.contentCard} style={contentCardBorderStyle}>
        <h3 className={styles.resultTitle} style={Object.keys(titleStyle).length > 0 ? titleStyle : undefined}>
          {springCardTitleFromName(result.name)}
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

export default SpringResult;
