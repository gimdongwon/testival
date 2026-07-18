import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';
import { GuideZ, type Guide } from '@/domain/guide.schema';

const GUIDES_DIR = path.join(process.cwd(), 'src', 'content', 'guides');

export async function listGuides(): Promise<Guide[]> {
  let files: string[];
  try {
    files = await fs.readdir(GUIDES_DIR);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw err;
  }
  const guides: Guide[] = [];
  for (const f of files) {
    if (!f.endsWith('.json') || f === 'index.json') continue;
    const raw = await fs.readFile(path.join(GUIDES_DIR, f), 'utf-8');
    const parsed = GuideZ.parse(JSON.parse(raw));
    guides.push(parsed);
  }
  return guides.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/**
 * 특정 퀴즈와 연결된 가이드 목록(가이드의 relatedQuizzes에 해당 퀴즈 id가 포함).
 * 퀴즈 랜딩 페이지에서 "함께 읽어보면 좋은 글" 내부 링크에 사용.
 */
export async function getGuidesForQuiz(
  quizId: string,
  limit = 3,
): Promise<Guide[]> {
  const guides = await listGuides();
  return guides
    .filter((g) => g.relatedQuizzes?.includes(quizId))
    .slice(0, limit);
}

export async function getGuideBySlug(slug: string): Promise<Guide | null> {
  const filePath = path.join(GUIDES_DIR, `${slug}.json`);
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return GuideZ.parse(JSON.parse(raw));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
}
