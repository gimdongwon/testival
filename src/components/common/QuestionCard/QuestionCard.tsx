'use client';

import React, { type CSSProperties } from 'react';
import Image from 'next/image';
import styles from './QuestionCard.module.scss';

export type QuestionOption = {
  id: string;
  label: string;
  text: string;
};

export type QuestionCardProps = {
  number: number;
  title: string;
  options: QuestionOption[];
  onSelect?: (optionId: string) => void;
  backgroundImage?: string;
  questionImage?: string;
  cardBorderColor?: string;
  style?: React.CSSProperties;
  optionClassName?: string;
  questionTextColor?: string;
  questionFontFamily?: string;
  columns?: number;
  optionFontFamily?: string;
  questionNumberStyle?: React.CSSProperties;
  questionTitleStyle?: React.CSSProperties;
  optionLabelStyle?: React.CSSProperties;
  hideQuestionNumberDot?: boolean;
  hideQuestionNumberPrefix?: boolean;
  hideOptionLabel?: boolean;
  optionColors?: string[];
  optionTextStyle?: React.CSSProperties;
  optionBorderColor?: string;
};

const QuestionCard: React.FC<QuestionCardProps> = ({
  number,
  title,
  options,
  onSelect,
  questionImage,
  cardBorderColor,
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
  hideQuestionNumberPrefix = false,
  hideOptionLabel = false,
  optionColors,
  optionTextStyle,
  optionBorderColor: optionBorderColorProp,
}) => {
  const borderStyle = cardBorderColor
    ? { border: `1.5px solid ${cardBorderColor}` }
    : undefined;

  const optionBorderResolved = optionBorderColorProp ?? cardBorderColor;
  const optionCustomBorderStyle: CSSProperties | undefined = optionBorderResolved
    ? {
        border: `2px solid ${optionBorderResolved}`,
      }
    : undefined;

  return (
    <div className={styles.centerGrid}>
      <div className={`${styles.card} ${cardBorderColor ? styles.cardBordered : ''}`}>
        <div
          className={`${styles.cardHeaderGroup} ${cardBorderColor ? styles.bordered : ''}`}
          style={borderStyle}
          aria-label='질문지 상단'
        >
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
            {hideQuestionNumberPrefix ? '' : 'Q'}{number}
            {hideQuestionNumberDot ? '' : '.'}
          </span>
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
        </div>

        {questionImage && (
          <div
            className={`${styles.questionImageWrapper} ${cardBorderColor ? styles.bordered : ''}`}
            style={borderStyle}
          >
            <Image
              src={questionImage}
              alt={`질문 ${number} 이미지`}
              width={300}
              height={200}
              className={styles.questionImage}
              priority
            />
          </div>
        )}

        <div
          className={`${styles.cardOptions} ${questionImage ? styles.hasImage : ''}`}
          role='list'
          style={{
            ...(columns > 1
              ? ({
                  display: 'grid',
                  gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                  gap: 20,
                  alignItems: 'stretch',
                  justifyItems: 'stretch',
                } as React.CSSProperties)
              : {}),
            fontFamily: optionFontFamily,
          }}
        >
          {options.map((opt, idx) => {
            const backgroundColor = optionColors?.[idx];

            const buttonStyle = backgroundColor
              ? {
                  ...style,
                  ...optionCustomBorderStyle,
                  backgroundColor,
                  color: '#fff',
                }
              : { ...style, ...optionCustomBorderStyle };

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
