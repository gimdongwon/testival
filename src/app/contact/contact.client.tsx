'use client';

import React, { useState, useCallback } from 'react';
import styles from './page.module.scss';

type ContactFormProps = Readonly<{
  email: string;
}>;

type InquiryType = 'test_suggest' | 'collaboration' | 'bug' | 'other';

const INQUIRY_OPTIONS: { value: InquiryType; label: string }[] = [
  { value: 'test_suggest', label: '테스트 제안' },
  { value: 'collaboration', label: '협업 문의' },
  { value: 'bug', label: '버그 신고' },
  { value: 'other', label: '기타' },
];

const INQUIRY_SUBJECT_MAP: Record<InquiryType, string> = {
  test_suggest: '[테스트 제안]',
  collaboration: '[협업 문의]',
  bug: '[버그 신고]',
  other: '[기타 문의]',
};

const ContactForm = ({ email }: ContactFormProps) => {
  const [inquiryType, setInquiryType] = useState<InquiryType>('test_suggest');
  const [name, setName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const subject = `${INQUIRY_SUBJECT_MAP[inquiryType]} ${name}님의 문의`;
      const body = [
        `이름: ${name}`,
        `이메일: ${senderEmail}`,
        `문의 유형: ${INQUIRY_OPTIONS.find((o) => o.value === inquiryType)?.label}`,
        '',
        '--- 문의 내용 ---',
        '',
        message,
      ].join('\n');

      const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
      setIsSent(true);
    },
    [inquiryType, name, senderEmail, message, email]
  );

  const handleReset = useCallback(() => {
    setInquiryType('test_suggest');
    setName('');
    setSenderEmail('');
    setMessage('');
    setIsSent(false);
  }, []);

  if (isSent) {
    return (
      <div className={styles.sentMessage}>
        <span className={styles.sentEmoji}>✉️</span>
        <h2 className={styles.sentTitle}>메일 앱이 열렸습니다!</h2>
        <p className={styles.sentText}>
          메일 앱에서 내용을 확인하고 전송해 주세요.
          <br />
          메일 앱이 열리지 않았다면 아래 이메일로 직접 보내주세요.
        </p>
        <a
          href={`mailto:${email}`}
          className={styles.sentEmail}
          aria-label='이메일로 직접 문의하기'
        >
          {email}
        </a>
        <button
          type='button'
          onClick={handleReset}
          className={styles.resetButton}
          aria-label='문의 양식 다시 작성하기'
          tabIndex={0}
        >
          다시 작성하기
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor='inquiry-type' className={styles.label}>
          문의 유형
        </label>
        <select
          id='inquiry-type'
          value={inquiryType}
          onChange={(e) => setInquiryType(e.target.value as InquiryType)}
          className={styles.select}
          aria-label='문의 유형 선택'
        >
          {INQUIRY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor='name' className={styles.label}>
          이름
        </label>
        <input
          id='name'
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='이름을 입력해 주세요'
          className={styles.input}
          required
          aria-required='true'
          autoComplete='name'
        />
      </div>

      <div className={styles.field}>
        <label htmlFor='email' className={styles.label}>
          이메일
        </label>
        <input
          id='email'
          type='email'
          value={senderEmail}
          onChange={(e) => setSenderEmail(e.target.value)}
          placeholder='답변 받으실 이메일 주소'
          className={styles.input}
          required
          aria-required='true'
          autoComplete='email'
        />
      </div>

      <div className={styles.field}>
        <label htmlFor='message' className={styles.label}>
          문의 내용
        </label>
        <textarea
          id='message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='문의 내용을 작성해 주세요'
          className={styles.textarea}
          rows={6}
          required
          aria-required='true'
        />
      </div>

      <button
        type='submit'
        className={styles.submitButton}
        disabled={!name.trim() || !senderEmail.trim() || !message.trim()}
        aria-label='문의 메일 보내기'
        tabIndex={0}
      >
        메일 보내기
      </button>
    </form>
  );
};

export default ContactForm;
