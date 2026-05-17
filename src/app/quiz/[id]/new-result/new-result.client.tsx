// app/quiz/[id]/new-result/new-result.client.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import styles from './NewResult.module.scss';
import { useMemo, useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { useQuizView } from '@/store/quizStore';
import { score } from '@/lib/scoring';
import type { TestDefinition, ResultDetail } from '@/domain/quiz.schema';
import { getResultUIConfig } from '@/domain/quiz.schema';
import RecommendedQuizzes from '@/components/common/RecommendedQuizzes';
import ResultShareActions from '@/components/common/ResultShareActions/ResultShareActions';
import type { QuizRecommendation } from '@/lib/recommendedQuizzes';
import { getResultComponent } from '@/components/results';

export default function NewResultClient({
  def,
  recommendedQuizzes,
}: {
  def: TestDefinition;
  recommendedQuizzes: QuizRecommendation[];
}) {
  const searchParams = useSearchParams();
  const testId = def.meta.id;
  const { selected } = useQuizView(testId);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const type = searchParams.get('type');

  const resultUIConfig = getResultUIConfig(def);
  const config = resultUIConfig ?? {
    theme: 'black' as const,
    imageMode: 'long' as const,
    showReceipt: false,
  };

  const shareBtnBg =
    config.shareBtnBackgroundColor ??
    (config.theme === 'black' ? '#000' : '#fff');
  const shareBtnColor =
    config.shareBtnColor ?? (config.theme === 'black' ? '#fff' : '#000');

  const isYoung40Shell = config.resultLayout === 'young40';
  const isSoloEscapeShell = config.resultLayout === 'soloescape';
  const skipDefaultBgImage = isYoung40Shell || isSoloEscapeShell;

  const bgImage = config.resultBackgroundImage
    ? `url("${config.resultBackgroundImage}")`
    : skipDefaultBgImage
      ? 'none'
      : `url("/images/quiz/${testId}/content_background.png")`;

  const shellBgColor = isYoung40Shell
    ? '#0f203b'
    : (config.backgroundColor ?? (config.theme === 'white' ? '#fff' : '#000'));

  const resultBgStyle: CSSProperties & Record<'--result-bg-color', string> = {
    ['--result-bg-color']: shellBgColor,
    backgroundImage: bgImage,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '100%',
  };

  // type 파라미터에서 resultDetail 조회
  const resultDetail = useMemo(() => {
    if (!type) return undefined;
    return Object.values(def.resultDetails).find((d) => d.type === type);
  }, [def.resultDetails, type]);

  // amount-sum 모드 데이터 처리
  const { detail } = useMemo<{
    detail?: ResultDetail;
  }>(() => {
    if (def.meta.mode !== 'amount-sum' || !mounted) {
      return { detail: undefined };
    }
    const scored = score(def, selected);
    const topKey = scored.top as keyof typeof def.resultDetails;
    const detailInfo = def.resultDetails[topKey];
    return { detail: detailInfo };
  }, [def, selected, mounted]);

  const displayDetail = resultDetail ?? detail;

  // 점수 라벨 생성 (0-100점 등)
  const scoreLabel = useMemo(() => {
    if (config.hideResultScore) return undefined;
    if (def.meta.mode !== 'amount-sum' || !type) return undefined;
    const brackets = def.scoring?.amountSumBrackets;
    if (!brackets) return undefined;
    const bracket = brackets.find((b) => b.key === type);
    if (!bracket) return undefined;
    const { min, max } = bracket;
    if (min === max) return `${min ?? 0}점`;
    return `${min ?? 0}-${max ?? 0}점`;
  }, [def, type, config.hideResultScore]);

  if (!mounted) return null;

  return (
    <section
      className={styles.result}
      aria-label='테스트 결과'
      style={resultBgStyle}
    >
      <div className={styles.resultBody}>
        {displayDetail && (
          (() => {
            const ResultComponent = getResultComponent(config.resultLayout ?? undefined);
            return (
              <ResultComponent
                result={displayDetail}
                config={config}
                scoreLabel={scoreLabel}
              />
            );
          })()
        )}
      </div>

      <ResultShareActions
        testId={testId}
        shareBtnBg={shareBtnBg}
        shareBtnColor={shareBtnColor}
      />

      {recommendedQuizzes && recommendedQuizzes.length > 0 && (
        <RecommendedQuizzes quizzes={recommendedQuizzes} theme={config.theme} />
      )}
    </section>
  );
}
