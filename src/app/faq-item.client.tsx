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
          {openIndex === index && (
            <p className={styles.faqAnswer}>{item.answer}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default FaqList;
