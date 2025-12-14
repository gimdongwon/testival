import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.scss';

type HeaderVariant = 'home' | 'quiz';

type HeaderProps = Readonly<{
  variant?: HeaderVariant;
}>;

const Header = ({ variant = 'home' }: HeaderProps) => {
  if (variant === 'quiz') {
    return (
      <header
        className={`${styles.header} ${styles.headerQuiz}`}
        aria-label='테스트 상단 헤더'
      >
        <div className={styles.innerQuiz}>
          <Link href='/' aria-label='홈으로 이동' tabIndex={0}>
            <Image
              src='/images/quiz/common/Logo.svg'
              alt='Testival'
              width={120}
              height={24}
              priority
              className={styles.logo}
            />
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className={styles.header} aria-label='상단 헤더'>
      <div className={styles.divider} />
      <Link href='/' aria-label='홈으로 이동' tabIndex={0}>
        <Image
          src='/images/quiz/common/Logo.svg'
          alt='Testival'
          width={120}
          height={24}
          priority
          className={styles.logo}
        />
      </Link>
      <div className={styles.divider} />
    </header>
  );
};

export default Header;
