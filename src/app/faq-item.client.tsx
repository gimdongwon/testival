'use client';

import { useState, useCallback } from 'react';
import styles from './page.module.scss';

type FaqEntry = Readonly<{
  question: string;
  answer: string;
}>;

type FaqListProps = Readonly<{
  items: FaqEntry[];
}>;

const FaqList = ({ items }: FaqListProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <div className={styles.faqList}>
      {items.map((item, index) => (
        <div
          key={item.question}
          className={`${styles.faqItem} ${openIndex === index ? styles.faqItemOpen : ''}`}
          onClick={() => handleToggle(index)}
          role='button'
          tabIndex={0}
          aria-expanded={openIndex === index}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggle(index);
            }
          }}
        >
          <div className={styles.faqQuestion}>{item.question}</div>
          {/* 답변은 항상 DOM에 렌더(크롤러 노출). 닫힘 상태는 CSS로 접고 aria-hidden 처리 */}
          <p
            className={`${styles.faqAnswer} ${
              openIndex === index ? styles.faqAnswerOpen : ''
            }`}
            aria-hidden={openIndex !== index}
          >
            {item.answer}
          </p>
        </div>
      ))}
    </div>
  );
};

export default FaqList;
