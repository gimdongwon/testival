'use client';

import React, { Suspense, useEffect } from 'react';
import styles from './loading.module.scss';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

const LoadingContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const text = searchParams?.get('text') ?? '자리 측정중...';

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('result');
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

const LoadingPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className={styles.loadingPage}>
          <span className={styles.loadingText}>자리 측정중...</span>
          <Image src='/Loading.gif' alt='Loading' width={100} height={100} />
        </div>
      }
    >
      <LoadingContent />
    </Suspense>
  );
};

export default LoadingPage;
