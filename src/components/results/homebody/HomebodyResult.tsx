'use client';

import type { ResultLayoutProps } from '../types';
import styles from './HomebodyResult.module.scss';

/**
 * HomebodyResult — 집순이/집돌이 테스트 전용 결과 레이아웃 (Figma 2055:913 외)
 *
 * 데이터 소스(콘텐츠 JSON resultDetails):
 * - name         : 소제목 (예: "집에 왜 있어? 시간 아깝게")
 * - title        : 2줄 타이틀 (\n 구분, 학교안심 알림장 폰트)
 * - image        : 캐릭터 일러스트
 * - chips        : 상단 칩 배열 (예: ["집콕력 95%", "외출쿼터"])
 * - description  : 첫 문단(\n\n 기준)=헤드라인, 나머지=본문
 * - advice       : 💡 조언
 * - survivalItem : 🍀 찰떡 생존템
 * - goodMatch    : 💞 환상의 짝꿍
 * - badMatch     : 💔 파국의 짝꿍
 */

/** 빈 줄(\n\n)로 구분된 문단을 단락 배열로 분리한다. */
const toParagraphs = (text: string): string[] =>
  text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

type SectionProps = { label: string; body?: string };

const Section = ({ label, body }: SectionProps) => {
  if (!body) return null;
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionLabel}>{label}</h3>
      <p className={styles.sectionBody}>{body}</p>
    </div>
  );
};

const HomebodyResult = ({ result }: ResultLayoutProps) => {
  const titleLines = result.title.split('\n');
  const chunks = toParagraphs(result.description);
  const headline = chunks[0];
  const bodyParagraphs = chunks.slice(1);

  const chips = result.chips ?? [];
  const hasSections =
    result.advice || result.survivalItem || result.goodMatch || result.badMatch;

  return (
    <div className={styles.page}>
      {/* ── 카드 1: 소제목 · 타이틀 · 이미지 · 칩 · 설명 ── */}
      <div className={styles.mainCard}>
        <p className={styles.subtitle}>{result.name}</p>

        <h1 className={styles.title}>
          {titleLines.map((line, i) => (
            <span key={i} className={styles.titleLine}>
              {line}
            </span>
          ))}
        </h1>

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

        {chips.length > 0 && (
          <div className={styles.chips}>
            {chips.map((chip, i) => (
              <span key={i} className={styles.chip}>
                {chip}
              </span>
            ))}
          </div>
        )}

        {(headline || bodyParagraphs.length > 0) && (
          <div className={styles.description}>
            {headline && <p className={styles.headline}>{headline}</p>}
            {bodyParagraphs.length > 0 && (
              <div className={styles.body}>
                {bodyParagraphs.map((para, i) => (
                  <p key={i} className={styles.paragraph}>
                    {para}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 카드 2: 조언 · 생존템 · 궁합 ── */}
      {hasSections && (
        <div className={styles.sectionCard}>
          <Section label='💡 조언' body={result.advice} />
          <Section label='🍀 찰떡 생존템' body={result.survivalItem} />
          <Section label='💞 환상의 짝꿍' body={result.goodMatch} />
          <Section label='💔 파국의 짝꿍' body={result.badMatch} />
        </div>
      )}
    </div>
  );
};

export default HomebodyResult;
