import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/common/Header';
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
    </div>
  );
};

export default AboutPage;
