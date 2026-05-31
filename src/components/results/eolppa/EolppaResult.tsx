'use client';

import type { ResultLayoutProps } from '../types';
import styles from './EolppaResult.module.scss';

interface MatchupItem {
  label: string;
  emoji: string;
  name: string;
}

/**
 * description 필드 파싱 규칙:
 *
 * \n\n 구분자로 청크를 분리한다.
 * - 첫 번째 청크 → 소제목 (descSubtitle)
 * - 마지막 청크가 "label|emoji|name" 형식 라인들로만 구성되어 있으면 → 궁합(matchup)
 * - 나머지 중간 청크 → 본문 단락 (HTML <b> 허용)
 */
const parseDescription = (
  desc: string
): { subtitle: string; paragraphs: string[]; matchups: MatchupItem[] } => {
  const chunks = desc.split('\n\n');

  const lastChunk = chunks[chunks.length - 1] ?? '';
  const lastLines = lastChunk.split('\n').filter(Boolean);
  const isMatchupChunk = lastLines.length > 0 && lastLines.every((l) => l.includes('|'));

  const matchups: MatchupItem[] = isMatchupChunk
    ? lastLines.map((line) => {
        const parts = line.split('|');
        const label = parts[0]?.trim() ?? '';
        const emoji = parts[1]?.trim() ?? '';
        const nameLine1 = parts[2]?.trim() ?? '';
        const nameLine2 = parts[3]?.trim() ?? '';
        return { label, emoji, name: nameLine2 ? `${nameLine1}\n${nameLine2}` : nameLine1 };
      })
    : [];

  const bodyChunks = isMatchupChunk ? chunks.slice(0, -1) : chunks;
  const [subtitleChunk, ...paragraphChunks] = bodyChunks;

  return {
    subtitle: subtitleChunk?.trim() ?? '',
    paragraphs: paragraphChunks.map((c) => c.trim()).filter(Boolean),
    matchups,
  };
};

const EolppaResult = ({ result }: ResultLayoutProps) => {
  const titleLines = result.title.split('\n');
  const titleIntro = titleLines[0] ?? '';
  const titleName = titleLines.slice(1).join(' ');

  const { subtitle, paragraphs, matchups } = parseDescription(result.description);
  const visibleKeywords = result.keywords.slice(0, 2);

  return (
    <div className={styles.page}>
      {/* ── 히어로 카드 ── */}
      <div className={styles.heroCard}>
        <div className={styles.heroCaptionWrap}>
          <span className={styles.heroCaptionBadge}>✦ 당신의 결과는</span>
        </div>

        <h1 className={styles.heroTitle}>
          {titleIntro && <span className={styles.heroTitleIntro}>{titleIntro}</span>}
          {titleName && <span className={styles.heroTitleName}>{titleName}</span>}
        </h1>

        {result.image && (
          <div className={styles.imageWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.resultImage}
              src={result.image}
              alt={`${result.name} 결과 이미지`}
              draggable={false}
            />
          </div>
        )}

        {visibleKeywords.length > 0 && (
          <div className={styles.keywordRow}>
            {visibleKeywords.map((kw) => (
              <span key={kw} className={styles.keywordPill}>
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── 설명 카드 ── */}
      <div className={styles.descCard}>
        <div className={styles.descBody}>
          <span className={styles.descCategoryBadge}>{result.name}</span>

          {subtitle && <p className={styles.descSubtitle}>{subtitle}</p>}

          {paragraphs.length > 0 && (
            <div className={styles.descParagraphs}>
              {paragraphs.map((para, i) => (
                <p
                  key={i}
                  className={styles.descParagraph}
                  dangerouslySetInnerHTML={{ __html: para }}
                />
              ))}
            </div>
          )}
        </div>

        {matchups.length > 0 && (
          <>
            <div className={styles.divider} />
            <div className={styles.matchupSection}>
              <p className={styles.matchupSectionLabel}>궁합 결과</p>
              <div className={styles.matchupGrid}>
                {matchups.map((m, i) => (
                  <div
                    key={i}
                    className={`${styles.matchupCard} ${i === 0 ? styles.matchupGood : styles.matchupBad}`}
                  >
                    <span className={styles.matchupHeader}>{m.label}</span>
                    <span className={styles.matchupEmoji} aria-hidden='true'>
                      {m.emoji}
                    </span>
                    <strong className={styles.matchupName}>{m.name}</strong>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EolppaResult;
