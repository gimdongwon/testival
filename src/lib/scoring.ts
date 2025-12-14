// src/lib/scoring.ts
import type { TestDefinition } from '@/domain/quiz.schema';

export function score(def: TestDefinition, selected: Record<string, string>) {
  if (def.meta.mode === 'amount-sum') {
    let totalAmount = 0;
    for (const q of def.questions) {
      const choiceId = selected[q.id];
      const choice = q.choices.find((c) => c.id === choiceId);
      if (!choice) continue;
      if (typeof choice.amount === 'number') {
        totalAmount += choice.amount;
      }
    }

    // 콘텐츠별 브라켓 매핑(있으면 우선 적용)
    const brackets = (
      def as unknown as {
        scoring?: {
          amountSumBrackets?: Array<{
            key: string;
            min?: number;
            max?: number;
          }>;
        };
      }
    ).scoring?.amountSumBrackets;

    if (Array.isArray(brackets) && brackets.length > 0) {
      const matched = brackets.find((b) => {
        const minOk = typeof b.min === 'number' ? totalAmount >= b.min : true;
        const maxOk = typeof b.max === 'number' ? totalAmount <= b.max : true;
        return minOk && maxOk;
      });
      const top = matched?.key ?? def.meta.resultTypes[0];
      return { vector: { totalAmount }, top };
    }

    // 폴백: 기존(잔소리 비용) 브라켓 매핑(만원 단위)
    const bracket =
      totalAmount <= 0
        ? 'zero'
        : totalAmount <= 3
        ? 'oneToThree'
        : totalAmount <= 5
        ? 'fourToFive'
        : totalAmount <= 9
        ? 'sixToNine'
        : 'tenPlus';

    return { vector: { totalAmount }, top: bracket };
  }

  // weighted 전제(기존 동작 유지)
  const acc: Record<string, number> = {};
  for (const q of def.questions) {
    const choiceId = selected[q.id];
    const choice = q.choices.find((c) => c.id === choiceId);
    if (!choice?.weights) continue;
    for (const [k, v] of Object.entries(choice.weights)) {
      acc[k] = (acc[k] ?? 0) + v;
    }
  }

  const order = def.meta.resultTypes;
  const top = order
    .slice()
    .sort(
      (a, b) =>
        (acc[b] ?? 0) - (acc[a] ?? 0) || order.indexOf(a) - order.indexOf(b)
    )[0];

  return { vector: acc, top };
}
