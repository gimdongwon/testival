// src/store/quizStore.ts
'use client';

import { create } from 'zustand';

const EMPTY_SELECTIONS: Readonly<Record<string, string>> = Object.freeze({});

type Indices = Record<string, number>;
type Selections = Record<string, Record<string, string>>;

type QuizState = {
  indices: Indices;
  selections: Selections;
};

type QuizActions = {
  start: (testId: string) => void;
  choose: (testId: string, qId: string, cId: string) => void;
  next: (testId: string, total: number) => void;
  prev: (testId: string) => void;
  resetTest: (testId: string) => void;
  resetAll: () => void;
};

export const useQuizStore = create<QuizState & QuizActions>((set) => ({
  indices: {},
  selections: {},

  start: (testId) =>
    set((s) => {
      // 이미 시작 상태면 변경 없음(불필요한 업데이트 방지)
      if (s.indices[testId] === 0 && s.selections[testId]) return s;
      return {
        indices: { ...s.indices, [testId]: 0 },
        selections: { ...s.selections, [testId]: {} },
      };
    }),

  choose: (testId, qId, cId) =>
    set((s) => ({
      selections: {
        ...s.selections,
        [testId]: { ...(s.selections[testId] ?? EMPTY_SELECTIONS), [qId]: cId },
      },
    })),

  next: (testId, total) =>
    set((s) => {
      const cur = s.indices[testId] ?? 0;
      const next = Math.min(cur + 1, total - 1);
      if (next === cur) return s;
      return { indices: { ...s.indices, [testId]: next } };
    }),

  prev: (testId) =>
    set((s) => {
      const cur = s.indices[testId] ?? 0;
      const prev = Math.max(cur - 1, 0);
      if (prev === cur) return s;
      return { indices: { ...s.indices, [testId]: prev } };
    }),

  resetTest: (testId) =>
    set((s) => ({
      indices: { ...s.indices, [testId]: 0 },
      selections: { ...s.selections, [testId]: {} },
    })),

  resetAll: () => set({ indices: {}, selections: {} }),
}));

/** 상태만 구독(참조 안정) */
export function useQuizView(testId: string) {
  const index = useQuizStore((s) => s.indices[testId] ?? 0);
  const selected = useQuizStore(
    (s) => s.selections[testId] ?? EMPTY_SELECTIONS
  );
  return { index, selected };
}

/** 액션은 getState() 경유(참조 안정, 리렌더 유발 X) */
export const quizActions = {
  start: (testId: string) => useQuizStore.getState().start(testId),
  choose: (testId: string, qId: string, cId: string) =>
    useQuizStore.getState().choose(testId, qId, cId),
  next: (testId: string, total: number) =>
    useQuizStore.getState().next(testId, total),
  prev: (testId: string) => useQuizStore.getState().prev(testId),
  resetTest: (testId: string) => useQuizStore.getState().resetTest(testId),
  resetAll: () => useQuizStore.getState().resetAll(),
};
