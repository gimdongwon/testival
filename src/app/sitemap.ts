import { MetadataRoute } from 'next';
import { getQuizRepository } from '@/infrastructure/quiz.repository';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const repo = getQuizRepository();
  const list = await repo.list();
  const baseUrl = 'https://testival.kr';
  const now = new Date();

  // 각 퀴즈별 랜딩 + result type별 URL
  const quizEntries: MetadataRoute.Sitemap = [];
  for (const item of list) {
    quizEntries.push({
      url: `${baseUrl}/quiz/${item.meta.id}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
    const def = await repo.getById(item.meta.id);
    if (!def) continue;
    for (const type of def.meta.resultTypes) {
      quizEntries.push({
        url: `${baseUrl}/quiz/${item.meta.id}/result?type=${type}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  }

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  return [...staticPages, ...quizEntries];
}
