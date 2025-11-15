// src/infrastructure/quiz.fs.repository.ts
import 'server-only';
import fs from 'fs';
import path from 'path';
import {
  TestDefinitionZ,
  type TestDefinition,
  TestMetaZ,
} from '@/domain/quiz.schema';

// KV 클라이언트를 조건부로 import
type KVClient = {
  get: <T = unknown>(key: string) => Promise<T | null>;
  incr: (key: string) => Promise<number>;
  keys: (pattern: string) => Promise<string[]>;
  mget: <T = unknown[]>(...keys: string[]) => Promise<T>;
};

let kv: KVClient | null = null;

// 환경 변수가 유효한 경우에만 KV 클라이언트 초기화
if (
  process.env.KV_REST_API_URL &&
  process.env.KV_REST_API_TOKEN &&
  process.env.KV_REST_API_URL.startsWith('https://')
) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const kvModule = require('@vercel/kv');
    kv = kvModule.kv as KVClient;
  } catch {
    console.warn('Vercel KV is not configured. View counts will be disabled.');
  }
}

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
              const m = TestMetaZ.pick({
                id: true,
                title: true,
                thumbnail: true,
              }).parse(raw);
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

  async getViewCount(id: string): Promise<number> {
    if (!kv) {
      console.warn('KV not configured, returning 0 views');
      return 0;
    }
    try {
      const key = `quiz:views:${id}`;
      const views = (await kv.get<number>(key)) ?? 0;
      return views;
    } catch (error) {
      console.error('Failed to get view count:', error);
      return 0;
    }
  }

  async getAllViewCounts(): Promise<Record<string, number>> {
    if (!kv) {
      console.warn('KV not configured, returning empty views');
      return {};
    }
    try {
      const keys = await kv.keys('quiz:views:*');

      if (!keys || keys.length === 0) {
        return {};
      }

      const values = await kv.mget<number[]>(...keys);
      const viewsMap: Record<string, number> = {};

      keys.forEach((key, index) => {
        const quizId = key.replace('quiz:views:', '');
        viewsMap[quizId] = values[index] ?? 0;
      });

      return viewsMap;
    } catch (error) {
      console.error('Failed to get all view counts:', error);
      return {};
    }
  }

  async incrementViewCount(id: string): Promise<number> {
    if (!kv) {
      console.warn('KV not configured, cannot increment view count');
      return 0;
    }
    try {
      const key = `quiz:views:${id}`;
      await kv.incr(key);
      const views = (await kv.get<number>(key)) ?? 1;
      return views;
    } catch (error) {
      console.error('Failed to increment view count:', error);
      return 0;
    }
  }
}
