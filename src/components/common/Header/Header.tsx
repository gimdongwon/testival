'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Header.module.scss';

type HeaderVariant = 'home' | 'quiz';

type HeaderProps = Readonly<{
  variant?: HeaderVariant;
}>;

const Header = ({ variant = 'home' }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const handleToggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseMenu();
        buttonRef.current?.focus();
      }
    },
    [handleCloseMenu]
  );

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        handleCloseMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, handleCloseMenu]);

  useEffect(() => {
    handleCloseMenu();
  }, [pathname, handleCloseMenu]);

  const navLinks = [
    { href: '/', label: '홈' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/terms', label: '이용약관' },
    { href: '/privacy', label: '개인정보처리방침' },
  ];

  if (variant === 'quiz') {
    return (
      <header
        className={`${styles.header} ${styles.headerQuiz}`}
        aria-label='테스트 상단 헤더'
      >
        <div className={styles.innerQuiz}>
          <Link href='/' aria-label='홈으로 이동' tabIndex={0}>
            <Image
              src='/images/quiz/common/Logo.svg'
              alt='Testival'
              width={120}
              height={24}
              priority
              className={styles.logo}
            />
          </Link>

          <button
            ref={buttonRef}
            className={styles.hamburger}
            onClick={handleToggleMenu}
            aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={isMenuOpen}
            aria-controls='nav-menu'
            tabIndex={0}
          >
            <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ''}`} />
            <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ''}`} />
            <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ''}`} />
          </button>
        </div>

        {isMenuOpen && <div className={styles.overlay} onClick={handleCloseMenu} />}

        <nav
          id='nav-menu'
          ref={menuRef}
          className={`${styles.menu} ${isMenuOpen ? styles.menuOpen : ''}`}
          role='navigation'
          aria-label='사이트 메뉴'
          onKeyDown={handleKeyDown}
        >
          <ul className={styles.menuList}>
            {navLinks.map((link) => (
              <li key={link.href} className={styles.menuItem}>
                <Link
                  href={link.href}
                  className={`${styles.menuLink} ${pathname === link.href ? styles.menuLinkActive : ''}`}
                  tabIndex={isMenuOpen ? 0 : -1}
                  aria-label={`${link.label} 페이지로 이동`}
                  aria-current={pathname === link.href ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    );
  }

  return (
    <header className={styles.header} aria-label='상단 헤더'>
      <div className={styles.divider} />
      <Link href='/' aria-label='홈으로 이동' tabIndex={0}>
        <Image
          src='/images/quiz/common/Logo.svg'
          alt='Testival'
          width={120}
          height={24}
          priority
          className={styles.logo}
        />
      </Link>
      <div className={styles.divider} />

      <button
        ref={buttonRef}
        className={styles.hamburger}
        onClick={handleToggleMenu}
        aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
        aria-expanded={isMenuOpen}
        aria-controls='nav-menu'
        tabIndex={0}
      >
        <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ''}`} />
        <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ''}`} />
        <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ''}`} />
      </button>

      {isMenuOpen && <div className={styles.overlay} onClick={handleCloseMenu} />}

      <nav
        id='nav-menu'
        ref={menuRef}
        className={`${styles.menu} ${isMenuOpen ? styles.menuOpen : ''}`}
        role='navigation'
        aria-label='사이트 메뉴'
        onKeyDown={handleKeyDown}
      >
        <ul className={styles.menuList}>
          {navLinks.map((link) => (
            <li key={link.href} className={styles.menuItem}>
              <Link
                href={link.href}
                className={`${styles.menuLink} ${pathname === link.href ? styles.menuLinkActive : ''}`}
                tabIndex={isMenuOpen ? 0 : -1}
                aria-label={`${link.label} 페이지로 이동`}
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
