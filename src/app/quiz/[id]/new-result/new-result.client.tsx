// app/quiz/[id]/new-result/new-result.client.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import styles from './NewResult.module.scss';
import ResetIcon from '@/components/icons/reset';
import ShareIcon from '@/components/icons/share';
import { useMemo, useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { useQuizView } from '@/store/quizStore';
import { score } from '@/lib/scoring';
import type { TestDefinition, ResultDetail } from '@/domain/quiz.schema';
import { getResultUIConfig } from '@/domain/quiz.schema';
import RecommendedQuizzes from '@/components/common/RecommendedQuizzes';
import CoupangAd from '@/components/common/CoupangAd';
import type { QuizRecommendation } from '@/lib/recommendedQuizzes';
import { getResultComponent } from '@/components/results';

export default function NewResultClient({
  def,
  recommendedQuizzes,
}: {
  def: TestDefinition;
  recommendedQuizzes: QuizRecommendation[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const testId = def.meta.id;
  const { selected } = useQuizView(testId);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const type = searchParams.get('type');

  const handleClickShareBtn = () => {
    if (typeof window === 'undefined' || !window?.location?.href) {
      alert('URL을 복사할 수 없습니다.');
      return;
    }

    const currentUrl = window.location.href;

    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === 'function'
    ) {
      navigator.clipboard
        .writeText(currentUrl)
        .then(() => {
          alert('URL이 복사되었습니다!');
        })
        .catch(() => {
          alert('URL 복사에 실패했습니다. 다시 시도해주세요.');
        });
      return;
    }

    // fallback: execCommand
    const textArea = document.createElement('textarea');
    textArea.value = currentUrl;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        alert('URL이 복사되었습니다!');
      } else {
        alert('URL 복사에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err) {
      console.error(err);
      alert('URL 복사에 실패했습니다. 다시 시도해주세요.');
    }

    document.body.removeChild(textArea);
  };

  const handleClickResetBtn = () => {
    router.push(`/quiz/${testId}`);
  };

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

  const bgImage = config.resultBackgroundImage
    ? `url("${config.resultBackgroundImage}")`
    : `url("/images/quiz/${testId}/content_background.png")`;

  const resultBgStyle: CSSProperties & Record<'--result-bg-color', string> = {
    ['--result-bg-color']:
      config.backgroundColor ?? (config.theme === 'white' ? '#fff' : '#000'),
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

      <div className={styles.shareBtnWrapper}>
        <button
          className={styles.shareBtn}
          onClick={handleClickShareBtn}
          style={{ backgroundColor: shareBtnBg, color: shareBtnColor }}
        >
          <span>내 결과 공유하기</span>
          <ShareIcon color={shareBtnColor} width={12} height={16} />
        </button>
        <button
          className={styles.resetBtn}
          aria-label='처음부터 다시하기'
          onClick={handleClickResetBtn}
          style={{ backgroundColor: '#ED1B7A', color: '#fff' }}
        >
          처음부터 다시하기
          <ResetIcon color='#fff' width={13} height={15} />
        </button>
      </div>

      {recommendedQuizzes && recommendedQuizzes.length > 0 && (
        <RecommendedQuizzes quizzes={recommendedQuizzes} theme={config.theme} />
      )}

      <CoupangAd />
    </section>
  );
}
