import React from 'react';
import Link from 'next/link';
import styles from './Header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.divider} />
      <Link href='/'>
        <h1 className={styles.title}>
          <b style={{ color: '#FB2575' }}>T</b>ESTIVAL
        </h1>
      </Link>
      <div className={styles.divider} />
    </header>
  );
};

export default Header;
