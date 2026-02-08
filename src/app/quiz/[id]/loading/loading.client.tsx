'use client';

import { useRouter } from 'next/navigation';
import styles from './loading.module.scss';
import { useEffect } from 'react';
import { useQuizView } from '@/store/quizStore';
import { score } from '@/lib/scoring';
import { resolveImage } from '@/lib/imageUtils';
import { TestDefinition } from '@/domain/quiz.schema';
import { getResultUIConfig } from '@/domain/quiz.schema';
import { useMemo } from 'react';

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
  // 채점
  const { top } = useMemo(() => score(def, selected), [def, selected]);
  const type = def.resultDetails[top as keyof typeof def.resultDetails]
    .type as string;

  // UI 설정에서 imageMode 확인 - 타입 안전하게 가져오기
  const resultConfig = getResultUIConfig(def);
  const imageMode = resultConfig?.imageMode ?? 'long';

  useEffect(() => {
    // 결과 페이지로 이동하는 타이머
    const timer = setTimeout(() => {
      router.push(`/quiz/${testId}/result?type=${type}`);
    }, 2000);

    // 결과 이미지 미리 로딩 (브라우저 레벨에서 우선순위 높게 다운로드)
    const preloadResultImage = () => {
      const pngPath =
        imageMode === 'long'
          ? `/images/quiz/${testId}/result_${type}.png`
          : `/images/quiz/${testId}/result.png`;
      const resolvedPath = resolveImage(pngPath, webpFiles);

      // <link rel="preload"> 태그로 이미지 우선 로딩
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = resolvedPath;
      link.type = resolvedPath.endsWith('.webp') ? 'image/webp' : 'image/png';
      document.head.appendChild(link);

      // 추가로 Image 객체로도 미리 로딩
      const img = new Image();
      img.src = resolvedPath;

      // 로딩 성공 로그 (개발 시 확인용)
      img.onload = () => {
        console.log(`✅ 결과 이미지 미리 로딩 완료: ${resolvedPath}`);
      };

      // cleanup 함수에서 link 태그 제거
      return () => {
        document.head.removeChild(link);
      };
    };

    const cleanupPreload = preloadResultImage();

    return () => {
      clearTimeout(timer);
      cleanupPreload?.();
    };
  }, [router, testId, top, type, imageMode, webpFiles]);

  const loadingBgPath = resolveImage(
    `/images/quiz/${testId}/loading.png`,
    webpFiles
  );

  return (
    <div
      className={styles.loadingPage}
      style={{
        backgroundImage: `url("${loadingBgPath}")`,
      }}
    ></div>
  );
};

export default LoadingContent;
