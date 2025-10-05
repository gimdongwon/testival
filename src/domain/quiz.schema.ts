// src/domain/quiz.schema.ts
import { z } from 'zod';

/** 선택지 */
export const ChoiceZ = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  // weighted 모드에서 쓰는 가중치: { 타입키: 숫자 }
  weights: z.record(z.string(), z.number()).optional(),
  // type-count 모드 대비 확장용(현재 데이터에는 없음)
  mapType: z.string().optional(),
  // amount-sum 모드에서 쓰는 금액(만원 단위, 음수 허용)
  amount: z.number().optional(),
});

/** 문항 */
export const QuestionZ = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  choices: z
    .array(ChoiceZ)
    .min(2, '각 문항은 최소 2개 이상의 선택지가 필요합니다.'),
});

/** 결과 상세(결과 페이지 전용) */
export const ResultDetailZ = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.string().min(1), // 예: "/images/quiz/chuseok-basic/result_1.png"
  keywords: z.array(z.string().min(1)).min(1).max(10).default([]),
  type: z.string().min(1),
});

/** 메타정보 */
export const TestMetaZ = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  mode: z.enum(['weighted', 'type-count', 'amount-sum']),
  resultTypes: z.array(z.string().min(1)).min(2),
  thumbnail: z.string().optional(),
  locale: z.string().default('ko'),
  version: z.number().int().positive().default(1),
});

/** 전체 테스트 정의 */
export const TestDefinitionZ = z
  .object({
    meta: TestMetaZ,
    // 결과 페이지용 상세 정보(타입 키 → 상세)
    resultDetails: z.record(z.string(), ResultDetailZ).default({}),
    // 짧은 카피(선택): 타입 키 → 짧은 문구
    messages: z.record(z.string(), z.string()).optional(),
    questions: z.array(QuestionZ).min(1, '최소 1개 이상의 문항이 필요합니다.'),
  })
  .superRefine((data, ctx) => {
    const resultTypes = new Set(data.meta.resultTypes);

    // 1) resultDetails의 키는 모두 resultTypes 안에 있어야 함
    for (const key of Object.keys(data.resultDetails ?? {})) {
      if (!resultTypes.has(key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `resultDetails 키 "${key}"는 meta.resultTypes에 존재하지 않습니다.`,
          path: ['resultDetails', key],
        });
      }
    }

    // 2) messages의 키도 resultTypes 안에 있어야 함(있다면)
    if (data.messages) {
      for (const key of Object.keys(data.messages)) {
        if (!resultTypes.has(key)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `messages 키 "${key}"는 meta.resultTypes에 존재하지 않습니다.`,
            path: ['messages', key],
          });
        }
      }
    }

    // 3) weighted 모드일 때, 모든 선택지 weights의 키는 resultTypes 안에 있어야 함
    if (data.meta.mode === 'weighted') {
      data.questions.forEach((q, qi) => {
        q.choices.forEach((c, ci) => {
          if (c.weights) {
            for (const k of Object.keys(c.weights)) {
              if (!resultTypes.has(k)) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: `weights 키 "${k}"는 meta.resultTypes에 존재하지 않습니다.`,
                  path: ['questions', qi, 'choices', ci, 'weights', k],
                });
              }
            }
          }
        });
      });
    }

    // 4) type-count 모드(향후 확장)에서 mapType 사용 시 검증
    if (data.meta.mode === 'type-count') {
      data.questions.forEach((q, qi) => {
        q.choices.forEach((c, ci) => {
          if (!c.mapType) return; // optional
          if (!resultTypes.has(c.mapType)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `mapType "${c.mapType}"는 meta.resultTypes에 존재하지 않습니다.`,
              path: ['questions', qi, 'choices', ci, 'mapType'],
            });
          }
        });
      });
    }

    // 5) amount-sum 모드에서 amount 필수 검증
    if (data.meta.mode === 'amount-sum') {
      data.questions.forEach((q, qi) => {
        q.choices.forEach((c, ci) => {
          if (typeof c.amount !== 'number') {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message:
                'amount-sum 모드에서는 모든 선택지에 amount(숫자)가 필요합니다.',
              path: ['questions', qi, 'choices', ci, 'amount'],
            });
          }
        });
      });
    }
  });

/** 타입 추론 */
export type Choice = z.infer<typeof ChoiceZ>;
export type Question = z.infer<typeof QuestionZ>;
export type ResultDetail = z.infer<typeof ResultDetailZ>;
export type TestMeta = z.infer<typeof TestMetaZ>;
export type TestDefinition = z.infer<typeof TestDefinitionZ>;
