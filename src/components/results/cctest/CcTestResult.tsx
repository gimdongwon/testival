'use client';

import type { ResultLayoutProps } from '../types';
import styles from './CcTestResult.module.scss';

interface MatchupItem {
  label: string;
  name: string;
}

/**
 * description 필드 파싱 규칙 (cc-test 전용):
 *
 * \n\n 구분자로 청크를 분리한다.
 * - 첫 번째 청크 → 레벨 라벨 (예: "LEVEL 1 · 눈치 만렙")
 * - 두 번째 청크 → 분석 카드 헤더 인용구 (예: "\"내 눈은 절대 못 속이지!\"")
 * - "💡"로 시작하는 청크 → 팁 섹션 헤더. 그 앞은 본문, 뒤는 팁 단락 (HTML <b> 허용)
 * - 마지막 청크가 "label|name줄1|name줄2" 형식 라인들로만 구성되어 있으면 → 궁합(matchup)
 */
const parseDescription = (
  desc: string
): {
  levelLabel: string;
  quote: string;
  paragraphs: string[];
  tipHeader: string;
  tipParagraphs: string[];
  matchups: MatchupItem[];
} => {
  const chunks = desc.split('\n\n');

  const lastChunk = chunks[chunks.length - 1] ?? '';
  const lastLines = lastChunk.split('\n').filter(Boolean);
  const isMatchupChunk = lastLines.length > 0 && lastLines.every((l) => l.includes('|'));

  const matchups: MatchupItem[] = isMatchupChunk
    ? lastLines.map((line) => {
        const [label = '', ...nameLines] = line.split('|').map((p) => p.trim());
        return { label, name: nameLines.filter(Boolean).join('\n') };
      })
    : [];

  const bodyChunks = isMatchupChunk ? chunks.slice(0, -1) : chunks;
  const [levelChunk, quoteChunk, ...restChunks] = bodyChunks;

  const tipIndex = restChunks.findIndex((c) => c.trimStart().startsWith('💡'));
  const paragraphs = (tipIndex >= 0 ? restChunks.slice(0, tipIndex) : restChunks)
    .map((c) => c.trim())
    .filter(Boolean);
  const tipHeader = tipIndex >= 0 ? restChunks[tipIndex].trim() : '';
  const tipParagraphs =
    tipIndex >= 0
      ? restChunks
          .slice(tipIndex + 1)
          .map((c) => c.trim())
          .filter(Boolean)
      : [];

  return {
    levelLabel: levelChunk?.trim() ?? '',
    quote: quoteChunk?.trim() ?? '',
    paragraphs,
    tipHeader,
    tipParagraphs,
    matchups,
  };
};

const CcTestResult = ({ result }: ResultLayoutProps) => {
  const titleLines = result.title.split('\n');
  const titleIntro = titleLines[0] ?? '';
  const titleName = titleLines.slice(1).join(' ');

  const { levelLabel, quote, paragraphs, tipHeader, tipParagraphs, matchups } =
    parseDescription(result.description);

  return (
    <div className={styles.page}>
      {/* ── 히어로: 배지 + 레벨 + 타이틀 ── */}
      <div className={styles.hero}>
        <span className={styles.heroBadge}>📹 당신의 결과</span>
        {levelLabel && <p className={styles.heroLevel}>{levelLabel}</p>}
        <h1 className={styles.heroTitle}>
          {titleIntro && <span className={styles.heroTitleIntro}>{titleIntro}</span>}
          {titleName && <span className={styles.heroTitleName}>{titleName}</span>}
        </h1>
      </div>

      {/* ── 캐릭터 이미지 카드 (테두리·키워드칩 포함 이미지) ── */}
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

      {/* ── 캐릭터 분석 카드 ── */}
      <div className={styles.analysisCard}>
        <div className={styles.analysisHeader}>
          <span className={styles.analysisHeaderLabel}>CHARACTER ANALYSIS</span>
          {quote && <p className={styles.analysisQuote}>{quote}</p>}
        </div>

        <div className={styles.analysisBody}>
          {paragraphs.map((para, i) => (
            <p
              key={i}
              className={styles.analysisParagraph}
              dangerouslySetInnerHTML={{ __html: para }}
            />
          ))}

          {tipHeader && (
            <>
              <div className={styles.divider} />
              <p className={styles.tipHeader}>{tipHeader}</p>
              {tipParagraphs.map((para, i) => (
                <p
                  key={i}
                  className={styles.analysisParagraph}
                  dangerouslySetInnerHTML={{ __html: para }}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {/* ── 궁합 결과 ── */}
      {matchups.length > 0 && (
        <div className={styles.matchupSection}>
          <p className={styles.matchupSectionLabel}>궁합 결과</p>
          <div className={styles.matchupGrid}>
            {matchups.map((m, i) => (
              <div
                key={i}
                className={`${styles.matchupCard} ${i === 0 ? styles.matchupGood : styles.matchupBad}`}
              >
                <span className={styles.matchupHeader}>{m.label}</span>
                <strong className={styles.matchupName}>{m.name}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CcTestResult;
