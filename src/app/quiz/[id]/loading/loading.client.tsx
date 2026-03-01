'use client';

import { useRouter } from 'next/navigation';
import styles from './loading.module.scss';
import { useEffect, useMemo } from 'react';
import { useQuizView } from '@/store/quizStore';
import { score } from '@/lib/scoring';
import type { TestDefinition } from '@/domain/quiz.schema';
import { getResultUIConfig } from '@/domain/quiz.schema';

const LoadingContent = ({ def }: { def: TestDefinition }) => {
  const router = useRouter();
  const testId = def.meta.id;
  const { selected } = useQuizView(testId);

  const { top } = useMemo(() => score(def, selected), [def, selected]);
  const type = def.resultDetails[top as keyof typeof def.resultDetails]
    .type as string;

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`/quiz/${testId}/result?type=${type}`);
    }, 2000);

    return () => clearTimeout(timer);
  }, [router, testId, type]);

  const resultConfig = getResultUIConfig(def);
  const bgColor =
    resultConfig?.backgroundColor ??
    (resultConfig?.theme === 'white' ? '#fff' : '#000');

  const bgImage = `/images/quiz/${testId}/content_background.png`;
  const loadingTextColor = resultConfig?.loadingTextColor ?? '#ffffff';

  return (
    <div
      className={styles.loadingPage}
      style={{
        backgroundColor: bgColor,
        backgroundImage: `url("${bgImage}")`,
      }}
    >
      <p
        className={styles.loadingText}
        style={{ color: loadingTextColor }}
        aria-live='polite'
      >
        로딩중...
      </p>
    </div>
  );
};

export default LoadingContent;
