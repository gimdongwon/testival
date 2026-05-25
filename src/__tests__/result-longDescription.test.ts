import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const CONTENT_ROOT = path.join(process.cwd(), 'src', 'content');

type QuizFile = { namespace: string; id: string; filePath: string };

const discoverQuizFiles = (): QuizFile[] => {
  const entries = fs.readdirSync(CONTENT_ROOT, { withFileTypes: true });
  const quizFiles: QuizFile[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name === 'guides') continue;
    const nsDir = path.join(CONTENT_ROOT, entry.name);
    const files = fs
      .readdirSync(nsDir)
      .filter((f) => f.endsWith('.json') && f !== 'index.json');
    for (const file of files) {
      quizFiles.push({
        namespace: entry.name,
        id: file.replace('.json', ''),
        filePath: path.join(nsDir, file),
      });
    }
  }

  return quizFiles;
};

const quizFiles = discoverQuizFiles();

describe('result longDescription SEO 강화', () => {
  it.each(quizFiles)(
    '$namespace/$id — 모든 resultDetails entry에 longDescription(800자+)이 있다',
    ({ filePath }) => {
      const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const details = (raw.resultDetails ?? {}) as Record<
        string,
        { longDescription?: string }
      >;
      for (const [key, detail] of Object.entries(details)) {
        expect(
          (detail.longDescription ?? '').length,
          `resultDetails.${key}: longDescription 없음 또는 800자 미만 (현재 ${(detail.longDescription ?? '').length}자)`,
        ).toBeGreaterThanOrEqual(800);
      }
    },
  );
});
