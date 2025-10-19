import type { Metadata } from 'next';

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

  const titleById: Record<string, string> = {
    chuseok: '추석 테스트',
    chuseok_money: '추석 용돈 테스트',
    seat: '친구들과 여행가는 차 안, 내 자리는?',
  };

  const descriptionById: Record<string, string> = {
    chuseok: 'Testival - 추석 테스트',
    chuseok_money: 'Testival - 추석 용돈 테스트',
    seat: 'Testival - 친구들과 여행가는 차 안, 내 자리는?',
  };

  const resolvedTitle = titleById[id] ?? 'Testival';
  const resolvedDescription = descriptionById[id] ?? 'Testival';
  const ogImage = `${siteUrl}/images/quiz/${id}/ogImage.png`;

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
  return <>{children}</>;
}
