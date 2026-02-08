import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import styles from './detail.module.scss';
import { notFound } from 'next/navigation';
import { getQuizRepository } from '@/infrastructure/quiz.repository';
import { getLandingUIConfig } from '@/domain/quiz.schema';
import { getAvailableWebP } from '@/lib/resolveQuizImages';
import { resolveImage } from '@/lib/imageUtils';
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

  const webpFiles = getAvailableWebP(id);
  const mainImage = resolveImage(`/images/quiz/${id}/main.png`, webpFiles);

  // Structured Data (JSON-LD) - 퀴즈 정보
  const quizJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: def.meta.title,
    description: def.meta.description || `${def.meta.title} - Testival`,
    url: `https://testival.kr/quiz/${id}`,
    image: `https://testival.kr/images/quiz/${id}/og-image.png`,
    author: {
      '@type': 'Organization',
      name: 'Testival',
      url: 'https://testival.kr',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
    inLanguage: 'ko-KR',
    educationalUse: 'self-assessment',
    typicalAgeRange: '13-',
  };

  // Structured Data (JSON-LD) - Breadcrumb
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '홈',
        item: 'https://testival.kr',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: def.meta.title,
        item: `https://testival.kr/quiz/${id}`,
      },
    ],
  };

  return (
    <>
      {/* Structured Data (JSON-LD) */}
      <Script
        id="quiz-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(quizJsonLd) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main aria-label='메인비주얼' className={styles.landingMain}>
        <ViewTracker quizId={id} />
        <div className={styles.imageWrapper}>
          <Image
            src={mainImage}
            alt={`${def.meta.title} - 심리테스트 메인 이미지`}
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
    </>
  );
};

export default DetailPage;
