// app/quiz/[id]/result/result.client.tsx
'use client';
/* eslint-disable @next/next/no-img-element */

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import styles from './Result.module.scss';

export default function ResultClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const testId = id;
  const searchParams = useSearchParams();
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
  return (
    <section className={styles.result} aria-label='테스트 결과'>
      {/* 배경 이미지: 폭 100%, 높이 자동 */}
      <img
        className={styles.bgImage}
        alt='테스트 결과 이미지'
        src={`/images/quiz/${id}/result_${type}.png`}
        draggable={false}
      />

      {/* 공유 버튼 */}
      <div className={styles.shareBtnWrapper}>
        <button className={styles.shareBtn} onClick={handleClickShareBtn}>
          <img src='/images/quiz/chuseok/share_btn.png' alt='테스트 공유하기' />
        </button>
        <button
          className={styles.resetBtn}
          aria-label='테스트 초기화'
          onClick={handleClickResetBtn}
        >
          <img src='/images/quiz/chuseok/reset_btn.png' alt='' aria-hidden />
        </button>
      </div>
    </section>
  );
}
