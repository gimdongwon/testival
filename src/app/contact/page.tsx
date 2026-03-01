import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import ContactForm from './contact.client';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Testival에 문의하기 - 테스트 제안, 협업 문의, 기타 궁금한 사항을 보내주세요.',
};

const CONTACT_EMAIL = 'testival2025@gmail.com';

const ContactPage = () => {
  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <h1 className={styles.title}>Contact Us</h1>
        <p className={styles.description}>
          테스트 제안, 협업 문의, 버그 신고 등<br />
          궁금한 점이 있으시면 아래 양식을 작성해 주세요.
        </p>

        <ContactForm email={CONTACT_EMAIL} />

        <section className={styles.altContact}>
          <h2 className={styles.altTitle}>다른 방법으로 연락하기</h2>
          <div className={styles.altList}>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className={styles.altCard}
              aria-label='이메일로 문의하기'
              tabIndex={0}
            >
              <span className={styles.altEmoji}>📧</span>
              <div>
                <span className={styles.altLabel}>이메일</span>
                <span className={styles.altValue}>{CONTACT_EMAIL}</span>
              </div>
            </a>
            <a
              href='https://www.instagram.com/testival.official/'
              target='_blank'
              rel='noopener noreferrer'
              className={styles.altCard}
              aria-label='인스타그램 DM으로 문의하기 (새 탭에서 열림)'
              tabIndex={0}
            >
              <span className={styles.altEmoji}>📸</span>
              <div>
                <span className={styles.altLabel}>Instagram</span>
                <span className={styles.altValue}>@testival.official</span>
              </div>
            </a>
            <a
              href='https://x.com/testival2025'
              target='_blank'
              rel='noopener noreferrer'
              className={styles.altCard}
              aria-label='X DM으로 문의하기 (새 탭에서 열림)'
              tabIndex={0}
            >
              <span className={styles.altEmoji}>𝕏</span>
              <div>
                <span className={styles.altLabel}>X (Twitter)</span>
                <span className={styles.altValue}>@testival2025</span>
              </div>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ContactPage;
