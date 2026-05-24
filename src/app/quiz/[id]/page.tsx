import React from 'react';
import Image from 'next/image';
import Script from 'next/script';
import styles from './detail.module.scss';
import { notFound } from 'next/navigation';
import { getQuizRepository } from '@/infrastructure/quiz.repository';
import { getLandingUIConfig } from '@/domain/quiz.schema';
import { getAvailableWebP } from '@/lib/resolveQuizImages';
import { resolveImage } from '@/lib/imageUtils';
import ViewTracker from '@/components/quiz/ViewTracker';
import Footer from '@/components/common/Footer';
import StickyStartButton, { QUIZ_INFO_ID } from './sticky-start-button.client';

const MODE_LABELS: Record<string, string> = {
  weighted: '성향 분석형',
  'amount-sum': '점수 합산형',
  'type-count': '유형 매칭형',
};

const DetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const repo = getQuizRepository();
  const { id } = await params;
  const def = await repo.getById(id);
  if (!def) return notFound();

  const landingConfig = getLandingUIConfig(def);
  const variantClass =
    landingConfig.buttonTheme === 'white' ? styles.whiteBtn : styles.blackBtn;

  const webpFiles = getAvailableWebP(id);
  const mainImage = resolveImage(`/images/quiz/${id}/main.png`, webpFiles);

  const questionCount = def.questions.length;
  const resultCount = def.meta.resultTypes.length;
  const estimatedMinutes = Math.max(1, Math.ceil(questionCount * 0.5));
  const modeLabel = MODE_LABELS[def.meta.mode] ?? '심리테스트';

  const stripTags = (s: string): string =>
    s.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim();
  const resultSummaries = Object.values(def.resultDetails)
    .slice(0, 6)
    .map((r) => ({
      name: stripTags(r.name),
      title: stripTags(r.title),
      snippet: stripTags(r.description).slice(0, 180),
    }));

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
    numberOfQuestions: questionCount,
  };

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
          <StickyStartButton
            href={`/quiz/${id}/question`}
            variantClass={variantClass}
          />
        </div>
      </main>

      <section id={QUIZ_INFO_ID} className={styles.quizInfo} aria-label='테스트 정보'>
        <div className={styles.quizInfoInner}>
          <h1 className={styles.quizTitle}>{def.meta.title}</h1>
          {def.meta.description && (
            <p className={styles.quizDescription}>{def.meta.description}</p>
          )}

          <div className={styles.quizMeta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>문항 수</span>
              <span className={styles.metaValue}>{questionCount}문항</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>소요 시간</span>
              <span className={styles.metaValue}>약 {estimatedMinutes}분</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>결과 유형</span>
              <span className={styles.metaValue}>{resultCount}가지</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>테스트 방식</span>
              <span className={styles.metaValue}>{modeLabel}</span>
            </div>
          </div>

          {resultSummaries.length > 0 && (
            <div className={styles.resultPreview}>
              <h2 className={styles.resultPreviewTitle}>
                이런 결과가 나올 수 있어요
              </h2>
              <ul className={styles.resultList}>
                {resultSummaries.map((r) => (
                  <li key={r.name} className={styles.resultItem}>
                    <h3 className={styles.resultItemName}>{r.name}</h3>
                    {r.title && (
                      <p className={styles.resultItemTitle}>{r.title}</p>
                    )}
                    {r.snippet && (
                      <p className={styles.resultItemSnippet}>{r.snippet}…</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className={styles.quizNotice}>
            <h2 className={styles.noticeTitle}>안내사항</h2>
            <ul className={styles.noticeList}>
              <li>회원가입 없이 바로 시작할 수 있어요.</li>
              <li>응답은 저장되지 않으며, 결과만 확인할 수 있어요.</li>
              <li>테스트 결과는 재미를 위한 것이며, 전문적인 심리 분석이 아닙니다.</li>
              <li>결과 페이지에서 친구에게 공유할 수 있어요.</li>
            </ul>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
};

export default DetailPage;
