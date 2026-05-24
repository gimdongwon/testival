import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { listGuides, getGuideBySlug } from '@/lib/guides';
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
        </article>
      </main>
      <Footer />
    </div>
  );
}
