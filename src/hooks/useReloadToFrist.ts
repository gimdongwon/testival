// src/hooks/useReloadToFirst.ts
'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export function useReloadToFirst() {
  const router = useRouter();
  const { id, pageNum } = useParams<{ id: string; pageNum?: string }>();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 표준
    const navEntry = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined;
    const isReloadStd = navEntry?.type === 'reload';

    // 레거시(일부 사파리)
    // 타입 안전하게 접근 (PerformanceNavigation이 존재하는지 확인)
    const legacyNavigation = (
      window.performance as Performance & { navigation?: PerformanceNavigation }
    ).navigation;
    const isReloadLegacy = !!legacyNavigation && legacyNavigation.type === 1; // 1 === TYPE_RELOAD

    const isReload = isReloadStd || isReloadLegacy;

    // pageNum이 존재하고, 새로고침이며, 1페이지가 아니라면 → 1페이지로
    if (pageNum && isReload && pageNum !== '1') {
      router.replace(`/quiz/${id}`);
    }
  }, [router, id, pageNum]);
}
