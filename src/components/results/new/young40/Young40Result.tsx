'use client';

import { useId } from 'react';
import type { CSSProperties } from 'react';
import type { ResultLayoutProps } from '../../types';
import styles from './Young40Result.module.scss';

const stripHtml = (html: string): string => html.replace(/<[^>]*>/g, '');

/**
 * description 앞부분(성격 본문)과 하단 HTML(짝꿍 블록 등) 분리.
 *
 * 컨벤션: 본문(plain text)은 `<div>` 태그를 포함하지 않으며, 짝꿍 블록 등 HTML
 * 영역은 반드시 `<div ...>`로 시작한다. 본문에 `<div>`가 들어가면 분리 위치가
 * 어긋나니 콘텐츠 작성 시 주의한다.
 */
const splitYoung40Description = (description: string): { main: string; extra: string } => {
  const divIdx = description.search(/<div\b/i);
  if (divIdx === -1) {
    return { main: description.trim(), extra: '' };
  }
  return {
    main: description.slice(0, divIdx).trim(),
    extra: description.slice(divIdx).trim(),
  };
};

/** Figma 1620:1468 — 줄마다 <p>, 빈 줄은 문단 간 여백 */
const renderPersonalityLines = (text: string) => {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    const content = line.trimEnd();
    if (content === '') {
      return <p key={i} className={styles.traitBlank} aria-hidden />;
    }
    return (
      <p key={i} className={styles.traitLine}>
        {content}
      </p>
    );
  });
};

/**
 * Young40Result — 영포티 테스트 전용 결과 레이아웃
 *
 * Figma: result_young40 — 크림/네이비 톤, 일러스트 프레임, 화이트 카드 + description HTML.
 */
const Young40Result = ({ result, config }: ResultLayoutProps) => {
  const traitSectionTitleId = useId();
  const textStroke = config.resultTextStroke;
  const titleStyle: CSSProperties = {
    ...(textStroke
      ? { WebkitTextStroke: textStroke, paintOrder: 'stroke fill' as const }
      : {}),
    ...(config.resultTitleStyle as CSSProperties | undefined),
  };

  const descStyle: CSSProperties | undefined = config.descriptionStyle
    ? (config.descriptionStyle as CSSProperties)
    : undefined;
  const traitBodyStyle: CSSProperties | undefined = descStyle
    ? (() => {
        const s = { ...descStyle } as CSSProperties & { whiteSpace?: string };
        delete s.whiteSpace;
        return s;
      })()
    : undefined;

  const contentOverride = config.contentCardStyle as CSSProperties | undefined;
  const whiteCardStyle: CSSProperties = {
    ...(contentOverride ?? {}),
  };

  const imgAlt = result.image ? `${stripHtml(result.name)} 결과 일러스트` : '';

  const { main: personalityMain, extra: compatibilityHtml } = splitYoung40Description(
    result.description
  );
  const sectionTitle = result.personalitySectionTitle ?? '성격 특징';

  return (
    <div className={styles.page}>
      <div className={styles.cream}>
        <div className={styles.decor} aria-hidden />

        <header className={styles.header}>
          <p className={styles.badge}>당신의 결과</p>
          <div className={styles.titleWrap}>
            <span className={styles.titleBrush} aria-hidden />
            <span className={styles.srOnly}>{stripHtml(result.name)}</span>
            <h1 className={styles.mainTitle} style={titleStyle}>
              {result.title.split('\n').map((line, i) => (
                <span key={i} className={styles.mainTitleLine}>
                  {line}
                </span>
              ))}
            </h1>
          </div>
        </header>

        <div className={styles.column}>
          {result.image ? (
            <div className={styles.illustration}>
              <div className={styles.illustrationInner}>
                <div className={styles.dots} aria-hidden />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.character}
                  src={result.image}
                  alt={imgAlt}
                  draggable={false}
                />
              </div>
            </div>
          ) : null}

          <div className={styles.whiteCard} style={whiteCardStyle}>
            {personalityMain ? (
              <section
                className={styles.traitSection}
                aria-labelledby={traitSectionTitleId}
              >
                <h2 className={styles.traitHeading} id={traitSectionTitleId}>
                  {sectionTitle}
                </h2>
                <div className={styles.traitBody} style={traitBodyStyle}>
                  {renderPersonalityLines(personalityMain)}
                </div>
              </section>
            ) : null}
            {compatibilityHtml ? (
              <div
                className={styles.compatibilityBlock}
                dangerouslySetInnerHTML={{ __html: compatibilityHtml }}
              />
            ) : null}
          </div>

          {result.keywords.length > 0 ? (
            <ul className={styles.keywords} aria-label='결과 키워드'>
              {result.keywords.map((keyword) => (
                <li key={keyword} className={styles.keyword}>
                  #{keyword}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Young40Result;
