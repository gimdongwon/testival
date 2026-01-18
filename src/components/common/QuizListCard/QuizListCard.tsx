import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './QuizListCard.module.scss';

interface QuizListCardProps {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
}

const QuizListCard: React.FC<QuizListCardProps> = ({
  id,
  title,
  thumbnail,
  views,
}) => {
  return (
    <Link
      href={`/quiz/${id}`}
      className={styles.card}
      tabIndex={0}
      aria-label={`${title} 퀴즈로 이동`}
    >
      <div className={styles.thumbnailWrapper}>
        <Image
          src={thumbnail}
          alt={title}
          width={160}
          height={160}
          className={styles.thumbnail}
          loading="lazy"
          quality={80}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
          sizes="160px"
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.participants}>
          <span className={styles.playIcon}>▷</span>
          <span className={styles.count}>{views.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
};

export default QuizListCard;
