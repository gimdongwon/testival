import { describe, it, expect } from 'vitest';
import { score } from '@/lib/scoring';
import type { TestDefinition } from '@/domain/quiz.schema';

const makeWeightedDef = (
  resultTypes: string[],
  questions: TestDefinition['questions']
): TestDefinition => ({
  meta: {
    id: 'test-weighted',
    title: 'test',
    mode: 'weighted',
    resultTypes,
    locale: 'ko',
    version: 1,
    views: 0,
  },
  resultDetails: {},
  questions,
});

const makeAmountSumDef = (
  resultTypes: string[],
  questions: TestDefinition['questions'],
  brackets?: TestDefinition['scoring']
): TestDefinition => ({
  meta: {
    id: 'test-amount',
    title: 'test',
    mode: 'amount-sum',
    resultTypes,
    locale: 'ko',
    version: 1,
    views: 0,
  },
  resultDetails: {},
  questions,
  ...(brackets ? { scoring: brackets } : {}),
});

describe('scoring 로직 테스트', () => {
  describe('weighted 모드', () => {
    it('단일 문항에서 가장 높은 가중치 타입이 선택되어야 한다', () => {
      const def = makeWeightedDef(['A', 'B', 'C'], [
        {
          id: 'q1',
          title: '질문 1',
          choices: [
            { id: 'c1', label: '선택 1', weights: { A: 3, B: 1, C: 0 } },
            { id: 'c2', label: '선택 2', weights: { A: 0, B: 3, C: 1 } },
          ],
        },
      ]);

      const result = score(def, { q1: 'c1' });
      expect(result.top).toBe('A');
      expect(result.vector).toEqual({ A: 3, B: 1, C: 0 });
    });

    it('복수 문항의 가중치가 누적되어야 한다', () => {
      const def = makeWeightedDef(['A', 'B'], [
        {
          id: 'q1',
          title: '질문 1',
          choices: [
            { id: 'c1', label: '선택 1', weights: { A: 2, B: 1 } },
            { id: 'c2', label: '선택 2', weights: { A: 1, B: 2 } },
          ],
        },
        {
          id: 'q2',
          title: '질문 2',
          choices: [
            { id: 'c3', label: '선택 3', weights: { A: 3, B: 0 } },
            { id: 'c4', label: '선택 4', weights: { A: 0, B: 3 } },
          ],
        },
      ]);

      const result = score(def, { q1: 'c2', q2: 'c3' });
      expect(result.vector).toEqual({ A: 4, B: 2 });
      expect(result.top).toBe('A');
    });

    it('동점일 때 resultTypes 순서가 빠른 타입이 선택되어야 한다', () => {
      const def = makeWeightedDef(['A', 'B'], [
        {
          id: 'q1',
          title: '질문 1',
          choices: [
            { id: 'c1', label: '선택 1', weights: { A: 5, B: 5 } },
          ],
        },
      ]);

      const result = score(def, { q1: 'c1' });
      expect(result.top).toBe('A');
    });

    it('존재하지 않는 choice를 선택해도 에러가 발생하지 않아야 한다', () => {
      const def = makeWeightedDef(['A', 'B'], [
        {
          id: 'q1',
          title: '질문 1',
          choices: [
            { id: 'c1', label: '선택 1', weights: { A: 3, B: 1 } },
          ],
        },
      ]);

      const result = score(def, { q1: 'nonexistent' });
      expect(result.vector).toEqual({});
    });

    it('선택을 하지 않은 문항은 점수에 영향을 주지 않아야 한다', () => {
      const def = makeWeightedDef(['A', 'B'], [
        {
          id: 'q1',
          title: '질문 1',
          choices: [
            { id: 'c1', label: '선택 1', weights: { A: 3, B: 1 } },
          ],
        },
        {
          id: 'q2',
          title: '질문 2',
          choices: [
            { id: 'c2', label: '선택 2', weights: { A: 0, B: 5 } },
          ],
        },
      ]);

      const result = score(def, { q1: 'c1' });
      expect(result.vector).toEqual({ A: 3, B: 1 });
      expect(result.top).toBe('A');
    });
  });

  describe('amount-sum 모드 (커스텀 브라켓)', () => {
    it('합산 금액이 브라켓 범위에 맞는 결과 타입이 반환되어야 한다', () => {
      const def = makeAmountSumDef(
        ['grade_5', 'grade_4', 'grade_3', 'grade_2', 'grade_1'],
        [
          {
            id: 'q1',
            title: '질문 1',
            choices: [
              { id: 'c1', label: '선택 1', amount: 10 },
              { id: 'c2', label: '선택 2', amount: 0 },
            ],
          },
          {
            id: 'q2',
            title: '질문 2',
            choices: [
              { id: 'c3', label: '선택 3', amount: 10 },
              { id: 'c4', label: '선택 4', amount: 0 },
            ],
          },
        ],
        {
          amountSumBrackets: [
            { key: 'grade_5', min: 0, max: 0 },
            { key: 'grade_4', min: 10, max: 20 },
            { key: 'grade_3', min: 30, max: 40 },
            { key: 'grade_2', min: 50, max: 50 },
            { key: 'grade_1', min: 60, max: 60 },
          ],
        }
      );

      const result = score(def, { q1: 'c1', q2: 'c3' });
      expect(result.vector).toEqual({ totalAmount: 20 });
      expect(result.top).toBe('grade_4');
    });

    it('합산 0원일 때 가장 낮은 등급이 반환되어야 한다', () => {
      const def = makeAmountSumDef(
        ['grade_5', 'grade_4'],
        [
          {
            id: 'q1',
            title: '질문 1',
            choices: [
              { id: 'c1', label: '선택 1', amount: 0 },
              { id: 'c2', label: '선택 2', amount: 10 },
            ],
          },
        ],
        {
          amountSumBrackets: [
            { key: 'grade_5', min: 0, max: 0 },
            { key: 'grade_4', min: 10, max: 20 },
          ],
        }
      );

      const result = score(def, { q1: 'c1' });
      expect(result.vector).toEqual({ totalAmount: 0 });
      expect(result.top).toBe('grade_5');
    });

    it('브라켓에 매칭되지 않을 때 첫 번째 resultType으로 폴백되어야 한다', () => {
      const def = makeAmountSumDef(
        ['fallback', 'other'],
        [
          {
            id: 'q1',
            title: '질문 1',
            choices: [
              { id: 'c1', label: '선택 1', amount: 999 },
            ],
          },
        ],
        {
          amountSumBrackets: [
            { key: 'other', min: 0, max: 10 },
          ],
        }
      );

      const result = score(def, { q1: 'c1' });
      expect(result.top).toBe('fallback');
    });
  });

  describe('amount-sum 모드 (폴백 브라켓 — 잔소리 비용)', () => {
    it('합산 0 이하일 때 "zero"가 반환되어야 한다', () => {
      const def = makeAmountSumDef(
        ['zero', 'oneToThree', 'fourToFive', 'sixToNine', 'tenPlus'],
        [
          {
            id: 'q1',
            title: '질문 1',
            choices: [
              { id: 'c1', label: '선택 1', amount: -1 },
              { id: 'c2', label: '선택 2', amount: 0 },
            ],
          },
        ]
      );

      expect(score(def, { q1: 'c1' }).top).toBe('zero');
      expect(score(def, { q1: 'c2' }).top).toBe('zero');
    });

    it('합산 1~3일 때 "oneToThree"가 반환되어야 한다', () => {
      const def = makeAmountSumDef(
        ['zero', 'oneToThree', 'fourToFive', 'sixToNine', 'tenPlus'],
        [
          {
            id: 'q1',
            title: '질문 1',
            choices: [
              { id: 'c1', label: '선택 1', amount: 1 },
              { id: 'c2', label: '선택 2', amount: 3 },
            ],
          },
        ]
      );

      expect(score(def, { q1: 'c1' }).top).toBe('oneToThree');
      expect(score(def, { q1: 'c2' }).top).toBe('oneToThree');
    });

    it('합산 4~5일 때 "fourToFive"가 반환되어야 한다', () => {
      const def = makeAmountSumDef(
        ['zero', 'oneToThree', 'fourToFive', 'sixToNine', 'tenPlus'],
        [
          {
            id: 'q1',
            title: '질문 1',
            choices: [{ id: 'c1', label: '선택 1', amount: 2 }],
          },
          {
            id: 'q2',
            title: '질문 2',
            choices: [{ id: 'c2', label: '선택 2', amount: 2 }],
          },
        ]
      );

      expect(score(def, { q1: 'c1', q2: 'c2' }).top).toBe('fourToFive');
    });

    it('합산 6~9일 때 "sixToNine"이 반환되어야 한다', () => {
      const def = makeAmountSumDef(
        ['zero', 'oneToThree', 'fourToFive', 'sixToNine', 'tenPlus'],
        [
          {
            id: 'q1',
            title: '질문 1',
            choices: [{ id: 'c1', label: '선택 1', amount: 7 }],
          },
        ]
      );

      expect(score(def, { q1: 'c1' }).top).toBe('sixToNine');
    });

    it('합산 10 이상일 때 "tenPlus"가 반환되어야 한다', () => {
      const def = makeAmountSumDef(
        ['zero', 'oneToThree', 'fourToFive', 'sixToNine', 'tenPlus'],
        [
          {
            id: 'q1',
            title: '질문 1',
            choices: [{ id: 'c1', label: '선택 1', amount: 10 }],
          },
        ]
      );

      expect(score(def, { q1: 'c1' }).top).toBe('tenPlus');
    });
  });

  describe('실제 콘텐츠 기반 스코어링 검증', () => {
    it('yarr 퀴즈: 모든 최고 금액 선택 시 grade_1 (1등급)', async () => {
      const raw = await import('@/content/yarr/yarr.json');
      const def = (raw.default ?? raw) as unknown as TestDefinition;

      const allMaxSelections: Record<string, string> = {};
      for (const q of def.questions) {
        const maxChoice = q.choices.reduce((a, b) =>
          (a.amount ?? 0) >= (b.amount ?? 0) ? a : b
        );
        allMaxSelections[q.id] = maxChoice.id;
      }

      const result = score(def, allMaxSelections);
      expect(result.top).toBe('grade_1');
    });

    it('yarr 퀴즈: 모든 최저 금액 선택 시 grade_5 (5등급)', async () => {
      const raw = await import('@/content/yarr/yarr.json');
      const def = (raw.default ?? raw) as unknown as TestDefinition;

      const allMinSelections: Record<string, string> = {};
      for (const q of def.questions) {
        const minChoice = q.choices.reduce((a, b) =>
          (a.amount ?? 0) <= (b.amount ?? 0) ? a : b
        );
        allMinSelections[q.id] = minChoice.id;
      }

      const result = score(def, allMinSelections);
      expect(result.top).toBe('grade_5');
    });

    it('chuseok_money 퀴즈: 잔소리 선택지 결과가 유효한 resultType이어야 한다', async () => {
      const raw = await import('@/content/chuseok_money/chuseok_money.json');
      const def = (raw.default ?? raw) as unknown as TestDefinition;
      const validTypes = new Set(def.meta.resultTypes);

      const selections: Record<string, string> = {};
      for (const q of def.questions) {
        selections[q.id] = q.choices[0].id;
      }

      const result = score(def, selections);
      expect(validTypes.has(result.top)).toBe(true);
    });
  });
});
