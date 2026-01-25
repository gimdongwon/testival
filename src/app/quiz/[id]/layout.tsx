import type { Metadata } from 'next';
import quizMeta from '@/content/quiz-meta.json';
import Header from '@/components/common/Header';
import styles from './quizLayout.module.scss';

const siteUrl = 'https://testival.kr';

type QuizLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

type Params = {
  id: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;

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
    const title = found.title ?? 'Testival';
    const description = found.description ?? `Testival - ${title}`;
    return { title, description };
  };

  const { title: resolvedTitle, description: resolvedDescription } =
    getMetaById(id);
  const ogImage = `${siteUrl}/images/quiz/${id}/og-image.png`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: resolvedTitle,
      template: '%s | Testival',
    },
    description: resolvedDescription,
    keywords: [
      '심리테스트',
      '성격테스트',
      resolvedTitle,
      '무료테스트',
      '온라인테스트',
    ],
    openGraph: {
      type: 'website',
      url: `${siteUrl}/quiz/${id}`,
      siteName: 'Testival',
      title: resolvedTitle,
      description: resolvedDescription,
      locale: 'ko_KR',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${resolvedTitle} - Testival 심리테스트`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description: resolvedDescription,
      images: [ogImage],
    },
    alternates: { canonical: `${siteUrl}/quiz/${id}` },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    other: {
      // Kakao 공유를 위한 메타태그
      'kakao:title': resolvedTitle,
      'kakao:description': resolvedDescription,
      'kakao:image': ogImage,
      // Pinterest 메타태그
      'pinterest:title': resolvedTitle,
      'pinterest:description': resolvedDescription,
      'pinterest:media': ogImage,
    },
  };
}

export default function QuizLayout({ children }: QuizLayoutProps) {
  return (
    <>
      <Header variant='quiz' />
      <div className={styles.pageWrapper}>{children}</div>
    </>
  );
}
