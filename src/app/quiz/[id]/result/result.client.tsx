// app/quiz/[id]/result/result.client.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import styles from './Result.module.scss';
import ResetIcon from '@/components/icons/reset';
import ShareIcon from '@/components/icons/share';
import Receipt from '@/components/chuseok_money/receipt';
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

export default function ResultClient({
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

  // Hydration 안전: 마운트 전까지 store 의존 렌더링을 지연
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

    // fallback: execCommand (구형 브라우저 지원)
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

  // type 파라미터에서 resultDetail 조회 (weighted, type-count 모드)
  const resultDetail = useMemo(() => {
    if (!type) return undefined;
    return Object.values(def.resultDetails).find((d) => d.type === type);
  }, [def.resultDetails, type]);

  // amount-sum 모드: 선택 항목 리스트, 합계, 결과 상세
  const { items, total, detail } = useMemo<{
    items: Array<{ id: string; title: string; amount: number }>;
    total: number;
    detail?: ResultDetail;
  }>(() => {
    if (def.meta.mode !== 'amount-sum' || !mounted) {
      return { items: [], total: 0, detail: undefined };
    }
    const built = def.questions
      .map((q) => {
        const choiceId = selected[q.id];
        const choice = q.choices.find((c) => c.id === choiceId);
        if (!choice) return null;
        const amount = typeof choice.amount === 'number' ? choice.amount : 0;
        return { id: choice.id, title: choice.label, amount };
      })
      .filter(Boolean) as Array<{ id: string; title: string; amount: number }>;
    const totalAmount = built.reduce((sum, it) => sum + it.amount, 0);
    const scored = score(def, selected);
    const topKey = scored.top as keyof typeof def.resultDetails;
    const detailInfo = def.resultDetails[topKey];
    return { items: built, total: totalAmount, detail: detailInfo };
  }, [def, selected, mounted]);

  const displayDetail = resultDetail ?? detail;
  const showReceipt = config.showReceipt && config.imageMode === 'bg';

  // amount-sum 모드: URL type에 해당하는 bracket의 min-max로 점수 라벨 생성
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

  return (
    <section
      className={styles.result}
      aria-label='테스트 결과'
      style={resultBgStyle}
    >
      {showReceipt ? (
        <Receipt items={items} total={total} detail={detail} />
      ) : (
        displayDetail && config && (() => {
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
