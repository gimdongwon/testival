import { MetadataRoute } from 'next';
import { getQuizRepository } from '@/infrastructure/quiz.repository';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const repo = getQuizRepository();
  const list = await repo.list();

  const baseUrl = 'https://testival.kr';

  // 각 퀴즈별 페이지 생성 (landing, question, result)
  const quizPages = list.flatMap((quiz) => [
    {
      url: `${baseUrl}/quiz/${quiz.meta.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/quiz/${quiz.meta.id}/question`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/quiz/${quiz.meta.id}/result`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
  ]);

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...quizPages,
  ];
}
