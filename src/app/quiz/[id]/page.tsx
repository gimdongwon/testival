import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './detail.module.scss';
import { notFound } from 'next/navigation';
import { getQuizRepository } from '@/infrastructure/quiz.repository';
import { getLandingUIConfig } from '@/domain/quiz.schema';
import ViewTracker from '@/components/quiz/ViewTracker';

const DetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const repo = getQuizRepository();
  const { id } = await params;
  const def = await repo.getById(id);
  if (!def) return notFound();
  
  // JSON UI 설정 기반 버튼 색상 - 타입 안전하게 가져오기
  const landingConfig = getLandingUIConfig(def);
  const variantClass =
    landingConfig.buttonTheme === 'white' ? styles.whiteBtn : styles.blackBtn;

  const mainImage = `/images/quiz/${id}/main.png`;

  return (
    <main aria-label='메인비주얼' className={styles.landingMain}>
      <ViewTracker quizId={id} />
      <div className={styles.imageWrapper}>
        <Image
          src={mainImage}
          alt={def.meta.title}
          fill
          priority
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
          sizes='(max-width: 430px) 100vw, 430px'
          className={styles.mainImage}
        />
      </div>
      <div className={styles.warpper}>
        <Link
          href={`/quiz/${id}/question`}
          aria-label='테스트 시작하기'
          role='button'
          className={`${styles.primaryLinkBtn} ${variantClass}`}
        >
          테스트 시작하기
        </Link>
      </div>
    </main>
  );
};

export default DetailPage;
