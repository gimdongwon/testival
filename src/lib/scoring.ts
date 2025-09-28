// src/lib/scoring.ts
import type { TestDefinition } from '@/domain/quiz.schema';

export function score(def: TestDefinition, selected: Record<string, string>) {
  // weighted 전제
  const acc: Record<string, number> = {};
  for (const q of def.questions) {
    const choiceId = selected[q.id];
    const choice = q.choices.find((c) => c.id === choiceId);
    if (!choice?.weights) continue;
    for (const [k, v] of Object.entries(choice.weights)) {
      acc[k] = (acc[k] ?? 0) + v;
    }
  }

  // 동률 시 resultTypes 순서를 우선순위로 사용(안정적)
  const order = def.meta.resultTypes;
  const top = order
    .slice()
    .sort(
      (a, b) =>
        (acc[b] ?? 0) - (acc[a] ?? 0) || order.indexOf(a) - order.indexOf(b)
    )[0];

  return { vector: acc, top };
}
