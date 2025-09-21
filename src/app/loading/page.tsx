'use client';

import React, { useEffect } from 'react';
import styles from './loading.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const LoadingPage = ({ text = '자리 측정중...' }: { text?: string }) => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/result');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className={styles.loadingPage}>
      <span className={styles.loadingText}>{text}</span>
      <Image src='/Loading.gif' alt='Loading' width={100} height={100} />
    </div>
  );
};

export default LoadingPage;
