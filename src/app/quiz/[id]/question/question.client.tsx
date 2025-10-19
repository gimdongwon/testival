// app/quiz/[id]/question/question.client.tsx
'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { TestDefinition } from '@/domain/quiz.schema';
import QuestionCard, {
  QuestionOption,
} from '@/components/common/QuestionCard/QuestionCard';
import questionCardStyles from '@/components/common/QuestionCard/QuestionCard.module.scss';
import { useQuizView, quizActions } from '@/store/quizStore';

const LABELS = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.'];

export default function QuizQuestionClient({ def }: { def: TestDefinition }) {
  const router = useRouter();
  const testId = def.meta.id;

  const { index } = useQuizView(testId);

  useEffect(() => {
    // 정책: 진입/리로드 시 처음부터
    quizActions.start(testId);
  }, [testId]);

  const total = def.questions.length;
  const q = def.questions[index];

  const options: QuestionOption[] = useMemo(
    () =>
      q.choices.map((c, i) => ({
        id: c.id,
        label: LABELS[i] ?? '',
        text: c.label,
      })),
    [q.choices]
  );

  const handleSelect = (choiceId: string) => {
    quizActions.choose(testId, q.id, choiceId);
    if (index === total - 1) router.push(`/quiz/${testId}/loading`);
    else quizActions.next(testId, total);
  };

  // 테스트별 옵션 버튼 테마 클래스 분기(인라인 스타일 제거)
  const optionClassById: Record<string, string> = {
    chuseok: questionCardStyles.optionChuseokDark,
    chuseok_money: questionCardStyles.optionDark,
  };
  const optionClassName =
    optionClassById[testId] ?? questionCardStyles.optionLight;

  // 페이지별 질문 텍스트 색상/폰트 매핑
  const questionTextColorById: Record<string, string> = {
    seat: '#fff',
  };
  const questionFontById: Record<string, string | undefined> = {
    seat: 'WAGURI',
  };
  const questionTextColor = questionTextColorById[testId] ?? '#000';
  const questionFontFamily = questionFontById[testId];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <QuestionCard
        number={index + 1}
        title={q.title}
        options={options}
        onSelect={handleSelect}
        optionClassName={optionClassName}
        questionTextColor={questionTextColor}
        questionFontFamily={questionFontFamily}
      />
    </div>
  );
}
