import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { TestDefinitionZ } from '@/domain/quiz.schema';
import quizMeta from '@/content/quiz-meta.json';

const CONTENT_ROOT = path.join(process.cwd(), 'src', 'content');

const discoverQuizFiles = (): { namespace: string; id: string; filePath: string }[] => {
  const entries = fs.readdirSync(CONTENT_ROOT, { withFileTypes: true });
  const quizFiles: { namespace: string; id: string; filePath: string }[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    // /guides는 quiz가 아니라 별도 콘텐츠 타입이므로 제외
    if (entry.name === 'guides') continue;
    const nsDir = path.join(CONTENT_ROOT, entry.name);
    const files = fs.readdirSync(nsDir).filter(
      (f) => f.endsWith('.json') && f !== 'index.json'
    );
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

describe('콘텐츠 무결성 테스트', () => {
  describe('모든 퀴즈 JSON이 Zod 스키마를 통과해야 한다', () => {
    it.each(quizFiles)(
      '$namespace/$id — 스키마 검증 통과',
      ({ filePath }) => {
        const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const result = TestDefinitionZ.safeParse(raw);

        if (!result.success) {
          const errors = result.error.issues.map(
            (issue) => `  [${issue.path.join('.')}] ${issue.message}`
          );
          throw new Error(`스키마 검증 실패:\n${errors.join('\n')}`);
        }

        expect(result.success).toBe(true);
      }
    );
  });

  describe('quiz-meta.json 정합성', () => {
    const metaIds = quizMeta.metas.map((m) => m.id);
    const actualQuizIds = quizFiles.map((q) => q.id);

    it('quiz-meta.json의 모든 ID에 대응하는 콘텐츠 파일이 존재해야 한다', () => {
      const missingContent = metaIds.filter((id) => !actualQuizIds.includes(id));

      if (missingContent.length > 0) {
        throw new Error(
          `quiz-meta.json에 등록되었지만 콘텐츠 파일이 없는 ID: ${missingContent.join(', ')}`
        );
      }

      expect(missingContent).toHaveLength(0);
    });

    it('모든 콘텐츠 파일의 ID가 quiz-meta.json에 등록되어 있어야 한다', () => {
      const missingMeta = actualQuizIds.filter((id) => !metaIds.includes(id));

      if (missingMeta.length > 0) {
        throw new Error(
          `콘텐츠 파일이 존재하지만 quiz-meta.json에 미등록된 ID: ${missingMeta.join(', ')}`
        );
      }

      expect(missingMeta).toHaveLength(0);
    });

    it('quiz-meta.json에 중복된 ID가 없어야 한다', () => {
      const duplicates = metaIds.filter(
        (id, idx) => metaIds.indexOf(id) !== idx
      );

      expect(duplicates).toHaveLength(0);
    });
  });

  describe('네임스페이스 index.json 정합성', () => {
    it.each(
      fs
        .readdirSync(CONTENT_ROOT, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .filter((e) => e.name !== 'guides')
        .map((e) => e.name)
    )('네임스페이스 "%s"의 index.json이 올바른 구조여야 한다', (ns) => {
      const indexPath = path.join(CONTENT_ROOT, ns, 'index.json');

      expect(fs.existsSync(indexPath)).toBe(true);

      const data = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));

      expect(data).toHaveProperty('metaList');
      expect(Array.isArray(data.metaList)).toBe(true);
      expect(data.metaList.length).toBeGreaterThan(0);

      for (const meta of data.metaList) {
        expect(meta).toHaveProperty('id');
        expect(meta).toHaveProperty('title');
        expect(typeof meta.id).toBe('string');
        expect(typeof meta.title).toBe('string');
      }
    });
  });

  describe('resultDetails 완전성', () => {
    it.each(quizFiles)(
      '$namespace/$id — 모든 resultType에 대응하는 resultDetail이 존재해야 한다',
      ({ filePath }) => {
        const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const def = TestDefinitionZ.parse(raw);
        const resultTypes = def.meta.resultTypes;
        const resultDetailKeys = Object.keys(def.resultDetails ?? {});

        const missing = resultTypes.filter((t) => !resultDetailKeys.includes(t));

        if (missing.length > 0) {
          throw new Error(
            `resultTypes에 정의되었지만 resultDetails가 없는 타입: ${missing.join(', ')}`
          );
        }

        expect(missing).toHaveLength(0);
      }
    );
  });

  describe('weighted 모드 — weights 키 커버리지', () => {
    const pureWeightedQuizzes = quizFiles.filter(({ filePath }) => {
      const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      if (raw.meta?.mode !== 'weighted') return false;
      const hasAmountBrackets = raw.scoring?.amountSumBrackets?.length > 0;
      return !hasAmountBrackets;
    });

    if (pureWeightedQuizzes.length > 0) {
      it.each(pureWeightedQuizzes)(
        '$namespace/$id — 모든 resultType이 최소 하나의 선택지 weights에 포함되어야 한다',
        ({ filePath }) => {
          const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          const def = TestDefinitionZ.parse(raw);
          const allWeightKeys = new Set<string>();

          for (const q of def.questions) {
            for (const c of q.choices) {
              if (c.weights) {
                Object.keys(c.weights).forEach((k) => allWeightKeys.add(k));
              }
            }
          }

          const uncovered = def.meta.resultTypes.filter(
            (t) => !allWeightKeys.has(t)
          );

          if (uncovered.length > 0) {
            throw new Error(
              `resultType "${uncovered.join(', ')}"이 어떤 선택지의 weights에도 포함되지 않음`
            );
          }

          expect(uncovered).toHaveLength(0);
        }
      );
    }
  });

  describe('하이브리드 모드 감지 (weighted + amountSumBrackets)', () => {
    const hybridQuizzes = quizFiles.filter(({ filePath }) => {
      const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return raw.meta?.mode === 'weighted' && raw.scoring?.amountSumBrackets?.length > 0;
    });

    if (hybridQuizzes.length > 0) {
      it.each(hybridQuizzes)(
        '$namespace/$id — 하이브리드 모드: amountSumBrackets의 키가 resultTypes와 일치해야 한다',
        ({ filePath }) => {
          const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          const def = TestDefinitionZ.parse(raw);
          const resultTypes = new Set(def.meta.resultTypes);
          const brackets = def.scoring?.amountSumBrackets ?? [];
          const bracketKeys = brackets.map(
            (b: { key: string }) => b.key
          );

          const missingInBrackets = def.meta.resultTypes.filter(
            (t) => !bracketKeys.includes(t)
          );
          const extraInBrackets = bracketKeys.filter(
            (k: string) => !resultTypes.has(k)
          );

          expect(missingInBrackets).toHaveLength(0);
          expect(extraInBrackets).toHaveLength(0);
        }
      );
    }
  });

  describe('amount-sum 모드 — 브라켓 커버리지', () => {
    const amountSumQuizzes = quizFiles.filter(({ filePath }) => {
      const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return raw.meta?.mode === 'amount-sum';
    });

    if (amountSumQuizzes.length > 0) {
      it.each(amountSumQuizzes)(
        '$namespace/$id — 모든 선택지에 amount가 있어야 한다',
        ({ filePath }) => {
          const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          const def = TestDefinitionZ.parse(raw);
          const missingAmount: string[] = [];

          for (const q of def.questions) {
            for (const c of q.choices) {
              if (typeof c.amount !== 'number') {
                missingAmount.push(`${q.id}.${c.id}`);
              }
            }
          }

          expect(missingAmount).toHaveLength(0);
        }
      );
    }
  });

  describe('선택지 ID 유니크 검증', () => {
    it.each(quizFiles)(
      '$namespace/$id — 문항 내 선택지 ID가 고유해야 한다',
      ({ filePath }) => {
        const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const def = TestDefinitionZ.parse(raw);

        for (const q of def.questions) {
          const ids = q.choices.map((c) => c.id);
          const duplicates = ids.filter((id, idx) => ids.indexOf(id) !== idx);

          if (duplicates.length > 0) {
            throw new Error(
              `문항 "${q.id}"에 중복된 선택지 ID: ${duplicates.join(', ')}`
            );
          }
        }
      }
    );

    it.each(quizFiles)(
      '$namespace/$id — 문항 ID가 고유해야 한다',
      ({ filePath }) => {
        const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const def = TestDefinitionZ.parse(raw);
        const ids = def.questions.map((q) => q.id);
        const duplicates = ids.filter((id, idx) => ids.indexOf(id) !== idx);

        expect(duplicates).toHaveLength(0);
      }
    );
  });
});
