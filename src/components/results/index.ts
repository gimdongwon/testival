import type { ComponentType } from 'react';
import type { ResultLayout } from '@/domain/quiz.schema';
import type { ResultLayoutProps } from './ClassicResult';

import ClassicResult from './ClassicResult';
import SpringResult from './SpringResult';
import GradeResult from './GradeResult';
import GoodBoyfriendResult from './new/GoodBoyfriendResult';

export type { ResultLayoutProps };

/**
 * resultLayout 값 → 결과 레이아웃 컴포넌트 매핑
 *
 * 새로운 레이아웃을 추가할 때 이 레지스트리에 등록하면 됩니다.
 */
export const RESULT_LAYOUTS: Record<ResultLayout, ComponentType<ResultLayoutProps>> = {
  classic: ClassicResult,
  spring: SpringResult,
  grade: GradeResult,
  goodboyfriend: GoodBoyfriendResult,
};

/**
 * config.resultLayout 값으로 적절한 Result 컴포넌트를 반환합니다.
 * 값이 없거나 매핑이 없으면 ClassicResult를 사용합니다.
 */
export function getResultComponent(layout?: ResultLayout): ComponentType<ResultLayoutProps> {
  if (!layout) return ClassicResult;
  return RESULT_LAYOUTS[layout] ?? ClassicResult;
}
