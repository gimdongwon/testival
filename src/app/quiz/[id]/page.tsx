import React from 'react';
import Link from 'next/link';
import styles from './detail.module.scss';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getQuizRepository } from '@/infrastructure/quiz.repository';

const DetailPage = async ({ params }: { params: { id: string } }) => {
  const repo = getQuizRepository();
  const def = await repo.getById(params.id);
  if (!def) return notFound();
  return (
    <main aria-label='메인비주얼' className={styles.landingMain}>
      <Image
        src='/images/quiz/chuseok/main.png'
        width={720}
        height={1280}
        alt=''
        className={styles.heroBg}
      />
      <div className={styles.warpper}>
        <Link
          href={`/quiz/${params.id}/question`}
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
