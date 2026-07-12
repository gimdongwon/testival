import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import QuizListCard from '@/components/common/QuizListCard';
import type { HomeCategory } from '@/lib/homeCategories';
import styles from './HomeCategorySection.module.scss';

export interface HomeCategoryItem {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
}

interface HomeCategorySectionProps {
  category: HomeCategory;
  items: HomeCategoryItem[];
  /** SEO/접근성용 제목 태그 레벨 (기본 h2) */
  headingLevel?: 'h1' | 'h2';
}

const BLUR =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';

const HomeCategorySection: React.FC<HomeCategorySectionProps> = ({
  category,
  items,
  headingLevel = 'h2',
}) => {
  if (items.length === 0) return null;

  const Heading = headingLevel;

  return (
    <section className={styles.section} aria-label={category.title}>
      <div className={styles.header}>
        <span className={styles.emoji} aria-hidden>
          {category.emoji}
        </span>
        <Heading className={styles.title}>{category.title}</Heading>
        {category.emojiRight && (
          <span className={styles.emoji} aria-hidden>
            {category.emojiRight}
          </span>
        )}
      </div>

      {category.variant === 'list' ? (
        <div className={styles.list}>
          {items.map((item) => (
            <QuizListCard
              key={item.id}
              id={item.id}
              title={item.title}
              thumbnail={item.thumbnail}
              views={item.views}
            />
          ))}
        </div>
      ) : (
        <ul className={styles.carousel}>
          {items.map((item) => (
            <li key={item.id} className={styles.cardItem}>
              <Link
                href={`/quiz/${item.id}`}
                className={styles.card}
                aria-label={`${item.title} 퀴즈로 이동`}
              >
                <div className={styles.thumbWrapper}>
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    width={150}
                    height={79}
                    className={styles.thumb}
                    loading="lazy"
                    quality={80}
                    placeholder="blur"
                    blurDataURL={BLUR}
                    sizes="150px"
                  />
                </div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <div className={styles.views}>
                  <span className={styles.playIcon}>▷</span>
                  <span className={styles.count}>
                    {item.views.toLocaleString()}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default HomeCategorySection;
