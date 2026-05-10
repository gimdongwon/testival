'use client';

import { useRouter } from 'next/navigation';
import styles from './loading.module.scss';
import { useEffect, useMemo } from 'react';
import type { CSSProperties } from 'react';
import { useQuizView } from '@/store/quizStore';
import { score } from '@/lib/scoring';
import type { TestDefinition } from '@/domain/quiz.schema';
import { getResultUIConfig, usesDedicatedNewResultPage } from '@/domain/quiz.schema';
import { resolveImage } from '@/lib/imageUtils';

/** JSON 등에서 온 소문자 webkit* 키는 React가 경고함 — Webkit* 로 통일 */
const normalizeLoadingTextStyle = (raw: CSSProperties): CSSProperties => {
  const r = raw as Record<string, unknown>;
  const out = { ...r };

  if (out.WebkitTextStrokeWidth === undefined && out.webkitTextStrokeWidth !== undefined) {
    out.WebkitTextStrokeWidth = out.webkitTextStrokeWidth;
    delete out.webkitTextStrokeWidth;
  }
  if (out.WebkitTextStrokeColor === undefined && out.webkitTextStrokeColor !== undefined) {
    out.WebkitTextStrokeColor = out.webkitTextStrokeColor;
    delete out.webkitTextStrokeColor;
  }

  return out as CSSProperties;
};

const LoadingContent = ({
  def,
  webpFiles,
}: {
  def: TestDefinition;
  webpFiles: string[];
}) => {
  const router = useRouter();
  const testId = def.meta.id;
  const { selected } = useQuizView(testId);

  const { top } = useMemo(() => score(def, selected), [def, selected]);
  const detail = def.resultDetails[top as keyof typeof def.resultDetails];
  const type = detail.type as string;

  // 2초 대기 동안 결과 이미지를 미리 받아둠 → 결과 페이지에서 캐시 히트
  useEffect(() => {
    if (!detail.image) return;
    const src = resolveImage(detail.image, webpFiles);
    const img = new window.Image();
    img.src = src;
  }, [detail.image, webpFiles]);

  useEffect(() => {
    const useNewResult = usesDedicatedNewResultPage(def);

    const timer = setTimeout(() => {
      const resultPath = useNewResult ? 'new-result' : 'result';
      router.push(`/quiz/${testId}/${resultPath}?type=${type}`);
    }, 2000);

    return () => clearTimeout(timer);
  }, [router, testId, type, def]);

  const resultConfig = getResultUIConfig(def);
  const bgColor =
    resultConfig?.backgroundColor ??
    (resultConfig?.theme === 'white' ? '#fff' : '#000');

  const bgImage = resultConfig?.resultBackgroundImage
    ? resultConfig.resultBackgroundImage
    : `/images/quiz/${testId}/content_background.png`;

  const loadingTextColor = resultConfig?.loadingTextColor ?? '#ffffff';
  const loadingTextStyle: CSSProperties = resultConfig?.loadingTextStyle
    ? normalizeLoadingTextStyle(resultConfig.loadingTextStyle as CSSProperties)
    : { color: loadingTextColor };

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
        style={loadingTextStyle}
        aria-live='polite'
      >
        로딩중
      </p>
    </div>
  );
};

export default LoadingContent;
