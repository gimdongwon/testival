import React from 'react';
import { getQuizRepository } from '@/infrastructure/quiz.repository';
import Header from '@/components/common/Header';
import MainImageSlide from '@/components/MainImageSlide/MainImageSlide';
import QuizListCard from '@/components/common/QuizListCard';
import CoupangAd from '@/components/common/CoupangAd';
import styles from './page.module.scss';
import Script from 'next/script';
import { getAvailableWebP } from '@/lib/resolveQuizImages';
import { resolveImage } from '@/lib/imageUtils';

// 조회수를 실시간으로 반영하기 위해 revalidate 설정
export const revalidate = 10; // 10초마다 페이지 재생성

const Home = async () => {
  const repo = getQuizRepository();
  const list = await repo.list();

  // 모든 퀴즈의 조회수를 한 번에 가져오기
  const allViews = await repo.getAllViewCounts();

  // 슬라이드용 메인 이미지 배열 (각 퀴즈의 og-image 사용, webp 우선)
  const mainSlideImages = list.map((item) => {
    const webpFiles = getAvailableWebP(item.meta.id);
    return resolveImage(`/images/quiz/${item.meta.id}/og-image.png`, webpFiles);
  });

  // 슬라이드 클릭 시 이동할 링크 배열
  const mainSlideLinks = list.map((item) => `/quiz/${item.meta.id}`);

  // Structured Data (JSON-LD) - 웹사이트 정보
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Testival',
    description: '재미있는 심리테스트, 성격 테스트를 무료로 즐겨보세요',
    url: 'https://testival.kr',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://testival.kr/?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  // Structured Data (JSON-LD) - 조직 정보
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Testival',
    url: 'https://testival.kr',
    logo: 'https://testival.kr/images/quiz/common/favicon.png',
    description: '심리테스트 & 재미있는 테스트 플랫폼',
    sameAs: [
      'https://www.instagram.com/testival.official/',
      'https://www.youtube.com/@testival.official',
      'https://www.tiktok.com/@testival.official',
      'https://x.com/testival2025',
    ],
  };

  // Structured Data (JSON-LD) - ItemList (퀴즈 목록)
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: list.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Quiz',
        name: item.meta.title,
        url: `https://testival.kr/quiz/${item.meta.id}`,
        image: `https://testival.kr/images/quiz/${item.meta.id}/og-image.png`,
      },
    })),
  };

  return (
    <>
      {/* Structured Data (JSON-LD) */}
      <Script
        id="website-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Script
        id="organization-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Script
        id="itemlist-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <div className={styles.container}>
        <Header />

        <div className={styles.slideSection}>
          <MainImageSlide images={mainSlideImages} links={mainSlideLinks} />
        </div>

        {/* 쿠팡파트너스 광고 - 슬라이드와 추천 심테 사이 */}
        <CoupangAd />

        <main className={styles.main}>
          {/* SEO를 위한 h1 태그 (시각적으로 숨김) */}
          <h1 className={styles.visuallyHidden}>
            Testival - 재미있는 심리테스트 & 성격 테스트
          </h1>

          <section className={styles.quizListSection}>
            <h2 className={styles.sectionTitle}>🔥 추천 심리테스트 보기 🔥</h2>
            <div className={styles.quizList}>
              {list.map((item) => {
                const webpFiles = getAvailableWebP(item.meta.id);
                return (
                  <QuizListCard
                    key={item.meta.id}
                    id={item.meta.id}
                    title={item.meta.title}
                    thumbnail={resolveImage(
                      `/images/quiz/${item.meta.id}/og-image.png`,
                      webpFiles
                    )}
                    views={allViews[item.meta.id] ?? 0}
                  />
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Home;
