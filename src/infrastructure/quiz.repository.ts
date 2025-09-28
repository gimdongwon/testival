// src/infrastructure/quiz.repository.ts (factory)
import type { TestDefinition, TestMeta } from '@/domain/quiz.schema';
import { FSQuizRepository } from './quiz.fs.repository';

export interface QuizRepository {
  getById(id: string): Promise<TestDefinition | null>;
  list(): Promise<Array<{ meta: Pick<TestMeta, 'id' | 'title'> }>>;
}

export const getQuizRepository = (): QuizRepository => {
  return new FSQuizRepository();
};
