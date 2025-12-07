import type { Metadata } from 'next';
import quizMeta from '@/content/quiz-meta.json';
import QuizHeader from '@/components/common/QuizHeader';
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
      template: '%s | testival',
    },
    description: resolvedDescription,
    openGraph: {
      type: 'website',
      url: `${siteUrl}/quiz/${id}`,
      siteName: 'testival',
      title: resolvedTitle,
      description: resolvedDescription,
      locale: 'ko_KR',
      images: [
        { url: ogImage, width: 1200, height: 630, alt: '미리보기 이미지' },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description: resolvedDescription,
      images: [ogImage],
    },
    alternates: { canonical: `${siteUrl}/quiz/${id}` },
  };
}

export default function QuizLayout({ children }: QuizLayoutProps) {
  return (
    <>
      <QuizHeader />
      <div className={styles.pageWrapper}>{children}</div>
    </>
  );
}
