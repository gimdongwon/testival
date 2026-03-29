'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './detail.module.scss';

type StickyStartButtonProps = Readonly<{
  href: string;
  variantClass: string;
}>;

const QUIZ_INFO_ID = 'quiz-info';

const StickyStartButton = ({ href, variantClass }: StickyStartButtonProps) => {
  const [isOverInfo, setIsOverInfo] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const target = document.getElementById(QUIZ_INFO_ID);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsOverInfo(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '-300px 0px 0px 0px' },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <Link
      ref={linkRef}
      href={href}
      aria-label='테스트 시작하기'
      role='button'
      className={`${styles.primaryLinkBtn} ${isOverInfo ? styles.infoBtn : variantClass}`}
    >
      테스트 시작하기
    </Link>
  );
};

export { QUIZ_INFO_ID };
export default StickyStartButton;
