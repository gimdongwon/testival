'use client';

import type { ResultLayoutProps } from '../types';
import styles from './SoloEscapeResult.module.scss';

const stripHtml = (html: string): string => html.replace(/<[^>]*>/g, '');

/** 본문(HTML 허용)과 짝꿍 블록(<div ...>)을 첫 번째 <div> 기준으로 분리 */
const splitDescription = (description: string): { main: string; extra: string } => {
  const divIdx = description.search(/<div\b/i);
  if (divIdx === -1) return { main: description.trim(), extra: '' };
  return {
    main: description.slice(0, divIdx).trim(),
    extra: description.slice(divIdx).trim(),
  };
};

const decodeEntities = (raw: string): string =>
  raw
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

/** description 트레일링 HTML에서 환상의/파국의 짝꿍 이름만 추출(개행 보존) */
const extractMatchups = (html: string): { good?: string; bad?: string } => {
  const pickAfter = (label: string): string | undefined => {
    const re = new RegExp(`${label}[\\s\\S]*?<p[^>]*>([\\s\\S]*?)<\\/p>`, 'i');
    const m = html.match(re);
    return m ? decodeEntities(stripHtml(m[1])).trim() : undefined;
  };
  return {
    good: pickAfter('환상의\\s*짝꿍'),
    bad: pickAfter('파국의\\s*짝꿍'),
  };
};

/** title 첫 줄에서 트레일링 퍼센트("솔로 탈출 확률 1%" → "솔로 탈출 확률") 제거 */
const stripTrailingPercent = (line: string): string =>
  line.replace(/\s*\d+\s*%\s*$/, '').trim();

const SoloEscapeResult = ({ result }: ResultLayoutProps) => {
  const [rawHeadline, ...restLines] = result.title.split('\n');
  const headline = stripTrailingPercent(rawHeadline ?? '') || '솔로 탈출 확률';
  const categoryText = restLines.join(' ').trim();

  const { main: descriptionMain, extra: matchupHtml } = splitDescription(result.description);
  const { good: goodMatch, bad: badMatch } = extractMatchups(matchupHtml);
  const hasMatchups = Boolean(goodMatch || badMatch);

  const imageAlt = result.image ? `${stripHtml(result.name)} 결과 일러스트` : '';

  return (
    <div className={styles.page}>
      <div className={styles.heroCard}>
        <div className={styles.captionBadge}>
          <span>내 솔로 탈출 확률은...</span>
        </div>
        <h1 className={styles.title}>
          <span className={styles.headline}>{headline}</span>
          <span className={styles.percent}>{stripHtml(result.name)}</span>
        </h1>

        {result.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            className={styles.image}
            src={result.image}
            alt={imageAlt}
            draggable={false}
          />
        ) : null}
      </div>

      <div className={styles.descriptionCard}>
        {categoryText ? (
          <span className={styles.categoryPill}>{categoryText}</span>
        ) : null}
        {descriptionMain ? (
          <div
            className={styles.descriptionBody}
            dangerouslySetInnerHTML={{ __html: descriptionMain }}
          />
        ) : null}
      </div>

      {hasMatchups ? (
        <div className={styles.matchupGrid}>
          {goodMatch ? (
            <div className={`${styles.matchupCard} ${styles.matchupGood}`}>
              <span className={styles.matchupLabel}>💞 환상의 짝꿍</span>
              <strong className={styles.matchupName}>{goodMatch}</strong>
            </div>
          ) : null}
          {badMatch ? (
            <div className={`${styles.matchupCard} ${styles.matchupBad}`}>
              <span className={styles.matchupLabel}>💔 파국의 짝꿍</span>
              <strong className={styles.matchupName}>{badMatch}</strong>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default SoloEscapeResult;
