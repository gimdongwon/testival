import type { ResultDetail, ResultUIConfig } from '@/domain/quiz.schema';

/** 모든 결과 레이아웃 컴포넌트가 받는 공통 props */
export type ResultLayoutProps = {
  result: ResultDetail;
  config: ResultUIConfig;
  scoreLabel?: string;
};
