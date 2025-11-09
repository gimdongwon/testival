import React from 'react';
import Link from 'next/link';
import styles from './detail.module.scss';
import { notFound } from 'next/navigation';
import { getQuizRepository } from '@/infrastructure/quiz.repository';
import MainImageSlide from '@/components/MainImageSlide/MainImageSlide';
import fs from 'fs';
import path from 'path';

const DetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const repo = getQuizRepository();
  const { id } = await params;
  const def = await repo.getById(id);
  if (!def) return notFound();
  // JSON UI 설정 기반 버튼 색상
  const buttonTheme =
    (
      def as unknown as {
        ui?: { landing?: { buttonTheme?: 'black' | 'white' } };
      }
    ).ui?.landing?.buttonTheme ?? 'black';
  const variantClass =
    buttonTheme === 'white' ? styles.whiteBtn : styles.blackBtn;

  const dir = path.join(process.cwd(), 'public', 'images', 'quiz', id);
  let images: string[] = [];
  try {
    const files = fs.readdirSync(dir);
    images = files
      .filter((file) => /^main(\d*)\.png$/.test(file))
      .sort((a, b) => {
        const numA =
          a === 'main.png'
            ? 0
            : parseInt(a.match(/^main(\d+)\.png$/)?.[1] || '0');
        const numB =
          b === 'main.png'
            ? 0
            : parseInt(b.match(/^main(\d+)\.png$/)?.[1] || '0');
        return numA - numB;
      })
      .map((file) => `/images/quiz/${id}/${file}`);
  } catch {
    // 디렉토리 없을 때는 기본 main.png만
    images = [`/images/quiz/${id}/main.png`];
  }
  return (
    <main aria-label='메인비주얼' className={styles.landingMain}>
      <MainImageSlide id={id} images={images} />
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
