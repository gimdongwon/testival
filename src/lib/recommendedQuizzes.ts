import quizMeta from '@/content/quiz-meta.json';
import { getQuizRepository } from '@/infrastructure/quiz.repository';
import { getAvailableWebP } from '@/lib/resolveQuizImages';
import { resolveImage } from '@/lib/imageUtils';

interface QuizMeta {
  id: string;
  title: string;
  description?: string;
}

export interface QuizRecommendation {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
}

/**
 * 현재 퀴즈를 제외한 최신 퀴즈 3개를 추천합니다.
 * @param currentQuizId 현재 보고 있는 퀴즈 ID
 * @param count 추천할 퀴즈 개수 (기본값: 3)
 * @returns 추천 퀴즈 목록
 */
export const getRecommendedQuizzes = async (
  currentQuizId: string,
  count: number = 3
): Promise<QuizRecommendation[]> => {
  const metas = (quizMeta as { metas: QuizMeta[] }).metas;
  const repo = getQuizRepository();

  // 현재 퀴즈를 제외하고 역순으로 (최신순)
  const filteredMetas = metas
    .filter((meta) => meta.id !== currentQuizId)
    .reverse()
    .slice(0, count);

  // 모든 조회수를 한 번에 가져옵니다
  const allViews = await repo.getAllViewCounts();

  // 추천 퀴즈 목록 생성
  const recommendations = filteredMetas.map((meta) => {
    const webpFiles = getAvailableWebP(meta.id);
    return {
      id: meta.id,
      title: meta.title,
      thumbnail: resolveImage(`/images/quiz/${meta.id}/og-image.png`, webpFiles),
      views: allViews[meta.id] || 0,
    };
  });

  return recommendations;
};

