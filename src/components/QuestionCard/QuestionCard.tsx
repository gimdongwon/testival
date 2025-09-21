'use client';

import React from 'react';
import Link from 'next/link';

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
  backgroundImage,
}) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    optionId: string
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect?.(optionId);
    }
  };

  return (
    <div className='center-grid' ref={containerRef}>
      <div className='card'>
        {backgroundImage ? (
          <img src={backgroundImage} alt='' aria-hidden className='card-bg' />
        ) : null}
        <div className='card-header' aria-label='질문지 상단'>
          <span aria-hidden>🚗</span>
          <span className='card-qnum'>Q{number}.</span>
        </div>

        <h2 className='card-title'>{title}</h2>

        <div className='card-options' role='list'>
          {options.map((opt) => (
            <Link href='/result' className='full-width' key={opt.id}>
              <button
                onClick={() => onSelect?.(opt.id)}
                onKeyDown={(e) => handleKeyDown(e, opt.id)}
                aria-label={`${opt.label} ${opt.text}`}
                className='option-btn'
              >
                <span className='option-label-strong'>{opt.label}</span>
                <span className='option-text'>{opt.text}</span>
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
