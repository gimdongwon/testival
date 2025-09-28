import React from 'react';
import Link from 'next/link';

import { getQuizRepository } from '@/infrastructure/quiz.repository';
async function Home() {
  const repo = getQuizRepository();
  const list = await repo.list(); // get() 메서드로 단일 퀴즈 데이터 가져오기

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <h1>테스트 목록</h1>
      <ul>
        {list.map((item) => (
          <li key={item.meta.id}>
            <Link
              href={`/quiz/${item.meta.id}`}
              tabIndex={0}
              aria-label={`${item.meta.title} 퀴즈로 이동`}
            >
              {item.meta.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default Home;
