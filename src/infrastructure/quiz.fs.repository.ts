// src/infrastructure/quiz.fs.repository.ts
import 'server-only';
import {
  TestDefinitionZ,
  type TestDefinition,
  TestMetaZ,
} from '@/domain/quiz.schema';

export class FSQuizRepository {
  getTestDefinition: (() => TestDefinition) | undefined;
  async getById(id: string): Promise<TestDefinition | null> {
    try {
      const mod = await import(`@/content/chuseok/${id}.json`);
      return TestDefinitionZ.parse(mod.default ?? mod);
    } catch {
      return null;
    }
  }

  async list(): Promise<Array<Pick<TestDefinition, 'meta'>>> {
    const index = await import('@/content/chuseok/index.json');
    const metaList = (index.default ?? index).metaList;
    if (!Array.isArray(metaList)) return [];

    return metaList
      .map((raw) => {
        try {
          const parsed = TestMetaZ.pick({ id: true, title: true }).parse(raw);
          return { meta: parsed as TestDefinition['meta'] };
        } catch {
          return null;
        }
      })
      .filter((v): v is { meta: TestDefinition['meta'] } => v !== null);
  }
}
