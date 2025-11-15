import React from 'react';
import { getQuizRepository } from '@/infrastructure/quiz.repository';
import Header from '@/components/common/Header';
import MainImageSlide from '@/components/MainImageSlide/MainImageSlide';
import QuizListCard from '@/components/common/QuizListCard';
import styles from './page.module.scss';

// 조회수를 실시간으로 반영하기 위해 revalidate 설정
export const revalidate = 10; // 10초마다 페이지 재생성

const Home = async () => {
  const repo = getQuizRepository();
  const list = await repo.list();

  // 모든 퀴즈의 조회수를 한 번에 가져오기
  const allViews = await repo.getAllViewCounts();

  // 슬라이드용 메인 이미지 배열 (각 퀴즈의 og-image 사용)
  const mainSlideImages = list.map(
    (item) => `/images/quiz/${item.meta.id}/og-image.png`
  );

  // 슬라이드 클릭 시 이동할 링크 배열
  const mainSlideLinks = list.map((item) => `/quiz/${item.meta.id}`);

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.slideSection}>
        <MainImageSlide images={mainSlideImages} links={mainSlideLinks} />
      </div>

      <main className={styles.main}>
        <section className={styles.quizListSection}>
          <h2 className={styles.sectionTitle}>🔥 추천 심리테스트 보기 🔥</h2>
          <div className={styles.quizList}>
            {list.map((item) => (
              <QuizListCard
                key={item.meta.id}
                id={item.meta.id}
                title={item.meta.title}
                thumbnail={`/images/quiz/${item.meta.id}/og-image.png`}
                views={allViews[item.meta.id] ?? 0}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
