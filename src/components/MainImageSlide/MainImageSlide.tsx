'use client';

import Image from 'next/image';
import styles from './MainImageSlide.module.scss';
import { useEffect, useState } from 'react';

export default function MainImageSlide({
  id,
  images,
}: {
  id: string;
  images: string[];
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className={styles.wrapper}>
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          width={720}
          height={1280}
          alt=''
          className={`${styles.mainImage} ${i === index ? styles.visible : ''}`}
          priority={i === 0}
        />
      ))}
    </div>
  );
}
