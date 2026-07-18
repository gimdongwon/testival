import React from 'react';
import Link from 'next/link';
import styles from './RelatedLinks.module.scss';

export interface RelatedLinkItem {
  href: string;
  label: string;
  sub?: string;
}

interface RelatedLinksProps {
  title: string;
  links: RelatedLinkItem[];
  /** 목록 아래에 표시할 "더보기" 링크 (선택) */
  moreHref?: string;
  moreLabel?: string;
}

/**
 * 내부 링크(관련 테스트 / 관련 가이드 등)를 시맨틱 목록으로 렌더한다.
 * 크롤러가 페이지 간 링크를 따라갈 수 있게 해 색인 발견성을 높이는 것이 목적.
 */
export default function RelatedLinks({
  title,
  links,
  moreHref,
  moreLabel,
}: RelatedLinksProps) {
  if (links.length === 0) return null;
  return (
    <nav className={styles.related} aria-label={title}>
      <h2 className={styles.title}>{title}</h2>
      <ul className={styles.list}>
        {links.map((l) => (
          <li key={l.href} className={styles.item}>
            <Link href={l.href} className={styles.link}>
              <span className={styles.label}>{l.label}</span>
              {l.sub && <span className={styles.sub}>{l.sub}</span>}
            </Link>
          </li>
        ))}
      </ul>
      {moreHref && (
        <Link href={moreHref} className={styles.more}>
          {moreLabel ?? '더보기'}
        </Link>
      )}
    </nav>
  );
}
