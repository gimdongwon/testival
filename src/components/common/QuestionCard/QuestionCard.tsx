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
};

const QuestionCard: React.FC<QuestionCardProps> = ({
  number,
  title,
  options,
  onSelect,
}) => {
  return (
    <div className={styles.centerGrid}>
      <div className={styles.card}>
        <div className={styles.cardHeader} aria-label='질문지 상단'>
          <span className={styles.cardQnum}>Q{number}.</span>
        </div>

        <h2 className={styles.cardTitle}>{title}</h2>

        <div className={styles.cardOptions} role='list'>
          {options.map((opt) => (
            <div className={styles.fullWidth} key={opt.id}>
              <button
                onClick={() => onSelect?.(opt.id)}
                aria-label={`${opt.label} ${opt.text}`}
                className={styles.optionBtn}
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
