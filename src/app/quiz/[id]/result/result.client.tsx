// app/quiz/[id]/result/result.client.tsx
'use client';

import Image from 'next/image';
import { useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { TestDefinition } from '@/domain/quiz.schema';
import { score } from '@/lib/scoring';
import styles from './Result.module.scss';
import { useQuizView } from '@/store/quizStore';

function splitParagraphs(text?: string) {
  if (!text) return [];
  // 두 줄 개행을 단락 구분으로 사용
  return text
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function ResultClient({ def }: { def: TestDefinition }) {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const testId = def.meta.id;
  const { selected } = useQuizView(testId);

  // 가드: 선택 없이 결과로 오면 인트로로 보냄
  useEffect(() => {
    const hasAny = def.questions.some((q) => selected[q.id]);
    if (!hasAny) router.replace(`/quiz/${id}`);
  }, [def, id, router, selected]);

  // 채점
  const { top } = useMemo(() => score(def, selected), [def, selected]);

  // 데이터 매핑
  const shortLine = def.messages?.[top]; // 인용부(짧은 문장)
  const detail = def.resultDetails?.[top];
  const title = detail?.title ?? top;
  const name = detail?.name ?? top;
  const descParas = splitParagraphs(detail?.description);
  const img = detail?.image;
  const keywords = detail?.keywords ?? [];

  // (선택) 이모지/아이콘은 타입별로 매핑하고 싶으면 여기서 결정하세요.
  const leftEmoji = '✨';
  const rightEmoji = '✨';

  const handleShareClick = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `${def.meta.title} – ${title}\n${
      shortLine ? `“${shortLine}”\n` : ''
    }${keywords.map((k) => `#${k}`).join(' ')}`;
    const textToCopy = `${shareText}\n${url}`;

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(textToCopy).finally(() => {
        alert('링크가 복사되었습니다.');
      });
      router.push(`/quiz/${def.meta.id}`);
      return;
    }

    try {
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    } catch {
      // ignore
    } finally {
      alert('링크가 복사되었습니다.');
    }
  };

  return (
    <section className={styles.result} aria-label='테스트 결과'>
      {/* 배경 레이어 */}
      <div className={styles.bg} aria-hidden />

      {/* 상단 타이틀 */}
      <header className={styles.header}>
        <p className={styles.kicker}>당신의 테스트 결과는..</p>
        <h1 className={styles.title}>
          <span className={styles.emoji} aria-hidden>
            {leftEmoji}
          </span>
          <strong>{name} 유형</strong>
          <span className={styles.emoji} aria-hidden>
            {rightEmoji}
          </span>
        </h1>
      </header>

      {/* 결과 일러스트 카드 */}
      {img && (
        <figure className={styles.figure} aria-label='결과 이미지'>
          <div className={styles.figureInner}>
            <Image
              src={img} // JSON의 resultDetails.image
              alt=''
              fill
              sizes='(max-width: 480px) 80vw, 425px'
              priority
            />
          </div>
        </figure>
      )}

      {/* 한 문장 결과(인용) */}
      {shortLine && (
        <blockquote className={styles.quote}>
          <p>“{shortLine}”</p>
        </blockquote>
      )}

      {/* 설명 카드 */}
      <section className={styles.card} aria-labelledby='desc-heading'>
        <h2 id='desc-heading' className={styles.cardTitle}>
          {title}
        </h2>
        <div className={styles.cardBody}>
          {descParas.length > 0 ? (
            descParas.map((p, i) => <p key={i}>{p}</p>)
          ) : (
            <p>상세 설명이 준비 중입니다.</p>
          )}
        </div>

        {/* 공유 문구: 키워드 해시태그 변환 */}
        {keywords.length > 0 && (
          <>
            <h2 id='share-heading' className={styles.cardTitle}>
              당신의 연휴 키워드
            </h2>
            <div className={styles.cardBody}>
              {/* 기본 문구 */}
              <p>
                {def.meta.title} – {title}
              </p>
              {/* 해시태그 */}
              <p>{keywords.map((k) => `#${k}`).join(' ')}</p>
            </div>
          </>
        )}
      </section>

      {/* 공유 버튼 */}
      <button className={styles.shareBtn} onClick={handleShareClick}>
        테스트 공유하기
      </button>
    </section>
  );
}
