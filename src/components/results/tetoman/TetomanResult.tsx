'use client';

import type { ResultLayoutProps } from '../types';
import styles from './TetomanResult.module.scss';

/**
 * TetomanResult — 에겐녀 vs 테토녀 테스트 전용 결과 레이아웃 (Figma 1997:497 외)
 *
 * 데이터 소스(콘텐츠 JSON resultDetails):
 * - title              : 2줄("연약함이 곧 무기,\n천연 폭스"). 마지막 줄이 핑크 강조 이름.
 * - scoreText          : 상단 점수 라벨 ("에겐녀 100%")
 * - gauge.egen / .teto : 에겐/테토 게이지 퍼센트(0~100)
 * - personalitySectionTitle : PERSONALITY 굵은 소제목
 * - description        : PERSONALITY 본문(줄바꿈 보존)
 * - compatibility.good/.bad : 궁합 카드(title + body)
 * - image              : 히어로 일러스트
 */
/** 빈 줄(\n\n)로 구분된 문단을 단락 배열로 분리한다. */
const toParagraphs = (text: string): string[] =>
  text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

const TetomanResult = ({ result, config }: ResultLayoutProps) => {
  const titleLines = result.title.split('\n');
  const titleIntro = titleLines.slice(0, -1);
  const titleName = titleLines[titleLines.length - 1] ?? '';

  const gauge = result.gauge;
  const compat = result.compatibility;
  // 진짜 테토남(blue): 테토를 위에, 에겐을 아래에 (Figma 2017:563 외)
  const tetoFirst = config?.resultTheme === 'blue';
  const gaugeRows = gauge
    ? (tetoFirst
        ? [
            { key: 'teto', label: '테토', value: gauge.teto, isTeto: true },
            { key: 'egen', label: '에겐', value: gauge.egen, isTeto: false },
          ]
        : [
            { key: 'egen', label: '에겐', value: gauge.egen, isTeto: false },
            { key: 'teto', label: '테토', value: gauge.teto, isTeto: true },
          ])
    : [];

  return (
    <div
      className={`${styles.page} ${
        config?.resultTheme === 'blue' ? styles.themeBlue : ''
      }`}
    >
      {/* ── 히어로: 라벨 · 점수 · 타이틀 · 게이지 · 일러스트 ── */}
      <div className={styles.hero}>
        <span className={styles.resultLabel}>RESULT</span>
        {result.scoreText && (
          <p className={styles.scoreText}>{result.scoreText}</p>
        )}

        <h1 className={styles.title}>
          {titleIntro.map((line, i) => (
            <span key={i} className={styles.titleIntro}>
              {line}
            </span>
          ))}
          <span className={styles.titleName}>{titleName}</span>
        </h1>

        {gauge && (
          <div className={styles.gauge}>
            {gaugeRows.map((row) => (
              <div key={row.key} className={styles.gaugeRow}>
                <span className={styles.gaugeLabel}>{row.label}</span>
                <span className={styles.gaugeTrack}>
                  <span
                    className={`${styles.gaugeFill} ${
                      row.isTeto ? styles.gaugeFillTeto : ''
                    }`}
                    style={{ width: `${row.value}%` }}
                  />
                </span>
                <span className={styles.gaugePercent}>{row.value}%</span>
              </div>
            ))}
          </div>
        )}

        {result.image && (
          <div className={styles.imageCard}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.heroImage}
              src={result.image}
              alt={`${result.name} 결과 이미지`}
              draggable={false}
            />
          </div>
        )}
      </div>

      {/* ── 본문(화이트 배경) ── */}
      <div className={styles.body}>
        {(result.personalitySectionTitle || result.description) && (
          <section className={styles.section}>
            <span className={styles.sectionLabel}>PERSONALITY</span>
            {result.personalitySectionTitle && (
              <h2 className={styles.personalityTitle}>
                {result.personalitySectionTitle}
              </h2>
            )}
            {result.description && (
              <div className={styles.personalityBody}>
                {toParagraphs(result.description).map((para, i) => (
                  <p key={i} className={styles.paragraph}>
                    {para}
                  </p>
                ))}
              </div>
            )}
          </section>
        )}

        {compat && (
          <section className={styles.section}>
            <span className={styles.divider} aria-hidden />
            <span className={styles.sectionLabel}>COMPATIBILITY</span>

            <div className={`${styles.matchCard} ${styles.matchGood}`}>
              <p className={styles.matchKind}>
                <span className={styles.matchEmojiGood}>💞 </span>
                <span className={styles.matchKindText}>환상의 짝꿍</span>
              </p>
              <h3 className={styles.matchTitle}>{compat.good.title}</h3>
              <div className={styles.matchBody}>
                {toParagraphs(compat.good.body).map((para, i) => (
                  <p key={i} className={styles.paragraph}>
                    {para}
                  </p>
                ))}
              </div>
            </div>

            <div className={`${styles.matchCard} ${styles.matchBad}`}>
              <p className={styles.matchKind}>
                <span className={styles.matchEmojiBad}>💔 </span>
                <span className={styles.matchKindText}>파국의 짝꿍</span>
              </p>
              <h3 className={styles.matchTitle}>{compat.bad.title}</h3>
              <div className={styles.matchBody}>
                {toParagraphs(compat.bad.body).map((para, i) => (
                  <p key={i} className={styles.paragraph}>
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default TetomanResult;
