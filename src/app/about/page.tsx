import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Testival(테스티벌)은 재미있는 심리테스트를 무료로 즐길 수 있는 플랫폼입니다.',
};

const QUIZ_CATEGORIES = [
  {
    emoji: '🎉',
    title: '명절 · 시즌',
    description: '추석, 설날, 크리스마스 등 특별한 날에 어울리는 테스트',
  },
  {
    emoji: '✈️',
    title: '여행',
    description: '여행 스타일, 목적지, 여행 중 나의 모습을 알아보는 테스트',
  },
  {
    emoji: '🧠',
    title: '성격 · 심리',
    description: '나의 성향과 숨겨진 성격을 발견하는 테스트',
  },
  {
    emoji: '🔥',
    title: '트렌드 · 라이프스타일',
    description: '요즘 유행하는 주제와 일상 속 나를 알아보는 테스트',
  },
];

const FEATURES = [
  { emoji: '💰', text: '완전 무료' },
  { emoji: '🔓', text: '회원가입 불필요' },
  { emoji: '📱', text: '모바일 최적화' },
  { emoji: '🔗', text: '결과 공유 가능' },
  { emoji: '🆕', text: '새로운 테스트 지속 업데이트' },
];

const SNS_LINKS = [
  {
    label: 'Instagram',
    handle: '@testival.official',
    href: 'https://www.instagram.com/testival.official/',
  },
  {
    label: 'YouTube',
    handle: '@testival.official',
    href: 'https://www.youtube.com/@testival.official',
  },
  {
    label: 'TikTok',
    handle: '@testival.official',
    href: 'https://www.tiktok.com/@testival.official',
  },
  {
    label: 'X (Twitter)',
    handle: '@testival2025',
    href: 'https://x.com/testival2025',
  },
];

const AboutPage = () => {
  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            테스트의 축제,
            <br />
            <span className={styles.brand}>Testival</span>
          </h1>
          <p className={styles.heroDescription}>
            재미있는 심리테스트를 무료로 즐겨보세요.
            <br />
            나를 발견하는 가장 즐거운 방법!
          </p>
        </section>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Testival이란?</h2>
            <p className={styles.text}>
              <strong>Testival</strong>은 <em>Test</em>와 <em>Festival</em>의
              합성어로, &quot;테스트의 축제&quot;라는 의미를 담고 있습니다.
            </p>
            <p className={styles.text}>
              성격, 여행, 명절, 트렌드 등 다양한 주제의 심리테스트를 통해
              나 자신을 재발견하고, 친구들과 결과를 나누며 함께 즐길 수 있는
              플랫폼입니다.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>어떤 테스트가 있나요?</h2>
            <div className={styles.categoryGrid}>
              {QUIZ_CATEGORIES.map((cat) => (
                <div key={cat.title} className={styles.categoryCard}>
                  <span className={styles.categoryEmoji}>{cat.emoji}</span>
                  <h3 className={styles.categoryTitle}>{cat.title}</h3>
                  <p className={styles.categoryDescription}>
                    {cat.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>서비스 특징</h2>
            <ul className={styles.featureList}>
              {FEATURES.map((feat) => (
                <li key={feat.text} className={styles.featureItem}>
                  <span className={styles.featureEmoji}>{feat.emoji}</span>
                  <span>{feat.text}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>SNS</h2>
            <div className={styles.snsList}>
              {SNS_LINKS.map((sns) => (
                <a
                  key={sns.label}
                  href={sns.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={styles.snsCard}
                  aria-label={`${sns.label} ${sns.handle} (새 탭에서 열림)`}
                  tabIndex={0}
                >
                  <span className={styles.snsLabel}>{sns.label}</span>
                  <span className={styles.snsHandle}>{sns.handle}</span>
                </a>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>운영자 소개</h2>
            <p className={styles.text}>
              Testival은 2024년 봄, &ldquo;심리테스트가 단순한 시간 때우기를 넘어
              사람과 사람을 이어주는 대화의 시작이 될 수 있다&rdquo;는 작은 믿음에서
              출발했습니다. 디자이너와 프론트엔드 개발자, 카피라이터로 구성된
              소규모 팀이 정기적으로 아이디어 회의를 열고, 시즌·트렌드·일상의
              사소한 질문을 모아 한 편의 테스트로 만들고 있어요.
            </p>
            <p className={styles.text}>
              저희는 화려한 그래픽이나 자극적인 결과보다, &ldquo;아 나 진짜 이런 사람
              맞네&rdquo;하고 웃을 수 있는 정확한 한 줄을 더 중요하게 생각합니다.
              그래서 테스트를 출시하기 전 베타 테스터들에게 결과를 먼저 보여주고,
              공감 점수가 일정 수준 이상이 되어야 공개합니다.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>콘텐츠 제작 철학</h2>
            <p className={styles.text}>
              Testival의 모든 테스트는 다음 3가지 기준으로 설계됩니다.
            </p>
            <ol className={styles.philosophyList}>
              <li>
                <strong>공감 가능한 일상성:</strong> 거창한 가설보다 &ldquo;아침에
                일어나서 가장 먼저 보는 화면&rdquo;처럼 누구나 떠올릴 수 있는 구체적인
                상황에서 질문을 만들어요. 추상적인 단어(&ldquo;당신은 외향적인가요?&rdquo;)는
                가능한 한 피합니다.
              </li>
              <li>
                <strong>긍정적인 결과 메시지:</strong> 모든 결과는 &ldquo;당신이
                이런 사람이라 좋아요&rdquo;라는 톤으로 마무리되도록 카피를 다듬어요.
                외모·능력에 대한 부정적인 평가나 직접적인 판단은 결과에 등장하지
                않습니다.
              </li>
              <li>
                <strong>공유 가능한 시각성:</strong> 결과 페이지의 키 컬러, 일러스트,
                한 줄 카피가 SNS에서 공유했을 때 한눈에 의미가 전달되도록 디자인합니다.
                자기 표현의 도구로 쓰일 수 있는 결과가 우리의 가장 중요한 성공 지표예요.
              </li>
            </ol>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>제작 프로세스</h2>
            <p className={styles.text}>
              하나의 테스트는 보통 다음 5단계를 거쳐 공개됩니다.
            </p>
            <ol className={styles.processList}>
              <li>
                <strong>주제 선정:</strong> 시즌 이슈, 커뮤니티 트렌드, 자체 아이디어
                풀에서 후보를 모아 매주 1~2개 주제를 선정해요.
              </li>
              <li>
                <strong>심리 모델 매핑:</strong> 빅5(OCEAN), MBTI, 욕구 위계 등
                검증된 심리학 모델에서 가장 가까운 분류 체계를 골라 결과 유형의
                뼈대를 잡습니다.
              </li>
              <li>
                <strong>문항·결과 카피:</strong> 카피라이터가 7~12개의 문항과 4~6개의
                결과 카피를 작성하고, 팀 내부 1차 리뷰를 거칩니다.
              </li>
              <li>
                <strong>일러스트·디자인:</strong> 디자이너가 결과별 일러스트와 키
                컬러, 모바일 최적화 레이아웃을 작업해요.
              </li>
              <li>
                <strong>베타 테스트 & 공개:</strong> 베타 테스터 피드백으로 공감
                점수가 일정 기준을 넘으면 공개. 공개 후에도 분기마다 결과 카피를
                다듬습니다.
              </li>
            </ol>
            <p className={styles.text}>
              Testival의 결과는 재미를 위한 것이지만, 그 재미의 바탕에는 사람을
              존중하는 제작 태도가 있다고 믿어요. 이 페이지에 적힌 약속은 새 테스트가
              나올 때마다 그대로 지키고 있습니다.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>문의하기</h2>
            <p className={styles.text}>
              테스트 제안, 협업 문의, 기타 궁금한 사항이 있으시면 언제든
              연락해 주세요.
            </p>
            <Link href='/contact' className={styles.contactButton} tabIndex={0}>
              Contact Us
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
