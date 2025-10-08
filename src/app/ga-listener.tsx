'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? '';

const GAListener = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_ID) return;
    if (typeof window === 'undefined') return;
    if (typeof window.gtag !== 'function') return;

    const search = searchParams.toString();
    const pagePath = search ? `${pathname}?${search}` : pathname;

    window.gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: pagePath,
    } as unknown as Record<string, unknown>);
  }, [pathname, searchParams]);

  return null;
};

export default GAListener;
