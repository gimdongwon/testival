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
  // 페이지별 결과 UI 설정 매핑(확장 용이)
  const resultConfigById: Record<
    string,
    {
      theme: 'black' | 'white';
      imageMode: 'long' | 'bg';
      showReceipt: boolean;
      showBottomSpacer: boolean;
    }
  > = {
    chuseok: {
      theme: 'black',
      imageMode: 'long',
      showReceipt: false,
      showBottomSpacer: false,
    },
    chuseok_money: {
      theme: 'white',
      imageMode: 'bg',
      showReceipt: true,
      showBottomSpacer: true,
    },
    seat: {
      theme: 'white',
      imageMode: 'long',
      showReceipt: false,
      showBottomSpacer: true,
    },
  };
  const config = resultConfigById[testId] ?? {
    theme: 'black' as const,
    imageMode: 'long' as const,
    showReceipt: false,
    showBottomSpacer: true,
  };

  // 컨테이너/버튼/아이콘 색상은 테마에서 파생
  const containerVariantClass =
    config.theme === 'white' ? styles.resultLight : styles.resultDark;
  const btnVariantClass =
    config.theme === 'white' ? styles.btnLight : styles.btnDark;
  const iconColor = config.theme === 'white' ? '#000' : '#fff';

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
      {/* 배경/결과 이미지 렌더링 */}
      {config.imageMode === 'long' ? (
        // 추석 결과는 세로로 긴 이미지가 있어, 일반 흐름으로 배치하여 스크롤 가능하게 처리
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={styles.longImage}
          alt='테스트 결과 이미지'
          src={`/images/quiz/${testId}/result_${type}.png`}
          draggable={false}
        />
      ) : (
        <Image
          className={styles.bgImage}
          alt='테스트 결과 이미지'
          src={`/images/quiz/${testId}/result.png`}
          draggable={false}
          fill
          sizes='(max-width: 430px) 100vw, 430px'
          priority
        />
      )}
      <div className={styles.content}>
        {config.showReceipt && (
          <Receipt id={testId} items={items} total={total} detail={detail} />
        )}
      </div>
      {/* 하단 고정 버튼과 겹치지 않도록 여백 확보 */}
      {config.showBottomSpacer && (
        <div className={styles.bottomSpacer} aria-hidden />
      )}

      {/* 공유 버튼 */}
      <div className={styles.shareBtnWrapper}>
        <button
          className={`${styles.shareBtn} ${btnVariantClass}`}
          onClick={handleClickShareBtn}
        >
          <span>테스트 공유하기</span>
          <ShareIcon color={iconColor} width={13} height={13} />
        </button>
        <button
          className={`${styles.resetBtn} ${btnVariantClass}`}
          aria-label='테스트 다시하기'
          onClick={handleClickResetBtn}
        >
          <ResetIcon color={iconColor} width={18} height={21} />
        </button>
      </div>
    </section>
  );
}
