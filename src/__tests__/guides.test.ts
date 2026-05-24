import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { GuideZ } from '@/domain/guide.schema';
import { listGuides, getGuideBySlug } from '@/lib/guides';

const GUIDES_DIR = path.join(process.cwd(), 'src', 'content', 'guides');

const discoverGuideFiles = (): string[] => {
  if (!fs.existsSync(GUIDES_DIR)) return [];
  return fs
    .readdirSync(GUIDES_DIR)
    .filter((f) => f.endsWith('.json') && f !== 'index.json');
};

describe('guides 콘텐츠', () => {
  const files = discoverGuideFiles();

  it.skipIf(files.length === 0)(
    '모든 가이드 JSON이 스키마를 통과한다',
    () => {
      for (const f of files) {
        const raw = JSON.parse(
          fs.readFileSync(path.join(GUIDES_DIR, f), 'utf-8'),
        );
        const result = GuideZ.safeParse(raw);
        expect(
          result.success,
          `${f}: ${JSON.stringify(result.error?.issues)}`,
        ).toBe(true);
      }
    },
  );

  it.skipIf(files.length === 0)(
    '모든 가이드 본문은 sections 합계 800자 이상이다',
    () => {
      for (const f of files) {
        const raw = JSON.parse(
          fs.readFileSync(path.join(GUIDES_DIR, f), 'utf-8'),
        );
        const total = (raw.sections ?? [])
          .map((s: { body: string }) => s.body.length)
          .reduce((a: number, b: number) => a + b, 0);
        expect(
          total,
          `${f}: 본문 총 ${total}자 < 800`,
        ).toBeGreaterThanOrEqual(800);
      }
    },
  );

  it('listGuides()는 오류 없이 동작한다', async () => {
    await expect(listGuides()).resolves.toBeDefined();
  });

  it('getGuideBySlug에 존재하지 않는 slug를 주면 null', async () => {
    await expect(getGuideBySlug('___nonexistent___')).resolves.toBeNull();
  });
});
