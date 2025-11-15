'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import styles from './MainImageSlide.module.scss';

// Swiper 스타일 import
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function MainImageSlide({
  images,
  links,
}: {
  images: string[];
  links?: string[];
}) {
  return (
    <div className={styles.wrapper}>
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletClass: styles.bullet,
          bulletActiveClass: styles.bulletActive,
        }}
        navigation={false}
        className={styles.swiper}
      >
        {images.map((src, i) => (
          <SwiperSlide key={src} className={styles.slide}>
            {links && links[i] ? (
              <Link
                href={links[i]}
                className={styles.slideLink}
                aria-label={`슬라이드 ${i + 1} - 퀴즈로 이동`}
              >
                <Image
                  src={src}
                  fill
                  alt={`슬라이드 ${i + 1}`}
                  className={styles.slideImage}
                  priority={i === 0}
                  sizes='(max-width: 430px) 100vw, 430px'
                />
              </Link>
            ) : (
              <Image
                src={src}
                fill
                alt={`슬라이드 ${i + 1}`}
                className={styles.slideImage}
                priority={i === 0}
                sizes='(max-width: 430px) 100vw, 430px'
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
