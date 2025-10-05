'use client';

import { useRouter } from 'next/navigation';
import styles from './loading.module.scss';
import { useEffect } from 'react';
import { useQuizView } from '@/store/quizStore';
import { score } from '@/lib/scoring';
import { TestDefinition } from '@/domain/quiz.schema';
import { useMemo } from 'react';

const LoadingContent = ({ def }: { def: TestDefinition }) => {
  const router = useRouter();
  const testId = def.meta.id;
  const { selected } = useQuizView(testId);
  // 채점
  const { top } = useMemo(() => score(def, selected), [def, selected]);
  const type = def.resultDetails[top as keyof typeof def.resultDetails]
    .type as string;

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`/quiz/${testId}/result?type=${type}`);
    }, 3000);
    return () => clearTimeout(timer);
  }, [router, testId, top, type]);

  return (
    <div
      className={styles.loadingPage}
      style={{
        backgroundImage: `url(/images/quiz/${testId}/loading.png)`,
      }}
    ></div>
  );
};

export default LoadingContent;
