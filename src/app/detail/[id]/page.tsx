import React from 'react';
import Link from 'next/link';
import styles from './detail.module.scss';
import Image from 'next/image';

type DetailPageProps = {
  params: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

const DetailPage = ({ params }: DetailPageProps) => {
  const { id } = params;

  if (!id) {
    return <div role='alert'>잘못된 접근입니다.</div>;
  }

  return (
    <main aria-label='메인비주얼' className={styles.landingMain}>
      <Image
        src='/main.png'
        width={720}
        height={1280}
        alt=''
        className={styles.heroBg}
      />
      <div className={styles.warpper}>
        <Link
          href='/question'
          aria-label='테스트 시작하기'
          role='button'
          className={styles.primaryLinkBtn}
        >
          테스트 시작하기
        </Link>
      </div>
    </main>
  );
};

export default DetailPage;
