import React from 'react';
import Link from 'next/link';
import styles from './detail.module.scss';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getQuizRepository } from '@/infrastructure/quiz.repository';

const DetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const repo = getQuizRepository();
  const { id } = await params;
  const def = await repo.getById(id);
  if (!def) return notFound();
  // id별 버튼 색상 분기(확장 용이)
  const variantById: Record<string, 'black' | 'white'> = {
    chuseok: 'black',
    chuseok_money: 'white',
  };
  const variantClass =
    variantById[id] === 'white' ? styles.whiteBtn : styles.blackBtn;

  return (
    <main aria-label='메인비주얼' className={styles.landingMain}>
      <Image
        src={`/images/quiz/${id}/main.png`}
        width={720}
        height={1280}
        alt=''
        className={styles.heroBg}
      />
      <div className={styles.warpper}>
        <Link
          href={`/quiz/${id}/question`}
          aria-label='테스트 시작하기'
          role='button'
          className={`${styles.primaryLinkBtn} ${variantClass}`}
        >
          테스트 시작하기
        </Link>
      </div>
    </main>
  );
};

export default DetailPage;
