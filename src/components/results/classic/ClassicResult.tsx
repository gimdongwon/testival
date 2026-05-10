'use client';

import type { CSSProperties } from 'react';
import type { ResultLayoutProps } from '../types';
import styles from '../../common/ResultCard/ResultCard.module.scss';

const stripHtml = (html: string): string =>
  html.replace(/<[^>]*>/g, '');

const parseGradeNumber = (name: string): string | null => {
  const match = name.match(/(\d+)/);
  return match ? match[1] : null;
};

/**
 * ClassicResult — 기본 레이아웃
 *
 * 사용 콘텐츠: chuseok, classroom, christmas_present, christmas_cake,
 * dujjoenku, holiday_activity, nightwear, seat, travel_photo,
 * travel_winter, girls, yarr 등
 */
const ClassicResult = ({ result, config, scoreLabel }: ResultLayoutProps) => {
  const {
    resultFontFamily: fontFamily,
    resultTextStroke: textStroke,
    resultHeroColor: heroColor,
    resultHeroFontWeight: heroFontWeight,
    resultDescriptionHeader: descriptionHeader,
    resultHeroGap: heroGap,
    stampImage,
    hideResultTitle,
    resultHeroHeadlineStyle,
    resultTitleStyle: resultTitleStyleOverride,
    descriptionStyle: descriptionStyleOverride,
    descriptionHeaderStyle: descriptionHeaderStyleOverride,
    descriptionHeaderTextStyle: descriptionHeaderTextStyleOverride,
    descriptionBodyStyle: descriptionBodyStyleOverride,
    contentBorderColor,
    contentBorderRadius,
    resultImageBorder,
    resultImageBorderRadius,
    resultImageAspectRatio,
  } = config;

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
    ...(resultTitleStyleOverride as CSSProperties | undefined),
  };

  const descStyle: CSSProperties | undefined = descriptionStyleOverride
    ? (descriptionStyleOverride as CSSProperties)
    : undefined;

  const descriptionHeaderWrapperStyle: CSSProperties | undefined =
    descriptionHeaderStyleOverride
      ? (descriptionHeaderStyleOverride as CSSProperties)
      : undefined;

  const descriptionHeaderInnerTextStyle: CSSProperties | undefined =
    descriptionHeaderTextStyleOverride
      ? (descriptionHeaderTextStyleOverride as CSSProperties)
      : undefined;

  const descriptionBodyWrapperStyle: CSSProperties | undefined =
    descriptionBodyStyleOverride
      ? (descriptionBodyStyleOverride as CSSProperties)
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

  const heroHeadlineStyle = (resultHeroHeadlineStyle ?? {}) as CSSProperties;
  const hasImage = !!result.image;

  // — 이미지 없는 변형 (yarr 등) —
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
            <p className={styles.heroGradeLabel} dangerouslySetInnerHTML={{ __html: result.name.replace(/\n/g, '<br/>') }} />
          </div>

          <div className={styles.borderedContentCard}>
            {descriptionHeader && (
              <div
                className={styles.descriptionHeader}
                style={descriptionHeaderWrapperStyle}
              >
                <span style={descriptionHeaderInnerTextStyle}>{descriptionHeader}</span>
              </div>
            )}
            <div className={styles.descriptionBody} style={descriptionBodyWrapperStyle}>
              <div
                className={styles.description}
                style={descStyle}
                dangerouslySetInnerHTML={{ __html: result.description.replace(/\n/g, '<br/>') }}
              />
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

  // — 이미지 있는 기본 레이아웃 —
  return (
    <div className={styles.card}>
      <div className={styles.heroSection}>
        {scoreLabel && (
          <p className={styles.heroScore} style={heroStyle}>
            {scoreLabel}
          </p>
        )}
        {!hideResultTitle && (
          <h2 className={styles.heroName} style={{ ...heroStyle, ...heroHeadlineStyle }}
            dangerouslySetInnerHTML={{ __html: result.name.replace(/\n/g, '<br/>') }}
          />
        )}
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

export default ClassicResult;
