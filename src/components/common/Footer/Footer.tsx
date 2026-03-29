import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.scss';

const FOOTER_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/terms', label: '이용약관' },
  { href: '/privacy', label: '개인정보처리방침' },
  { href: '/contact', label: 'Contact Us' },
] as const;

const SNS_LINKS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/testival.official/',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@testival.official',
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@testival.official',
  },
  {
    label: 'X',
    href: 'https://x.com/testival2025',
  },
] as const;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} aria-label='사이트 하단 정보'>
      <div className={styles.inner}>
        <nav className={styles.nav} aria-label='하단 메뉴'>
          <ul className={styles.linkList}>
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={styles.link}
                  tabIndex={0}
                  aria-label={`${link.label} 페이지로 이동`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.snsList}>
          {SNS_LINKS.map((sns) => (
            <a
              key={sns.label}
              href={sns.href}
              target='_blank'
              rel='noopener noreferrer'
              className={styles.snsLink}
              aria-label={`${sns.label} (새 탭에서 열림)`}
              tabIndex={0}
            >
              {sns.label}
            </a>
          ))}
        </div>

        <div className={styles.info}>
          <p className={styles.email}>
            문의:{' '}
            <a
              href='mailto:testival2025@gmail.com'
              className={styles.emailLink}
              aria-label='이메일로 문의하기'
            >
              testival2025@gmail.com
            </a>
          </p>
          <p className={styles.copyright}>
            &copy; {currentYear} Testival. All rights reserved.
          </p>
          <p className={styles.disclaimer}>
            본 사이트의 테스트 결과는 오락 목적으로만 제공되며, 전문적인 심리
            상담을 대체하지 않습니다.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
