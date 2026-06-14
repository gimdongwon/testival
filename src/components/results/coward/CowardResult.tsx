'use client';

import { Fragment } from 'react';
import type { ResultLayoutProps } from '../types';
import styles from './CowardResult.module.scss';

interface MatchupItem {
  label: string;
  name: string;
  tone: 'good' | 'bad';
}

interface StatItem {
  label: string;
  value: string;
}

/**
 * description 필드 파싱 규칙 (coward_test 전용):
 *
 * \n\n 구분자로 청크를 분리한다.
 * - "LEVEL"로 시작하는 청크 → 히어로 레벨 배지 (예: "LEVEL 01")
 * - 🎬/👻 로 시작하는 줄들로만 구성된 청크 → 스탯 행 ("아이콘+라벨|값")
 *     · 🎬 → 공포영화 생존 확률(시계 아이콘 + 초록 강조값)
 *     · 👻 → 나를 본 귀신의 한줄평(말풍선 아이콘 + 인용)
 * - 💞/💔 로 시작하는 줄들로만 구성된 청크 → 궁합("라벨|이름줄1|이름줄2…")
 * - 그 외 청크 → 설명 본문 단락(줄바꿈 보존, **텍스트** → 빨강 강조)
 */
const parseDescription = (
  desc: string,
): {
  level: string;
  paragraphs: string[];
  stats: StatItem[];
  ghostQuote?: string;
  matchups: MatchupItem[];
} => {
  const chunks = desc.split('\n\n').map((c) => c.trim());

  let level = '';
  const paragraphs: string[] = [];
  const stats: StatItem[] = [];
  let ghostQuote: string | undefined;
  const matchups: MatchupItem[] = [];

  for (const chunk of chunks) {
    if (!chunk) continue;
    const lines = chunk.split('\n').filter(Boolean);

    if (/^LEVEL/i.test(chunk)) {
      level = chunk;
      continue;
    }

    const isStatChunk =
      lines.length > 0 &&
      lines.every((l) => l.startsWith('🎬') || l.startsWith('👻'));
    if (isStatChunk) {
      for (const line of lines) {
        const [labelPart = '', value = ''] = line
          .split('|')
          .map((p) => p.trim());
        if (labelPart.startsWith('👻')) {
          ghostQuote = value;
        } else {
          stats.push({ label: labelPart.replace(/^🎬\s*/, ''), value });
        }
      }
      continue;
    }

    const isMatchupChunk =
      lines.length > 0 &&
      lines.every((l) => l.startsWith('💞') || l.startsWith('💔'));
    if (isMatchupChunk) {
      for (const line of lines) {
        const [label = '', ...nameLines] = line.split('|').map((p) => p.trim());
        matchups.push({
          label,
          name: nameLines.filter(Boolean).join('\n'),
          tone: line.startsWith('💞') ? 'good' : 'bad',
        });
      }
      continue;
    }

    paragraphs.push(chunk);
  }

  return { level, paragraphs, stats, ghostQuote, matchups };
};

/** **텍스트** 구간을 빨강 강조 span으로 렌더링 */
const renderAccented = (text: string) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <span key={i} className={styles.accent}>
          {part.slice(2, -2)}
        </span>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });

const ClockIcon = () => (
  <svg
    viewBox='0 0 18 21'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden
  >
    <path
      d='M6 2V0H12V2H6V2M8 13H10V7H8V13V13M9 21C7.76667 21 6.60417 20.7625 5.5125 20.2875C4.42083 19.8125 3.46667 19.1667 2.65 18.35C1.83333 17.5333 1.1875 16.5792 0.7125 15.4875C0.2375 14.3958 0 13.2333 0 12C0 10.7667 0.2375 9.60417 0.7125 8.5125C1.1875 7.42083 1.83333 6.46667 2.65 5.65C3.46667 4.83333 4.42083 4.1875 5.5125 3.7125C6.60417 3.2375 7.76667 3 9 3C10.0333 3 11.025 3.16667 11.975 3.5C12.925 3.83333 13.8167 4.31667 14.65 4.95L16.05 3.55L17.45 4.95L16.05 6.35C16.6833 7.18333 17.1667 8.075 17.5 9.025C17.8333 9.975 18 10.9667 18 12C18 13.2333 17.7625 14.3958 17.2875 15.4875C16.8125 16.5792 16.1667 17.5333 15.35 18.35C14.5333 19.1667 13.5792 19.8125 12.4875 20.2875C11.3958 20.7625 10.2333 21 9 21V21M9 19C10.9333 19 12.5833 18.3167 13.95 16.95C15.3167 15.5833 16 13.9333 16 12C16 10.0667 15.3167 8.41667 13.95 7.05C12.5833 5.68333 10.9333 5 9 5C7.06667 5 5.41667 5.68333 4.05 7.05C2.68333 8.41667 2 10.0667 2 12C2 13.9333 2.68333 15.5833 4.05 16.95C5.41667 18.3167 7.06667 19 9 19V19Z'
      fill='#C3F400'
    />
  </svg>
);

const QuoteIcon = () => (
  <svg
    viewBox='0 0 18 14'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden
  >
    <path
      d='M1 14C0.716667 14 0.479167 13.9042 0.2875 13.7125C0.0958333 13.5208 0 13.2833 0 13C0 12.7167 0.0958333 12.4792 0.2875 12.2875C0.479167 12.0958 0.716667 12 1 12H11C11.2833 12 11.5208 12.0958 11.7125 12.2875C11.9042 12.4792 12 12.7167 12 13C12 13.2833 11.9042 13.5208 11.7125 13.7125C11.5208 13.9042 11.2833 14 11 14H1V14M15 14C14.7167 14 14.4792 13.9042 14.2875 13.7125C14.0958 13.5208 14 13.2833 14 13C14 12.7167 14.0958 12.4792 14.2875 12.2875C14.4792 12.0958 14.7167 12 15 12H17C17.2833 12 17.5208 12.0958 17.7125 12.2875C17.9042 12.4792 18 12.7167 18 13C18 13.2833 17.9042 13.5208 17.7125 13.7125C17.5208 13.9042 17.2833 14 17 14H15V14M1 10C0.716667 10 0.479167 9.90417 0.2875 9.7125C0.0958333 9.52083 0 9.28333 0 9C0 8.71667 0.0958333 8.47917 0.2875 8.2875C0.479167 8.09583 0.716667 8 1 8H3C3.28333 8 3.52083 8.09583 3.7125 8.2875C3.90417 8.47917 4 8.71667 4 9C4 9.28333 3.90417 9.52083 3.7125 9.7125C3.52083 9.90417 3.28333 10 3 10H1V10M7 10C6.71667 10 6.47917 9.90417 6.2875 9.7125C6.09583 9.52083 6 9.28333 6 9C6 8.71667 6.09583 8.47917 6.2875 8.2875C6.47917 8.09583 6.71667 8 7 8H17C17.2833 8 17.5208 8.09583 17.7125 8.2875C17.9042 8.47917 18 8.71667 18 9C18 9.28333 17.9042 9.52083 17.7125 9.7125C17.5208 9.90417 17.2833 10 17 10H7V10M1 6C0.716667 6 0.479167 5.90417 0.2875 5.7125C0.0958333 5.52083 0 5.28333 0 5C0 4.71667 0.0958333 4.47917 0.2875 4.2875C0.479167 4.09583 0.716667 4 1 4H12C12.2833 4 12.5208 4.09583 12.7125 4.2875C12.9042 4.47917 13 4.71667 13 5C13 5.28333 12.9042 5.52083 12.7125 5.7125C12.5208 5.90417 12.2833 6 12 6H1V6M16 6C15.7167 6 15.4792 5.90417 15.2875 5.7125C15.0958 5.52083 15 5.28333 15 5C15 4.71667 15.0958 4.47917 15.2875 4.2875C15.4792 4.09583 15.7167 4 16 4H17C17.2833 4 17.5208 4.09583 17.7125 4.2875C17.9042 4.47917 18 4.71667 18 5C18 5.28333 17.9042 5.52083 17.7125 5.7125C17.5208 5.90417 17.2833 6 17 6H16V6M1 2C0.716667 2 0.479167 1.90417 0.2875 1.7125C0.0958333 1.52083 0 1.28333 0 1C0 0.716667 0.0958333 0.479167 0.2875 0.2875C0.479167 0.0958333 0.716667 0 1 0H6C6.28333 0 6.52083 0.0958333 6.7125 0.2875C6.90417 0.479167 7 0.716667 7 1C7 1.28333 6.90417 1.52083 6.7125 1.7125C6.52083 1.90417 6.28333 2 6 2H1V2M10 2C9.71667 2 9.47917 1.90417 9.2875 1.7125C9.09583 1.52083 9 1.28333 9 1C9 0.716667 9.09583 0.479167 9.2875 0.2875C9.47917 0.0958333 9.71667 0 10 0H17C17.2833 0 17.5208 0.0958333 17.7125 0.2875C17.9042 0.479167 18 0.716667 18 1C18 1.28333 17.9042 1.52083 17.7125 1.7125C17.5208 1.90417 17.2833 2 17 2H10V2Z'
      fill='#FFB4AA'
    />
  </svg>
);

/** 분위기용 심전도(ECG) 라인 */
const EcgLine = () => (
  <svg
    className={styles.ecgSvg}
    viewBox='0 0 293 38.0863'
    fill='none'
    preserveAspectRatio='none'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden
  >
    <path
      d='M0 19.0431H39.0667L43.95 11.0431L53.7167 27.0431L58.6 19.0431H97.6667L102.55 7.04313L112.317 31.0431L117.2 19.0431H195.333L200.217 3.04313L209.983 35.0431L214.867 19.0431H293'
      stroke='#CCFF00'
      strokeWidth='1.77667'
    />
  </svg>
);

const CowardResult = ({ result }: ResultLayoutProps) => {
  const { level, paragraphs, stats, ghostQuote, matchups } = parseDescription(
    result.description,
  );
  // 제목: 마지막 줄이 메인 이름(큰 글씨), 그 앞 줄들은 수식 문구(작은 글씨)
  const titleLines = result.title.split('\n');
  const titleIntro = titleLines.slice(0, -1);
  const titleName = titleLines[titleLines.length - 1] ?? '';

  return (
    <div className={styles.page}>
      {/* ── 히어로: 레벨 배지 + 타이틀 + 언더라인 ── */}
      <div className={styles.hero}>
        {level && <span className={styles.levelBadge}>{level}</span>}
        <div className={styles.titleWrap}>
          <h1 className={styles.title}>
            {titleIntro.map((line, i) => (
              <span key={i} className={styles.titleIntro}>
                {line}
              </span>
            ))}
            <span className={styles.titleName}>{titleName}</span>
          </h1>
          <span className={styles.titleUnderline} />
        </div>
      </div>

      {/* ── 캐릭터 이미지 카드 (네온 글로우 + 하단 페이드) ── */}
      {result.image && (
        <div className={styles.imageCard}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.resultImage}
            src={result.image}
            alt={`${result.name} 결과 이미지`}
            draggable={false}
          />
          <span className={styles.imageFade} />
        </div>
      )}

      {/* ── 성격 설명 카드 ── */}
      {paragraphs.length > 0 && (
        <div className={styles.descCard}>
          <span className={styles.descQuoteMark} aria-hidden>
            &rdquo;
          </span>
          <div className={styles.descBody}>
            {paragraphs.map((para, i) => (
              <p key={i} className={styles.descParagraph}>
                {renderAccented(para)}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* ── 스탯 그리드 (생존 확률 + 귀신 한줄평) ── */}
      {(stats.length > 0 || ghostQuote) && (
        <div className={styles.statsGrid}>
          {stats.map((stat, i) => (
            <div key={i} className={styles.statRow}>
              <span className={styles.statLabel}>
                <ClockIcon />
                {stat.label}
              </span>
              <span className={styles.statValue}>{stat.value}</span>
            </div>
          ))}
          {ghostQuote && (
            <div className={styles.quoteRow}>
              <span className={styles.statLabel}>
                <QuoteIcon />
                나를 본 귀신의 한줄평
              </span>
              <strong className={styles.ghostQuote}>{ghostQuote}</strong>
            </div>
          )}
        </div>
      )}
      {/* ── 분위기용 심전도 라인 ── */}
      <div className={styles.ecg}>
        <EcgLine />
        <span className={styles.ecgFade} />
      </div>

      {/* ── 궁합 결과 ── */}
      {matchups.length > 0 && (
        <div className={styles.matchupSection}>
          <p className={styles.matchupSectionLabel}>궁합 결과</p>
          <div className={styles.matchupGrid}>
            {matchups.map((m, i) => (
              <div
                key={i}
                className={`${styles.matchupCard} ${
                  m.tone === 'good' ? styles.matchupGood : styles.matchupBad
                }`}
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

export default CowardResult;
