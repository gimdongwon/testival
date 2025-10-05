// app/quiz/[id]/result/result.client.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import styles from './Result.module.scss';
import ResetIcon from '@/components/icons/reset';
import ShareIcon from '@/components/icons/share';
import Image from 'next/image';
import Receipt from '@/components/chuseok_money/receipt';
import { useMemo } from 'react';
import { useQuizView } from '@/store/quizStore';
import { score } from '@/lib/scoring';
import type { TestDefinition, ResultDetail } from '@/domain/quiz.schema';

export default function ResultClient({ def }: { def: TestDefinition }) {
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
  const isChuseokPage = testId === 'chuseok';
  const btnVariantClass = isChuseokPage ? styles.btnDark : styles.btnLight;
  const containerVariantClass = isChuseokPage
    ? styles.resultLight
    : styles.resultDark;

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
    >
      {/* 배경 이미지: 폭 100%, 높이 자동 */}
      <Image
        className={styles.bgImage}
        alt='테스트 결과 이미지'
        src={
          isChuseokPage
            ? `/images/quiz/${testId}/result_${type}.png`
            : `/images/quiz/${testId}/result.png`
        }
        draggable={false}
        fill // ← width/height 대신 fill 사용(Next Image)
        sizes='(max-width: 430px) 100vw, 430px'
        priority
      />
      <div className={styles.content}>
        {!isChuseokPage && (
          <Receipt id={testId} items={items} total={total} detail={detail} />
        )}
      </div>
      {/* 하단 고정 버튼과 겹치지 않도록 여백 확보 */}
      <div className={styles.bottomSpacer} aria-hidden />

      {/* 공유 버튼 */}
      <div className={styles.shareBtnWrapper}>
        <button
          className={`${styles.shareBtn} ${btnVariantClass}`}
          onClick={handleClickShareBtn}
        >
          <span>테스트 공유하기</span>
          <ShareIcon
            color={isChuseokPage ? '#fff' : '#000'}
            width={13}
            height={13}
          />
        </button>
        <button
          className={`${styles.resetBtn} ${btnVariantClass}`}
          aria-label='테스트 다시하기'
          onClick={handleClickResetBtn}
        >
          <ResetIcon
            color={isChuseokPage ? '#fff' : '#000'}
            width={18}
            height={21}
          />
        </button>
      </div>
    </section>
  );
}
