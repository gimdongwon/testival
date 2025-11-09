'use client';

import React from 'react';
import styles from './QuestionCard.module.scss';

export type QuestionOption = {
  id: string;
  label: string; // "A.", "B." 등 표시용 접두사
  text: string;
};

export type QuestionCardProps = {
  number: number;
  title: string;
  options: QuestionOption[];
  onSelect?: (optionId: string) => void;
  backgroundImage?: string; // 배경 이미지 경로 (선택)
  style?: React.CSSProperties;
  optionClassName?: string;
  questionTextColor?: string;
  questionFontFamily?: string;
  /** 선택지 컨테이너를 n열 그리드로 렌더링 (기본 1 = 기존 스택) */
  columns?: number;
  /** 옵션 라벨/텍스트 및 컨테이너의 폰트 패밀리(케이스별 오버라이드용) */
  optionFontFamily?: string;
};

const QuestionCard: React.FC<QuestionCardProps> = ({
  number,
  title,
  options,
  onSelect,
  style,
  optionClassName,
  questionTextColor,
  questionFontFamily,
  columns = 1,
  optionFontFamily,
}) => {
  return (
    <div className={styles.centerGrid}>
      <div className={styles.card}>
        <div className={styles.cardHeader} aria-label='질문지 상단'>
          <span
            className={styles.cardQnum}
            style={{
              color: optionFontFamily ? '#FB2575' : questionTextColor,
              fontFamily: optionFontFamily ?? questionFontFamily,
              WebkitTextStroke: optionFontFamily ? '2.5px #fff' : undefined,
            }}
          >
            Q{number}.
          </span>
        </div>

        <h2
          className={styles.cardTitle}
          style={{
            color: optionFontFamily ? '#fff' : questionTextColor,
            fontFamily: optionFontFamily ?? questionFontFamily,
            WebkitTextStroke: optionFontFamily ? '2.5px black' : undefined,
          }}
        >
          {title}
        </h2>

        <div
          className={styles.cardOptions}
          role='list'
          /* columns > 1 이면 grid로 전환하여 가로 배치 */
          style={{
            ...(columns > 1
              ? ({
                  display: 'grid',
                  gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                  gap: 16,
                  alignItems: 'stretch',
                  justifyItems: 'stretch',
                } as React.CSSProperties)
              : {}),
            ...(optionFontFamily ? { fontFamily: optionFontFamily } : {}),
          }}
        >
          {options.map((opt) => (
            <div className={styles.fullWidth} key={opt.id}>
              <button
                onClick={() => onSelect?.(opt.id)}
                aria-label={`${opt.label} ${opt.text}`}
                className={`${styles.optionBtn} ${
                  columns > 1 ? styles.optionTile : ''
                } ${optionClassName ?? ''}`}
                style={style}
              >
                <span
                  className={styles.optionLabel}
                  style={
                    optionFontFamily
                      ? { fontFamily: optionFontFamily }
                      : undefined
                  }
                >
                  {opt.label}
                </span>
                <span className={styles.optionText}>{opt.text}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
