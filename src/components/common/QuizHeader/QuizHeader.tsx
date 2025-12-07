import React from 'react';
import Link from 'next/link';
import styles from './QuizHeader.module.scss';

const QuizHeader = () => {
  return (
    <header className={styles.header} aria-label='테스트 상단 헤더'>
      <div className={styles.inner}>
        <Link
          href='/'
          aria-label='홈으로 이동'
          className={styles.titleLink}
          tabIndex={0}
        >
          <span className={styles.logoText}>
            <span className={styles.logoAccent}>T</span>
            <span className={styles.logoRest}>ESTIVAL</span>
          </span>
        </Link>
      </div>
    </header>
  );
};

export default QuizHeader;

