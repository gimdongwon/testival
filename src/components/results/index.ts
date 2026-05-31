import type { ComponentType } from 'react';
import type { ResultLayout } from '@/domain/quiz.schema';

import ClassicResult from './classic/ClassicResult';
import SpringResult from './spring/SpringResult';
import GradeResult from './grade/GradeResult';
import GoodBoyfriendResult from './new/goodboyfriend/GoodBoyfriendResult';
import Young40Result from './new/young40/Young40Result';
import SoloEscapeResult from './soloescape/SoloEscapeResult';
import EolppaResult from './eolppa/EolppaResult';
import type { ResultLayoutProps } from './types';

export type { ResultLayoutProps } from './types';

/**
 * resultLayout 값 → 결과 레이아웃 컴포넌트 매핑
 *
 * 디렉터리: classic/ · spring/ · grade/ · soloescape/ · new/<퀴즈>/ (구 커스텀)
 * 새 커스텀 레이아웃은 results/ 바로 아래에 폴더를 만든 뒤 여기에 등록합니다.
 */
export const RESULT_LAYOUTS: Record<ResultLayout, ComponentType<ResultLayoutProps>> = {
  classic: ClassicResult,
  spring: SpringResult,
  grade: GradeResult,
  goodboyfriend: GoodBoyfriendResult,
  young40: Young40Result,
  soloescape: SoloEscapeResult,
  eolppa: EolppaResult,
};

/**
 * config.resultLayout 값으로 적절한 Result 컴포넌트를 반환합니다.
 * 값이 없거나 매핑이 없으면 ClassicResult를 사용합니다.
 */
export function getResultComponent(layout?: ResultLayout): ComponentType<ResultLayoutProps> {
  if (!layout) return ClassicResult;
  return RESULT_LAYOUTS[layout] ?? ClassicResult;
}
