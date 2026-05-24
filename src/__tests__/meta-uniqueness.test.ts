import { describe, it, expect } from 'vitest';
import quizMeta from '@/content/quiz-meta.json';

const metas = quizMeta.metas as Array<{
  id: string;
  title: string;
  description?: string;
  keywords?: string[];
}>;

describe('quiz-meta.json 메타데이터 품질', () => {
  it('모든 entry는 70자 이상의 description을 가진다', () => {
    for (const m of metas) {
      expect(m.description, `${m.id}: description 없음`).toBeTruthy();
      expect(
        (m.description ?? '').length,
        `${m.id}: description이 너무 짧음 (${m.description})`,
      ).toBeGreaterThanOrEqual(70);
    }
  });

  it('description은 "Testival - <title>" 패턴이 아니어야 한다', () => {
    for (const m of metas) {
      expect(
        m.description?.startsWith('Testival - ') ?? false,
        `${m.id}: description이 generic 패턴 사용 중`,
      ).toBe(false);
    }
  });

  it('description은 서로 중복되지 않아야 한다', () => {
    const seen = new Map<string, string>();
    for (const m of metas) {
      const desc = m.description ?? '';
      const prev = seen.get(desc);
      expect(
        prev,
        `${m.id}와 ${prev}의 description이 동일`,
      ).toBeUndefined();
      seen.set(desc, m.id);
    }
  });

  it('모든 entry는 최소 5개의 keywords를 가진다', () => {
    for (const m of metas) {
      expect(
        (m.keywords ?? []).length,
        `${m.id}: keywords 부족 (${(m.keywords ?? []).length}개)`,
      ).toBeGreaterThanOrEqual(5);
    }
  });
});
