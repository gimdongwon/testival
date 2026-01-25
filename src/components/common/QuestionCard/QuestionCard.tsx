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
  /** Q번호(Q1, Q2 등)에 적용할 커스텀 스타일 */
  questionNumberStyle?: React.CSSProperties;
  /** 질문 제목에 적용할 커스텀 스타일 */
  questionTitleStyle?: React.CSSProperties;
  /** 옵션 라벨(A, B 등)에 적용할 커스텀 스타일 */
  optionLabelStyle?: React.CSSProperties;
  /** 질문 번호 뒤의 점(.) 숨김 여부 */
  hideQuestionNumberDot?: boolean;
  /** 옵션 라벨(A., B. 등) 숨김 여부 */
  hideOptionLabel?: boolean;
  /** 옵션별 배경색 배열 (인덱스 순서대로 적용) */
  optionColors?: string[];
  /** 옵션 텍스트 스타일 */
  optionTextStyle?: React.CSSProperties;
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
  questionNumberStyle,
  questionTitleStyle,
  optionLabelStyle,
  hideQuestionNumberDot = false,
  hideOptionLabel = false,
  optionColors,
  optionTextStyle,
}) => {
  return (
    <div className={styles.centerGrid}>
      <div className={styles.card}>
        <div className={styles.cardHeader} aria-label='질문지 상단'>
          <span
            className={styles.cardQnum}
            style={
              questionNumberStyle
                ? (questionNumberStyle as React.CSSProperties)
                : {
                    color: questionTextColor,
                    fontFamily: questionFontFamily,
                  }
            }
          >
            Q{number}
            {hideQuestionNumberDot ? '' : '.'}
          </span>
        </div>

        <h2
          className={styles.cardTitle}
          style={
            questionTitleStyle
              ? (questionTitleStyle as React.CSSProperties)
              : {
                  color: questionTextColor,
                  fontFamily: questionFontFamily,
                }
          }
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
            fontFamily: optionFontFamily,
          }}
        >
          {options.map((opt, idx) => {
            // 옵션별 배경색 계산
            const backgroundColor = optionColors?.[idx];
            
            // 배경색이 설정되어 있으면 적용
            const buttonStyle = backgroundColor
              ? {
                  ...style,
                  backgroundColor,
                  color: '#fff',
                  border: 'none',
                }
              : style;

            return (
              <div className={styles.fullWidth} key={opt.id}>
                <button
                  onClick={() => onSelect?.(opt.id)}
                  aria-label={`${opt.label} ${opt.text}`}
                  className={`${styles.optionBtn} ${
                    columns > 1 ? styles.optionTile : ''
                  } ${
                    hideOptionLabel && columns > 1 ? styles.optionCentered : ''
                  } ${optionClassName ?? ''}`}
                  style={buttonStyle}
                >
                  {!hideOptionLabel && (
                    <span className={styles.optionLabel} style={optionLabelStyle}>
                      {opt.label}
                    </span>
                  )}
                  <span
                    className={styles.optionText}
                    style={
                      optionTextStyle
                        ? (optionTextStyle as React.CSSProperties)
                        : undefined
                    }
                  >
                    {opt.text}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
