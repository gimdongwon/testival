import { describe, it, expect, beforeEach } from 'vitest';
import { quizActions, useQuizView } from '@/store/quizStore';
import { renderHook, act } from '@testing-library/react';

describe('quizStore 테스트', () => {
  beforeEach(() => {
    quizActions.resetAll();
  });

  describe('start 액션', () => {
    it('start 호출 시 index가 0이고 selections가 빈 객체여야 한다', () => {
      quizActions.start('test-quiz');

      const { result } = renderHook(() => useQuizView('test-quiz'));
      expect(result.current.index).toBe(0);
      expect(result.current.selected).toEqual({});
    });

    it('이미 시작된 퀴즈에 대해 start를 다시 호출해도 상태가 유지되어야 한다', () => {
      quizActions.start('test-quiz');
      quizActions.choose('test-quiz', 'q1', 'c1');
      quizActions.next('test-quiz', 5);

      quizActions.start('test-quiz');

      const { result } = renderHook(() => useQuizView('test-quiz'));
      expect(result.current.index).toBe(0);
      expect(result.current.selected).toEqual({});
    });
  });

  describe('choose 액션', () => {
    it('선택지를 고르면 selections에 기록되어야 한다', () => {
      quizActions.start('test-quiz');
      quizActions.choose('test-quiz', 'q1', 'c2');

      const { result } = renderHook(() => useQuizView('test-quiz'));
      expect(result.current.selected).toEqual({ q1: 'c2' });
    });

    it('같은 문항의 선택을 변경하면 마지막 선택이 유지되어야 한다', () => {
      quizActions.start('test-quiz');
      quizActions.choose('test-quiz', 'q1', 'c1');
      quizActions.choose('test-quiz', 'q1', 'c3');

      const { result } = renderHook(() => useQuizView('test-quiz'));
      expect(result.current.selected).toEqual({ q1: 'c3' });
    });

    it('여러 문항의 선택이 독립적으로 기록되어야 한다', () => {
      quizActions.start('test-quiz');
      quizActions.choose('test-quiz', 'q1', 'c1');
      quizActions.choose('test-quiz', 'q2', 'c4');
      quizActions.choose('test-quiz', 'q3', 'c7');

      const { result } = renderHook(() => useQuizView('test-quiz'));
      expect(result.current.selected).toEqual({
        q1: 'c1',
        q2: 'c4',
        q3: 'c7',
      });
    });
  });

  describe('next / prev 액션', () => {
    it('next 호출 시 index가 1 증가해야 한다', () => {
      quizActions.start('test-quiz');
      quizActions.next('test-quiz', 5);

      const { result } = renderHook(() => useQuizView('test-quiz'));
      expect(result.current.index).toBe(1);
    });

    it('마지막 문항에서 next를 호출해도 index가 total-1을 초과하지 않아야 한다', () => {
      quizActions.start('test-quiz');
      quizActions.next('test-quiz', 3);
      quizActions.next('test-quiz', 3);
      quizActions.next('test-quiz', 3);
      quizActions.next('test-quiz', 3);

      const { result } = renderHook(() => useQuizView('test-quiz'));
      expect(result.current.index).toBe(2);
    });

    it('prev 호출 시 index가 1 감소해야 한다', () => {
      quizActions.start('test-quiz');
      quizActions.next('test-quiz', 5);
      quizActions.next('test-quiz', 5);
      quizActions.prev('test-quiz');

      const { result } = renderHook(() => useQuizView('test-quiz'));
      expect(result.current.index).toBe(1);
    });

    it('첫 문항에서 prev를 호출해도 index가 0 미만이 되지 않아야 한다', () => {
      quizActions.start('test-quiz');
      quizActions.prev('test-quiz');

      const { result } = renderHook(() => useQuizView('test-quiz'));
      expect(result.current.index).toBe(0);
    });
  });

  describe('resetTest 액션', () => {
    it('특정 퀴즈만 초기화되어야 한다', () => {
      quizActions.start('quiz-a');
      quizActions.start('quiz-b');
      quizActions.choose('quiz-a', 'q1', 'c1');
      quizActions.choose('quiz-b', 'q1', 'c2');
      quizActions.next('quiz-a', 5);
      quizActions.next('quiz-b', 5);

      quizActions.resetTest('quiz-a');

      const { result: resultA } = renderHook(() => useQuizView('quiz-a'));
      const { result: resultB } = renderHook(() => useQuizView('quiz-b'));

      expect(resultA.current.index).toBe(0);
      expect(resultA.current.selected).toEqual({});

      expect(resultB.current.index).toBe(1);
      expect(resultB.current.selected).toEqual({ q1: 'c2' });
    });
  });

  describe('resetAll 액션', () => {
    it('모든 퀴즈 상태가 초기화되어야 한다', () => {
      quizActions.start('quiz-a');
      quizActions.start('quiz-b');
      quizActions.choose('quiz-a', 'q1', 'c1');
      quizActions.choose('quiz-b', 'q1', 'c2');

      quizActions.resetAll();

      const { result: resultA } = renderHook(() => useQuizView('quiz-a'));
      const { result: resultB } = renderHook(() => useQuizView('quiz-b'));

      expect(resultA.current.index).toBe(0);
      expect(resultA.current.selected).toEqual({});
      expect(resultB.current.index).toBe(0);
      expect(resultB.current.selected).toEqual({});
    });
  });

  describe('복수 퀴즈 독립성', () => {
    it('서로 다른 퀴즈의 상태가 독립적으로 관리되어야 한다', () => {
      quizActions.start('quiz-a');
      quizActions.start('quiz-b');

      quizActions.choose('quiz-a', 'q1', 'c1');
      quizActions.next('quiz-a', 5);
      quizActions.next('quiz-a', 5);

      quizActions.choose('quiz-b', 'q1', 'c99');

      const { result: resultA } = renderHook(() => useQuizView('quiz-a'));
      const { result: resultB } = renderHook(() => useQuizView('quiz-b'));

      expect(resultA.current.index).toBe(2);
      expect(resultA.current.selected).toEqual({ q1: 'c1' });

      expect(resultB.current.index).toBe(0);
      expect(resultB.current.selected).toEqual({ q1: 'c99' });
    });
  });

  describe('useQuizView 기본값', () => {
    it('시작하지 않은 퀴즈의 index는 0이어야 한다', () => {
      const { result } = renderHook(() => useQuizView('unknown-quiz'));
      expect(result.current.index).toBe(0);
    });

    it('시작하지 않은 퀴즈의 selected는 빈 불변 객체여야 한다', () => {
      const { result } = renderHook(() => useQuizView('unknown-quiz'));
      expect(result.current.selected).toEqual({});
      expect(Object.isFrozen(result.current.selected)).toBe(true);
    });
  });
});
