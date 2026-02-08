// app/quiz/[id]/result/result.client.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import styles from './Result.module.scss';
import ResetIcon from '@/components/icons/reset';
import ShareIcon from '@/components/icons/share';
import Image from 'next/image';
import Receipt from '@/components/chuseok_money/receipt';
import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { useQuizView } from '@/store/quizStore';
import { score } from '@/lib/scoring';
import { resolveImage } from '@/lib/imageUtils';
import type { TestDefinition, ResultDetail } from '@/domain/quiz.schema';
import { getResultUIConfig } from '@/domain/quiz.schema';
import RecommendedQuizzes from '@/components/common/RecommendedQuizzes';
import type { QuizRecommendation } from '@/lib/recommendedQuizzes';

export default function ResultClient({
  def,
  recommendedQuizzes,
  webpFiles = [],
}: {
  def: TestDefinition;
  recommendedQuizzes: QuizRecommendation[];
  webpFiles?: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const testId = def.meta.id;
  const { selected } = useQuizView(testId);

  // chuseok 전용 이미지 분기용(type은 로딩 단계에서 쿼리로 전달됨)
  const type = searchParams.get('type');

  const handleClickShareBtn = () => {
    // 현재 URL을 복사하는 함수입니다.
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
    textArea.style.position = 'fixed'; // 화면 스크롤 영향 방지
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

  // 콘텐츠 JSON의 UI 설정 - 타입 안전하게 가져오기
  const resultUIConfig = getResultUIConfig(def);
  const config = resultUIConfig ?? {
    theme: 'black' as const,
    imageMode: 'long' as const,
    showReceipt: false,
  };

  // 처음부터 다시하기 버튼 배경색 스타일
  const resetBtnStyle: CSSProperties = config.resetBtnBackgroundColor
    ? { backgroundColor: config.resetBtnBackgroundColor }
    : {};

  // 컨테이너/버튼/아이콘 색상은 테마에서 파생
  const containerVariantClass =
    config.theme === 'white' ? styles.resultLight : styles.resultDark;
  const btnVariantClass =
    config.theme === 'white' ? styles.btnLight : styles.btnDark;
  const iconColor = config.theme === 'white' ? '#000' : '#fff';
  const resultBgStyle: CSSProperties & Record<'--result-bg-color', string> = {
    ['--result-bg-color']:
      config.backgroundColor ?? (config.theme === 'white' ? '#fff' : '#000'),
  };

  // chuseok_money 전용: 선택 항목 리스트와 합계, 결과 상세 계산
  const { items, total, detail } = useMemo<{
    items: Array<{ id: string; title: string; amount: number }>;
    total: number;
    detail?: ResultDetail;
  }>(() => {
    if (def.meta.mode !== 'amount-sum') {
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
  }, [def, selected]);

  return (
    <section
      className={`${styles.result} ${containerVariantClass}`}
      aria-label='테스트 결과'
      style={resultBgStyle}
    >
      {config.imageMode === 'long' ? (
        /* long 모드: 이미지 wrapper 안에서 버튼/추천 퀴즈를 하단 오버레이 */
        <div className={styles.longImageWrapper}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.longImage}
            alt={`${def.meta.title} 테스트 결과 이미지`}
            src={resolveImage(
              `/images/quiz/${testId}/result_${type}.png`,
              webpFiles
            )}
            draggable={false}
          />
          <div className={styles.longOverlay}>
            <div className={styles.shareBtnWrapper}>
              <button
                className={`${styles.shareBtn} ${btnVariantClass}`}
                onClick={handleClickShareBtn}
              >
                <span>내 결과 공유하기</span>
                <ShareIcon color={iconColor} width={12} height={16} />
              </button>
              <button
                className={`${styles.resetBtn} ${btnVariantClass}`}
                aria-label='처음부터 다시하기'
                onClick={handleClickResetBtn}
                style={resetBtnStyle}
              >
                처음부터 다시하기
                <ResetIcon color={iconColor} width={13} height={15} />
              </button>
            </div>
            {recommendedQuizzes && recommendedQuizzes.length > 0 && (
              <RecommendedQuizzes
                quizzes={recommendedQuizzes}
                theme={config.theme !== 'white' ? 'light' : 'dark'}
              />
            )}
          </div>
        </div>
      ) : (
        /* bg 모드: 배경 이미지 위에 normal flow */
        <>
          <Image
            className={styles.bgImage}
            alt={`${def.meta.title} 테스트 결과 배경 이미지`}
            src={`/images/quiz/${testId}/result.png?v=${Date.now()}`}
            draggable={false}
            width={430}
            height={1228}
            loading='lazy'
            quality={85}
            placeholder='blur'
            blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
          />
          <div className={styles.content}>
            {config.showReceipt && (
              <Receipt
                items={items}
                total={total}
                detail={detail}
              />
            )}
          </div>
          <div className={styles.shareBtnWrapper}>
            <button
              className={`${styles.shareBtn} ${btnVariantClass}`}
              onClick={handleClickShareBtn}
            >
              <span>내 결과 공유하기</span>
              <ShareIcon color={iconColor} width={12} height={16} />
            </button>
            <button
              className={`${styles.resetBtn} ${btnVariantClass}`}
              aria-label='처음부터 다시하기'
              onClick={handleClickResetBtn}
              style={resetBtnStyle}
            >
              처음부터 다시하기
              <ResetIcon color={iconColor} width={13} height={15} />
            </button>
          </div>
          {recommendedQuizzes && recommendedQuizzes.length > 0 && (
            <RecommendedQuizzes
              quizzes={recommendedQuizzes}
              theme={config.theme !== 'white' ? 'light' : 'dark'}
            />
          )}
        </>
      )}
    </section>
  );
}
