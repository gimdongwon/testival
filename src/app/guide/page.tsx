import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { listGuides } from '@/lib/guides';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: '심리테스트 가이드 — Testival',
  description:
    'MBTI·빅5 같은 심리학 모델부터 명절·계절 라이프스타일 가이드까지, Testival이 만든 정보성 콘텐츠 모음.',
  alternates: { canonical: 'https://testival.kr/guide' },
};

const CATEGORY_LABEL: Record<string, string> = {
  mbti: '성격이론',
  lifestyle: '라이프스타일',
  season: '시즌',
  meta: '메타',
};

export default async function GuideIndexPage() {
  const guides = await listGuides();

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <header className={styles.hero}>
          <h1 className={styles.title}>심리테스트 가이드</h1>
          <p className={styles.lede}>
            Testival이 직접 작성한 정보성 콘텐츠. 테스트보다 한 발 더 들어가
            심리학 이론과 라이프스타일 주제를 풀어드립니다.
          </p>
        </header>

        {guides.length === 0 ? (
          <p className={styles.empty}>준비 중인 콘텐츠예요. 곧 만나요!</p>
        ) : (
          <ul className={styles.list}>
            {guides.map((g) => (
              <li key={g.slug} className={styles.card}>
                <Link href={`/guide/${g.slug}`} className={styles.cardLink}>
                  <span className={styles.category}>
                    {CATEGORY_LABEL[g.category] ?? g.category}
                  </span>
                  <h2 className={styles.cardTitle}>{g.title}</h2>
                  <p className={styles.cardDesc}>{g.description}</p>
                  <time className={styles.date}>{g.publishedAt}</time>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
}
