'use client';

import React from 'react';
import Link from 'next/link';

const LandingPage: React.FC = () => {
  return (
    <main aria-label='메인비주얼' className='landing-main'>
      <div aria-hidden className='landing-bg'></div>
      <div className='landing-content'>
        <p className='eyebrow'>내 자리는 어디?</p>
        <h1 className='landing-title'>
          <span aria-hidden>🚗</span>
          여행차석 테스트
          <span aria-hidden>🚗</span>
        </h1>
        <Link
          href='/question'
          aria-label='테스트 시작하기'
          role='button'
          className='primary-link-btn'
        >
          테스트 시작하기
        </Link>
      </div>
    </main>
  );
};

export default LandingPage;
