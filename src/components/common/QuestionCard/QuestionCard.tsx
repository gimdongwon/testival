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
}) => {
  return (
    <div className={styles.centerGrid}>
      <div className={styles.card}>
        <div className={styles.cardHeader} aria-label='질문지 상단'>
          <span
            className={styles.cardQnum}
            style={{ color: questionTextColor, fontFamily: questionFontFamily }}
          >
            Q{number}.
          </span>
        </div>

        <h2
          className={styles.cardTitle}
          style={{
            color: questionTextColor,
            fontFamily: questionFontFamily,
          }}
        >
          {title}
        </h2>

        <div className={styles.cardOptions} role='list'>
          {options.map((opt) => (
            <div className={styles.fullWidth} key={opt.id}>
              <button
                onClick={() => onSelect?.(opt.id)}
                aria-label={`${opt.label} ${opt.text}`}
                className={`${styles.optionBtn} ${optionClassName ?? ''}`}
                style={style}
              >
                <span className={styles.optionLabel}>{opt.label}</span>
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
