import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import RelatedLinks from '@/components/common/RelatedLinks';
import { listGuides, getGuideBySlug } from '@/lib/guides';
import { getQuizRepository } from '@/infrastructure/quiz.repository';
import styles from './page.module.scss';

export const dynamicParams = false;

export async function generateStaticParams() {
  const guides = await listGuides();
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = await getGuideBySlug(slug);
  if (!g) return {};
  const url = `https://testival.kr/guide/${g.slug}`;
  return {
    title: g.title,
    description: g.description,
    keywords: g.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: g.title,
      description: g.description,
      url,
      publishedTime: g.publishedAt,
      modifiedTime: g.updatedAt ?? g.publishedAt,
      locale: 'ko_KR',
    },
    twitter: {
      card: 'summary',
      title: g.title,
      description: g.description,
    },
  };
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = await getGuideBySlug(slug);
  if (!g) return notFound();

  // 관련 테스트: relatedQuizzes id를 실제 퀴즈 메타로 해석(없는 id는 스킵).
  const repo = getQuizRepository();
  const [allQuizzes, allGuides] = await Promise.all([
    repo.list(),
    listGuides(),
  ]);
  const quizById = new Map(allQuizzes.map((q) => [q.meta.id, q]));
  const relatedQuizLinks = (g.relatedQuizzes ?? [])
    .map((id) => quizById.get(id))
    .filter((q): q is NonNullable<typeof q> => Boolean(q))
    .map((q) => ({
      href: `/quiz/${q.meta.id}`,
      label: q.meta.title,
    }));
  const otherGuideLinks = allGuides
    .filter((x) => x.slug !== g.slug)
    .slice(0, 4)
    .map((x) => ({
      href: `/guide/${x.slug}`,
      label: x.title,
      sub: x.description,
    }));

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: g.title,
    description: g.description,
    author: { '@type': 'Organization', name: 'Testival' },
    publisher: { '@type': 'Organization', name: 'Testival' },
    datePublished: g.publishedAt,
    dateModified: g.updatedAt ?? g.publishedAt,
    inLanguage: 'ko-KR',
    keywords: g.keywords.join(', '),
    mainEntityOfPage: `https://testival.kr/guide/${g.slug}`,
  };

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <Script
          id={`guide-article-jsonld-${g.slug}`}
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
        <article className={styles.article}>
          <nav className={styles.breadcrumb} aria-label='breadcrumb'>
            <Link href='/'>홈</Link>
            <span aria-hidden='true'>›</span>
            <Link href='/guide'>가이드</Link>
          </nav>
          <header>
            <h1 className={styles.title}>{g.title}</h1>
            <p className={styles.lede}>{g.description}</p>
            <time className={styles.date} dateTime={g.publishedAt}>
              {g.publishedAt}
              {g.updatedAt && g.updatedAt !== g.publishedAt
                ? ` · 업데이트 ${g.updatedAt}`
                : ''}
            </time>
          </header>
          <div className={styles.body}>
            {g.sections.map((s, i) => (
              <section key={i}>
                {s.heading && (
                  <h2 className={styles.heading}>{s.heading}</h2>
                )}
                {s.body.split('\n\n').map((para, j) => (
                  <p key={j} className={styles.para}>
                    {para}
                  </p>
                ))}
              </section>
            ))}
          </div>
          {relatedQuizLinks.length > 0 && (
            <div className={styles.relatedBlock}>
              <RelatedLinks title="관련 테스트 해보기" links={relatedQuizLinks} />
            </div>
          )}
          {otherGuideLinks.length > 0 && (
            <div className={styles.relatedBlock}>
              <RelatedLinks
                title="다른 가이드 더 보기"
                links={otherGuideLinks}
                moreHref="/guide"
                moreLabel="가이드 전체 보기 →"
              />
            </div>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
}
