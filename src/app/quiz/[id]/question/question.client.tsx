// app/quiz/[id]/question/question.client.tsx
'use client';

import { useEffect, useMemo } from 'react';
import type { CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import type { TestDefinition } from '@/domain/quiz.schema';
import QuestionCard, {
  QuestionOption,
} from '@/components/common/QuestionCard/QuestionCard';
import questionCardStyles from '@/components/common/QuestionCard/QuestionCard.module.scss';
import { useQuizView, quizActions } from '@/store/quizStore';
import styles from './question.module.scss';

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

  const currentStep = index + 1;
  const progressPercent = Math.round((currentStep / total) * 100);

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

  // JSON UI 설정 기반 옵션/질문 스타일
  const qUi =
    (
      def as unknown as {
        ui?: {
          question?: {
            optionVariant?: 'light' | 'dark' | 'chuseokDark';
            questionTextColor?: string;
            questionFontFamily?: string;
            optionFontFamily?: string;
            progressFillColor?: string;
            questionNumberStyle?: CSSProperties;
            questionTitleStyle?: CSSProperties;
            optionLabelStyle?: CSSProperties;
          };
        };
      }
    ).ui?.question ?? {};
  const optionClassName =
    qUi.optionVariant === 'chuseokDark'
      ? questionCardStyles.optionChuseokDark
      : qUi.optionVariant === 'dark'
      ? questionCardStyles.optionDark
      : questionCardStyles.optionLight;
  const questionTextColor = qUi.questionTextColor ?? '#000';
  const questionFontFamily = qUi.questionFontFamily;
  const optionFontFamily = qUi.optionFontFamily;
  const questionNumberStyle = qUi.questionNumberStyle;
  const questionTitleStyle = qUi.questionTitleStyle;
  const optionLabelStyle = qUi.optionLabelStyle;

  const progressStyle: CSSProperties &
    Record<'--progress' | '--progress-fill-color', string> = {
    ['--progress']: `${progressPercent}%`,
    ['--progress-fill-color']: qUi.progressFillColor ?? '#555',
  };

  // classroom 콘텐츠는 2지선다형 UI를 사용(확장 가능하도록 조건 기반)
  const isTwoChoiceGrid =
    def.meta.id === 'classroom' &&
    Array.isArray(options) &&
    options.length === 2;

  return (
    <>
      <div
        className={styles.progress}
        role='progressbar'
        aria-label='퀴즈 진행도'
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={currentStep}
        tabIndex={0}
      >
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={progressStyle} />
        </div>
      </div>
      <div className={styles.contentContainer}>
        <QuestionCard
          number={currentStep}
          title={q.title}
          options={options}
          onSelect={handleSelect}
          optionClassName={optionClassName}
          questionTextColor={questionTextColor}
          questionFontFamily={questionFontFamily}
          columns={isTwoChoiceGrid ? 2 : 1}
          optionFontFamily={optionFontFamily}
          questionNumberStyle={questionNumberStyle}
          questionTitleStyle={questionTitleStyle}
          optionLabelStyle={optionLabelStyle}
        />
      </div>
    </>
  );
}
