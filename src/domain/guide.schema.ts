// src/domain/guide.schema.ts
import { z } from 'zod';

export const GuideSectionZ = z.object({
  heading: z.string().min(1).optional(),
  body: z.string().min(1),
});

export const GuideZ = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'slug는 소문자/숫자/하이픈만 허용'),
  title: z.string().min(8).max(80),
  description: z.string().min(60).max(200),
  keywords: z.array(z.string().min(1)).min(3),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  category: z.enum(['mbti', 'lifestyle', 'season', 'meta']),
  sections: z.array(GuideSectionZ).min(2),
  // 관련 퀴즈 id 목록(선택): 가이드↔퀴즈 상호 내부 링크용.
  relatedQuizzes: z.array(z.string().min(1)).optional(),
});

export const GuideIndexZ = z.object({
  guides: z.array(GuideZ),
});

export type GuideSection = z.infer<typeof GuideSectionZ>;
export type Guide = z.infer<typeof GuideZ>;
export type GuideIndex = z.infer<typeof GuideIndexZ>;
