// src/infrastructure/quiz.fs.repository.ts
import 'server-only';
import fs from 'fs';
import path from 'path';
import {
  TestDefinitionZ,
  type TestDefinition,
  TestMetaZ,
} from '@/domain/quiz.schema';

export class FSQuizRepository {
  getTestDefinition: (() => TestDefinition) | undefined;
  private getContentRoot(): string {
    return path.join(process.cwd(), 'src', 'content');
  }

  private async discoverNamespaces(): Promise<string[]> {
    const root = this.getContentRoot();
    try {
      const entries = await fs.promises.readdir(root, { withFileTypes: true });
      return entries.filter((e) => e.isDirectory()).map((e) => e.name);
    } catch {
      return [];
    }
  }
  async getById(id: string): Promise<TestDefinition | null> {
    const namespaces = await this.discoverNamespaces();
    for (const ns of namespaces) {
      try {
        const mod = await import(`@/content/${ns}/${id}.json`);
        const loaded = (mod as { default?: unknown })?.default ?? mod;
        return TestDefinitionZ.parse(loaded);
      } catch {
        continue;
      }
    }
    return null;
  }

  async list(): Promise<Array<Pick<TestDefinition, 'meta'>>> {
    const namespaces = await this.discoverNamespaces();
    const all: Array<{ meta: TestDefinition['meta'] }> = [];
    for (const ns of namespaces) {
      try {
        const index = await import(`@/content/${ns}/index.json`);
        const metaListAny = (index as { default?: unknown })?.default ?? index;
        const metaList = (metaListAny as { metaList?: unknown })
          ?.metaList as unknown;
        if (!Array.isArray(metaList)) continue;
        const parsed = (metaList as unknown[])
          .map((raw: unknown) => {
            try {
              const m = TestMetaZ.pick({ id: true, title: true }).parse(raw);
              return { meta: m as TestDefinition['meta'] };
            } catch {
              return null;
            }
          })
          .filter(
            (v: unknown): v is { meta: TestDefinition['meta'] } => v !== null
          );
        all.push(...parsed);
      } catch {
        continue;
      }
    }
    return all;
  }
}
