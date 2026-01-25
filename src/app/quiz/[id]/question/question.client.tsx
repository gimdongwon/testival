// app/quiz/[id]/question/question.client.tsx
'use client';

import { useEffect, useMemo } from 'react';
import type { CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import type { TestDefinition } from '@/domain/quiz.schema';
import { getQuestionUIConfig } from '@/domain/quiz.schema';
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

  // JSON UI 설정 - 타입 안전하게 가져오기
  const qUi = getQuestionUIConfig(def);
  
  const optionClassName =
    qUi.optionVariant === 'chuseokDark'
      ? questionCardStyles.optionChuseokDark
      : qUi.optionVariant === 'dark'
      ? questionCardStyles.optionDark
      : questionCardStyles.optionLight;
  const questionTextColor = qUi.questionTextColor ?? '#000';
  const questionFontFamily = qUi.questionFontFamily;
  const questionNumberStyle = qUi.questionNumberStyle as CSSProperties | undefined;
  const questionTitleStyle = qUi.questionTitleStyle as CSSProperties | undefined;
  const hideQuestionNumberDot = qUi.hideQuestionNumberDot ?? false;
  const hideOptionLabel = qUi.hideOptionLabel ?? false;
  const optionColors = qUi.optionColors;
  const optionTextStyle = qUi.optionTextStyle as CSSProperties | undefined;
  // optionLabelStyle이 없으면 optionTextStyle을 폴백으로 사용
  const optionLabelStyle = (qUi.optionLabelStyle ?? qUi.optionTextStyle) as CSSProperties | undefined;
  const optionFontFamily = qUi.optionFontFamily;

  const progressStyle: CSSProperties &
    Record<'--progress' | '--progress-fill-color', string> = {
    ['--progress']: `${progressPercent}%`,
    ['--progress-fill-color']: qUi.progressFillColor ?? '#555',
  };

  // JSON 설정에서 columns 가져오기 (기본값: 1)
  // 2지선다의 경우 자동으로 2컬럼 적용 가능하도록 fallback 로직 포함
  const columns = qUi.columns ?? (options.length === 2 ? 1 : 1);

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
          questionNumberStyle={questionNumberStyle}
          questionTitleStyle={questionTitleStyle}
          hideQuestionNumberDot={hideQuestionNumberDot}
          hideOptionLabel={hideOptionLabel}
          optionColors={optionColors}
          optionTextStyle={optionTextStyle}
          optionLabelStyle={optionLabelStyle}
          columns={columns}
          optionFontFamily={optionFontFamily}
        />
      </div>
    </>
  );
}
