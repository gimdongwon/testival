// app/quiz/[id]/result/page.tsx
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import ReactDOM from 'react-dom';
import ResultClient from './result.client';
import type { Metadata } from 'next';
import { getQuizRepository } from '@/infrastructure/quiz.repository';
import { usesDedicatedNewResultPage } from '@/domain/quiz.schema';
import quizMeta from '@/content/quiz-meta.json';
import { getRecommendedQuizzes } from '@/lib/recommendedQuizzes';
import { getAvailableWebP } from '@/lib/resolveQuizImages';
import { resolveImage } from '@/lib/imageUtils';

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
export const revalidate = 600;

const SEO_HIDDEN_STYLE: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
};

const stripTags = (s: string): string =>
  s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

// Task 10에서 ResultDetailZ에 추가될 예정인 longDescription 필드.
// 스키마 업데이트 전에도 SSR 본문에 안전하게 노출할 수 있도록 정의.
const getLongDescription = (detail: unknown): string | undefined => {
  if (detail && typeof detail === 'object' && 'longDescription' in detail) {
    const v = (detail as { longDescription?: unknown }).longDescription;
    return typeof v === 'string' && v.length > 0 ? v : undefined;
  }
  return undefined;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { id } = await params;
  const { type } = await searchParams;
  const SITE_URL = 'https://testival.kr';
  type QuizMetaEntry = Readonly<{
    id: string;
    title: string;
    description?: string;
  }>;
  const getMetaById = (
    quizId: string
  ): { title: string; description: string } => {
    const list = (quizMeta as { metas: QuizMetaEntry[] }).metas;
    const found = list.find((m) => m.id === quizId);
    if (!found) {
      return { title: 'Testival', description: 'Testival' };
    }
    const baseTitle = found.title ?? 'Testival';
    const baseDescription = found.description ?? `Testival - ${baseTitle}`;
    return { title: baseTitle, description: baseDescription };
  };
  const { title, description: desc } = getMetaById(id);
  const img =
    typeof type === 'string'
      ? `${SITE_URL}/images/quiz/${id}/result_${type}.png`
      : `${SITE_URL}/images/quiz/${id}/og-image.png`;
  const canonicalUrl =
    typeof type === 'string'
      ? `${SITE_URL}/quiz/${id}/result?type=${type}`
      : `${SITE_URL}/quiz/${id}/result`;

  return {
    title,
    description: desc,
    openGraph: {
      type: 'article',
      siteName: `Testival ${id}`,
      url: canonicalUrl,
      title,
      description: desc,
      images: [{ url: img, width: 1200, height: 630 }],
      locale: 'ko_KR',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [img],
    },
    alternates: { canonical: canonicalUrl },
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const resolvedSearch = await searchParams;
  const { type } = resolvedSearch;
  const repo = getQuizRepository();
  const def = await repo.getById(id);
  if (!def) return notFound();

  if (usesDedicatedNewResultPage(def)) {
    const qs = new URLSearchParams();
    for (const [key, val] of Object.entries(resolvedSearch)) {
      if (val === undefined) continue;
      if (Array.isArray(val)) {
        for (const v of val) {
          qs.append(key, v);
        }
      } else {
        qs.set(key, val);
      }
    }
    const query = qs.toString();
    redirect(query ? `/quiz/${id}/new-result?${query}` : `/quiz/${id}/new-result`);
  }

  // type 쿼리가 있으면 결과 이미지를 webp로 해석하고 SSR 단계에서 preload
  let resolvedDef = def;
  if (typeof type === 'string') {
    const entry = Object.entries(def.resultDetails).find(
      ([, d]) => d.type === type
    );
    if (entry) {
      const [key, detail] = entry;
      if (detail.image) {
        const webpFiles = getAvailableWebP(id);
        const resolved = resolveImage(detail.image, webpFiles);
        ReactDOM.preload(resolved, { as: 'image', fetchPriority: 'high' });
        if (resolved !== detail.image) {
          resolvedDef = {
            ...def,
            resultDetails: {
              ...def.resultDetails,
              [key]: { ...detail, image: resolved },
            },
          };
        }
      }
    }
  }

  // 추천 퀴즈 가져오기
  const recommendedQuizzes = await getRecommendedQuizzes(id, 3);

  // SSR body for crawlers — visible result text rendered server-side
  const typeStr = typeof type === 'string' ? type : null;
  const matchedDetail = typeStr
    ? Object.values(def.resultDetails).find((d) => d.type === typeStr)
    : null;

  return (
    <>
      <section style={SEO_HIDDEN_STYLE} aria-hidden='true'>
        <h1>{def.meta.title} — 결과</h1>
        {def.meta.description && <p>{def.meta.description}</p>}

        {matchedDetail ? (
          <article>
            <h2>{stripTags(matchedDetail.title)}</h2>
            <p>{stripTags(matchedDetail.description)}</p>
            {(() => {
              const long = getLongDescription(matchedDetail);
              return long ? <p>{long}</p> : null;
            })()}
          </article>
        ) : (
          <>
            <h2>이 테스트에서 나올 수 있는 결과</h2>
            {Object.values(def.resultDetails).map((d) => {
              const long = getLongDescription(d);
              return (
                <article key={d.type}>
                  <h3>
                    {stripTags(d.name)} — {stripTags(d.title)}
                  </h3>
                  <p>{stripTags(d.description)}</p>
                  {long && <p>{long}</p>}
                </article>
              );
            })}
          </>
        )}
      </section>

      <Suspense fallback={null}>
        <ResultClient
          def={resolvedDef}
          recommendedQuizzes={recommendedQuizzes}
        />
      </Suspense>
    </>
  );
}
