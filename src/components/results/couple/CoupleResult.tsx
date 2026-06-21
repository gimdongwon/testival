'use client';

import { Fragment } from 'react';
import type { ResultLayoutProps } from '../types';
import styles from './CoupleResult.module.scss';

interface Matchup {
  name: string;
  tone: 'good' | 'bad';
}

/**
 * description 필드 파싱 규칙 (couple_level_test 전용):
 *
 * \n\n 구분자로 청크를 분리한다.
 * - 첫 청크 → "이모지|말버릇" (예: `🐣|"잘 잤어? ㅎㅎ"`)
 * - `💊|`로 시작 → 처방전(Doctor's Note) 본문
 * - `🗺️|`로 시작 → 단골 데이트 코스 본문
 * - `💞|`로 시작 → 궁합 환상의 짝꿍 이름
 * - `💔|`로 시작 → 궁합 파국의 짝꿍 이름
 * - 그 외 청크 → 캐릭터 설명 단락(`**텍스트**` → 강조)
 */
const parseDescription = (
  desc: string,
): {
  emoji: string;
  quote: string;
  paragraphs: string[];
  prescription: string;
  dateCourse: string;
  matchups: Matchup[];
} => {
  const chunks = desc.split('\n\n').map((c) => c.trim()).filter(Boolean);

  let emoji = '';
  let quote = '';
  const paragraphs: string[] = [];
  let prescription = '';
  let dateCourse = '';
  const matchups: Matchup[] = [];

  chunks.forEach((chunk, i) => {
    if (chunk.startsWith('💊|')) {
      prescription = chunk.slice(chunk.indexOf('|') + 1).trim();
      return;
    }
    if (chunk.startsWith('🗺️|')) {
      dateCourse = chunk.slice(chunk.indexOf('|') + 1).trim();
      return;
    }
    if (chunk.startsWith('💞|')) {
      matchups.push({ name: chunk.slice(chunk.indexOf('|') + 1).trim(), tone: 'good' });
      return;
    }
    if (chunk.startsWith('💔|')) {
      matchups.push({ name: chunk.slice(chunk.indexOf('|') + 1).trim(), tone: 'bad' });
      return;
    }
    // 첫 청크는 "이모지|말버릇" 메타
    if (i === 0 && chunk.includes('|')) {
      const [e = '', ...rest] = chunk.split('|');
      emoji = e.trim();
      quote = rest.join('|').trim();
      return;
    }
    paragraphs.push(chunk);
  });

  return { emoji, quote, paragraphs, prescription, dateCourse, matchups };
};

/** `**텍스트**` 구간을 강조 span으로 렌더링 */
const renderAccented = (text: string, accentClass: string) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className={accentClass}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });

/** 섹션 헤더(라벨 + 그라데이션 디바이더) */
const SectionLabel = ({ children }: { children: string }) => (
  <div className={styles.sectionHead}>
    <span className={styles.sectionLabel}>{children}</span>
    <span className={styles.sectionDivider} />
  </div>
);

/** 결과 이미지 캐시버스트 버전 — 이미지 교체 시 올린다 */
const IMAGE_VERSION = '2';

const CoupleResult = ({ result }: ResultLayoutProps) => {
  const { emoji, quote, paragraphs, prescription, dateCourse, matchups } =
    parseDescription(result.description);

  const heroSrc = result.image
    ? `${result.image}${result.image.includes('?') ? '&' : '?'}v=${IMAGE_VERSION}`
    : undefined;

  return (
    <div className={styles.page}>
      {/* ── 히어로: 캐릭터 일러스트(타이틀 포함) ── */}
      {heroSrc && (
        <div className={styles.hero}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.heroImage}
            src={heroSrc}
            alt={`${result.name} 결과 이미지`}
            draggable={false}
          />
        </div>
      )}

      <div className={styles.body}>
        {/* ── 우리 커플 유형 ── */}
        <section className={styles.section}>
          <SectionLabel>우리 커플 유형</SectionLabel>
          <div className={styles.typeCard}>
            <span className={styles.typeGlow} aria-hidden />
            <div className={styles.typeTop}>
              {emoji && (
                <span className={styles.emojiBadge} aria-hidden>
                  {emoji}
                </span>
              )}
              {quote && (
                <div className={styles.habitBadge}>
                  <span className={styles.habitLabel}>말버릇</span>
                  <strong className={styles.habitQuote}>{quote}</strong>
                </div>
              )}
            </div>
            <div className={styles.typeDesc}>
              {paragraphs.map((para, i) => (
                <p key={i} className={styles.typeParagraph}>
                  {renderAccented(para, styles.accentWarm)}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* ── 처방전 ── */}
        {prescription && (
          <section className={styles.section}>
            <SectionLabel>처방전</SectionLabel>
            <div className={styles.rxCard}>
              <span className={`${styles.rxGlow} ${styles.rxGlowTop}`} aria-hidden />
              <span className={`${styles.rxGlow} ${styles.rxGlowBottom}`} aria-hidden />
              <div className={styles.rxHead}>
                <span className={styles.rxPill} aria-hidden>
                  💊
                </span>
                <span className={styles.rxNote}>Doctor&apos;s Note</span>
              </div>
              <p className={styles.rxBody}>
                {renderAccented(prescription, styles.accentGold)}
              </p>
            </div>
          </section>
        )}

        {/* ── 단골 데이트 코스 ── */}
        {dateCourse && (
          <section className={styles.section}>
            <SectionLabel>단골 데이트 코스</SectionLabel>
            <div className={styles.spotCard}>
              <div className={styles.spotHead}>
                <span className={styles.spotIcon} aria-hidden>
                  🗺️
                </span>
                <span className={styles.spotLabel}>Our Spot</span>
              </div>
              <p className={styles.spotBody}>{dateCourse}</p>
            </div>
          </section>
        )}

        {/* ── 궁합 ── */}
        {matchups.length > 0 && (
          <section className={styles.section}>
            <SectionLabel>궁합</SectionLabel>
            <div className={styles.matchupGrid}>
              {matchups.map((m, i) => (
                <div
                  key={i}
                  className={`${styles.matchupCard} ${
                    m.tone === 'good' ? styles.matchupGood : styles.matchupBad
                  }`}
                >
                  <span className={styles.matchupLabel}>
                    {m.tone === 'good' ? '💞 환상의 짝꿍' : '💔 파국의 짝꿍'}
                  </span>
                  <strong className={styles.matchupName}>{m.name}</strong>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CoupleResult;
