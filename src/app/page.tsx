import React from 'react';
import { getQuizRepository } from '@/infrastructure/quiz.repository';
import Header from '@/components/common/Header';
import MainImageSlide from '@/components/MainImageSlide/MainImageSlide';
import QuizListCard from '@/components/common/QuizListCard';
import styles from './page.module.scss';
import Footer from '@/components/common/Footer';
import Script from 'next/script';
import { getAvailableWebP } from '@/lib/resolveQuizImages';
import { resolveImage } from '@/lib/imageUtils';
import FaqList from './faq-item.client';

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

  // Structured Data (JSON-LD) - FAQ 정보
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Testival은 어떤 서비스인가요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Testival(테스티벌)은 다양한 심리테스트, 성격 테스트, 재미 테스트를 무료로 제공하는 온라인 테스트 플랫폼입니다. "Test"와 "Festival"의 합성어로, 테스트의 축제라는 의미를 담고 있어요.',
        },
      },
      {
        '@type': 'Question',
        name: '회원가입이 필요한가요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '아니요! Testival의 모든 테스트는 회원가입 없이 무료로 이용할 수 있습니다. 사이트에 접속하면 바로 원하는 테스트를 시작할 수 있어요.',
        },
      },
      {
        '@type': 'Question',
        name: '테스트 결과는 정확한가요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Testival의 테스트는 오락 및 재미를 위한 목적으로 제작되었습니다. 전문적인 심리 상담이나 진단을 대체하지 않으며, 가벼운 마음으로 즐겨주시면 좋겠습니다.',
        },
      },
      {
        '@type': 'Question',
        name: '내 응답 데이터는 저장되나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '테스트 진행 중 선택한 답변은 브라우저 메모리에만 임시 저장되며, 서버로 전송되거나 저장되지 않습니다. 페이지를 떠나면 즉시 삭제됩니다. 개인정보를 수집하지 않으니 안심하고 이용해 주세요.',
        },
      },
      {
        '@type': 'Question',
        name: '결과를 친구에게 공유할 수 있나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '네! 테스트 결과 페이지에서 "내 결과 공유하기" 버튼을 누르면 결과 페이지 URL이 복사됩니다. 카카오톡, 인스타그램 등 원하는 곳에 공유해 보세요.',
        },
      },
    ],
  };

  return (
    <>
      {/* Structured Data (JSON-LD) */}
      <Script
        id='website-jsonld'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Script
        id='organization-jsonld'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Script
        id='itemlist-jsonld'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <Script
        id='faq-jsonld'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className={styles.container}>
        <Header />

        <div className={styles.slideSection}>
          <MainImageSlide images={mainSlideImages} links={mainSlideLinks} />
        </div>

        <main className={styles.main}>
          <section className={styles.quizListSection}>
            <div className={styles.sectionHeader}>
              <h1 className={styles.sectionTitle}>추천 심리테스트 </h1>
            </div>
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
                      webpFiles,
                    )}
                    views={allViews[item.meta.id] ?? 0}
                  />
                );
              })}
            </div>
          </section>

          <section className={styles.faqSection}>
            <h2 className={styles.faqTitle}>자주 묻는 질문</h2>
            <FaqList
              items={[
                {
                  question: 'Testival은 어떤 서비스인가요?',
                  answer: 'Testival(테스티벌)은 다양한 심리테스트, 성격 테스트, 재미 테스트를 무료로 제공하는 온라인 테스트 플랫폼입니다. "Test"와 "Festival"의 합성어로, 테스트의 축제라는 의미를 담고 있어요.',
                },
                {
                  question: '회원가입이 필요한가요?',
                  answer: '아니요! Testival의 모든 테스트는 회원가입 없이 무료로 이용할 수 있습니다. 사이트에 접속하면 바로 원하는 테스트를 시작할 수 있어요.',
                },
                {
                  question: '테스트 결과는 정확한가요?',
                  answer: 'Testival의 테스트는 오락 및 재미를 위한 목적으로 제작되었습니다. 전문적인 심리 상담이나 진단을 대체하지 않으며, 가벼운 마음으로 즐겨주시면 좋겠습니다.',
                },
                {
                  question: '내 응답 데이터는 저장되나요?',
                  answer: '테스트 진행 중 선택한 답변은 브라우저 메모리에만 임시 저장되며, 서버로 전송되거나 저장되지 않습니다. 페이지를 떠나면 즉시 삭제됩니다. 개인정보를 수집하지 않으니 안심하고 이용해 주세요.',
                },
                {
                  question: '결과를 친구에게 공유할 수 있나요?',
                  answer: '네! 테스트 결과 페이지에서 "내 결과 공유하기" 버튼을 누르면 결과 페이지 URL이 복사됩니다. 카카오톡, 인스타그램 등 원하는 곳에 공유해 보세요.',
                },
              ]}
            />
          </section>

          {/* 크롤러/SEO 전용 플랫 FAQ 텍스트 영역 (aria-hidden이 없어 검색봇이 스킵 없이 파싱함) */}
          <section className={styles.srOnly}>
            <h2>자주 묻는 질문 (FAQ)</h2>
            <ul>
              <li>
                <h3>Q. Testival은 어떤 서비스인가요?</h3>
                <p>A. Testival(테스티벌)은 다양한 심리테스트, 성격 테스트, 재미 테스트를 무료로 제공하는 온라인 테스트 플랫폼입니다. &quot;Test&quot;와 &quot;Festival&quot;의 합성어로, 테스트의 축제라는 의미를 담고 있어요.</p>
              </li>
              <li>
                <h3>Q. 회원가입이 필요한가요?</h3>
                <p>A. 아니요! Testival의 모든 테스트는 회원가입 없이 무료로 이용할 수 있습니다. 사이트에 접속하면 바로 원하는 테스트를 시작할 수 있어요.</p>
              </li>
              <li>
                <h3>Q. 테스트 결과는 정확한가요?</h3>
                <p>A. Testival의 테스트는 오락 및 재미를 위한 목적으로 제작되었습니다. 전문적인 심리 상담이나 진단을 대체하지 않으며, 가벼운 마음으로 즐겨주시면 좋겠습니다.</p>
              </li>
              <li>
                <h3>Q. 내 응답 데이터는 저장되나요?</h3>
                <p>A. 테스트 진행 중 선택한 답변은 브라우저 메모리에만 임시 저장되며, 서버로 전송되거나 저장되지 않습니다. 페이지를 떠나면 즉시 삭제됩니다. 개인정보를 수집하지 않으니 안심하고 이용해 주세요.</p>
              </li>
              <li>
                <h3>Q. 결과를 친구에게 공유할 수 있나요?</h3>
                <p>A. 네! 테스트 결과 페이지에서 &quot;내 결과 공유하기&quot; 버튼을 누르면 결과 페이지 URL이 복사됩니다. 카카오톡, 인스타그램 등 원하는 곳에 공유해 보세요.</p>
              </li>
            </ul>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Home;
