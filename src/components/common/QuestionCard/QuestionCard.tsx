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
  optionBorderColors?: string[];
  optionButtonStyle?: React.CSSProperties;
  optionsGap?: string;
  optionsMarginTop?: string;
};

/**
 * 제목 스타일을 래퍼(h2)와 줄 단위(span) 두 곳으로 분배한다.
 *
 * 스트로크/그림자/줄간격은 `<span>` 줄에 붙여야 줄별로 정확히 적용되고
 * 브라우저(Webkit/Blink) 간 결과도 일관된다. 폰트/크기/색 등 상속 가능한
 * 속성은 h2에 두어 자식 span이 자연스럽게 상속하도록 한다.
 */
const splitQuestionTitleStyles = (
  raw: CSSProperties | undefined
): {
  heading: CSSProperties | undefined;
  lineFx: CSSProperties | undefined;
} => {
  if (!raw) return { heading: undefined, lineFx: undefined };
  const r = { ...(raw as Record<string, unknown>) };
  const lineFx: CSSProperties = {};

  if (r.textShadow !== undefined) lineFx.textShadow = r.textShadow as string;
  if (r.WebkitTextStroke !== undefined) lineFx.WebkitTextStroke = r.WebkitTextStroke as string;

  const strokeW = r.WebkitTextStrokeWidth ?? r.webkitTextStrokeWidth;
  const strokeC = r.WebkitTextStrokeColor ?? r.webkitTextStrokeColor;
  if (strokeW !== undefined) lineFx.WebkitTextStrokeWidth = strokeW as string | number;
  if (strokeC !== undefined) lineFx.WebkitTextStrokeColor = strokeC as string;

  const lineHeightVal = r.lineHeight;
  if (lineHeightVal !== undefined) lineFx.lineHeight = lineHeightVal as string | number;

  if (r.paintOrder !== undefined) lineFx.paintOrder = r.paintOrder as CSSProperties['paintOrder'];

  delete r.lineHeight;
  delete r.textShadow;
  delete r.WebkitTextStroke;
  delete r.webkitTextStroke;
  delete r.WebkitTextStrokeWidth;
  delete r.webkitTextStrokeWidth;
  delete r.WebkitTextStrokeColor;
  delete r.webkitTextStrokeColor;
  delete r.paintOrder;

  const heading = Object.keys(r).length > 0 ? (r as CSSProperties) : undefined;
  const lineFxOut = Object.keys(lineFx).length > 0 ? lineFx : undefined;
  return { heading, lineFx: lineFxOut };
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
  optionBorderColors,
  optionButtonStyle,
  optionsGap,
  optionsMarginTop,
}) => {
  const borderStyle = cardBorderColor
    ? { border: `1.5px solid ${cardBorderColor}` }
    : undefined;

  const optionBorderResolved = optionBorderColorProp ?? cardBorderColor;
  const baseOptionBorderStyle: CSSProperties | undefined = optionBorderResolved
    ? {
        border: `2px solid ${optionBorderResolved}`,
      }
    : undefined;

  const titleLines = title.split('\n');
  const { heading: titleHeadingStyle, lineFx: titleLineFxStyle } = splitQuestionTitleStyles(
    questionTitleStyle as CSSProperties | undefined
  );
  const titleHeadingFallback: CSSProperties | undefined = !questionTitleStyle
    ? {
        color: questionTextColor,
        fontFamily: questionFontFamily,
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
            className={`${styles.cardTitle} ${styles.cardTitleStack}`}
            style={{
              ...titleHeadingFallback,
              ...titleHeadingStyle,
              lineHeight: 0,
            }}
          >
            {titleLines.map((line, i) => (
              <span key={i} className={styles.cardTitleLine} style={titleLineFxStyle}>
                {line}
              </span>
            ))}
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
                  gap: optionsGap ?? 20,
                  alignItems: 'stretch',
                  justifyItems: 'stretch',
                } as React.CSSProperties)
              : {}),
            ...(columns <= 1 && optionsGap ? { gap: optionsGap } : {}),
            ...(optionsMarginTop ? { marginTop: optionsMarginTop } : {}),
            fontFamily: optionFontFamily,
          }}
        >
          {options.map((opt, idx) => {
            const backgroundColor = optionColors?.[idx];
            const borderForOption = optionBorderColors?.[idx];
            const optionBorderThis: CSSProperties | undefined = borderForOption
              ? { border: `2px solid ${borderForOption}` }
              : baseOptionBorderStyle;

            const textColorFromStyle = optionTextStyle?.color as string | undefined;
            const buttonStyle = backgroundColor
              ? {
                  ...style,
                  ...optionBorderThis,
                  ...optionButtonStyle,
                  backgroundColor,
                  color: textColorFromStyle ?? '#fff',
                }
              : { ...style, ...optionBorderThis, ...optionButtonStyle };

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
