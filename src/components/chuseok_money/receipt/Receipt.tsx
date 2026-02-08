'use client';

import React, { useMemo } from 'react';
import styles from './Receipt.module.scss';
import type { ResultDetail } from '@/domain/quiz.schema';
import { commaWithNumber } from '@/lib/commaWithNumber';
import { resolveImage } from '@/lib/imageUtils';

type ReceiptItem = { id: string; title: string; amount: number };

type ReceiptProps = {
  id: string;
  items: ReceiptItem[];
  total: number;
  detail?: ResultDetail;
  webpFiles?: string[];
};

const formatAmount = (amount: number): string => {
  const sign = amount > 0 ? '+' : '';
  return `${sign}${commaWithNumber(amount * 10000)}원`;
};

const Receipt = ({ id, items, total, detail, webpFiles = [] }: ReceiptProps) => {
  const receiptBg = `url("${resolveImage(`/images/quiz/${id}/receipt.png`, webpFiles)}")`;
  const lines = useMemo(() => (detail?.title ?? '').split('\n'), [detail]);
  const descriptionLines = useMemo(
    () => (detail?.description ?? '').split('\n'),
    [detail]
  );

  const resultEmoji = useMemo(() => {
    if (total <= 0) return '🎉'; // zero
    if (total >= 10) return '🤑'; // tenPlus
    if (total >= 6) return '💸'; // sixToNine
    if (total >= 4) return '👍'; // fourToFive
    return '🍦'; // oneToThree
  }, [total]);

  return (
    <div className={styles.receiptWrapper}>
      <div
        className={styles.receiptInner}
        aria-label='영수증 영역'
        style={{
          backgroundImage: receiptBg,
        }}
      >
        <div
          className={styles.receipt}
          aria-hidden
          style={{
            backgroundImage: receiptBg,
          }}
        >
          <div
            className={styles.receiptContent}
            role='region'
            aria-label='영수증 내용'
          >
            <p className={styles.receiptTitle}>영수증</p>
            <p className={styles.receiptDescription}>
              내가 내야할 잔소리 금액은
            </p>
            <hr className={styles.receiptDivider} aria-hidden='true' />
            <ul className={styles.receiptList}>
              {items.length === 0 && (
                <li className={styles.receiptItem}>
                  <span className={styles.receiptItemTitle}>
                    선택 내역 없음
                  </span>
                  <span className={styles.receiptItemPrice}>+0만원</span>
                </li>
              )}
              {items.map((it) => (
                <li key={it.id} className={styles.receiptItem}>
                  <span className={styles.receiptItemTitle}>{it.title}</span>
                  <span className={styles.receiptItemPrice} aria-live='polite'>
                    {formatAmount(it.amount)}
                  </span>
                </li>
              ))}
            </ul>
            <hr className={styles.receiptDivider} aria-hidden='true' />
            <p className={styles.receiptTotal} aria-live='polite'>
              {`${commaWithNumber(total * 10000)}원`}
            </p>
          </div>
        </div>
      </div>
      <div
        className={styles.bottomWrapper}
        role='region'
        aria-label='하단 안내 영역'
      >
        <p className={styles.bottomHeadline} aria-live='polite'>
          <span role='img' aria-label='결과 이모지'>
            {resultEmoji}
          </span>
          <span>
            {' '}
            {lines[0]}
            <br />
            {lines[1] ?? ''}{' '}
          </span>
          <span role='img' aria-label='결과 이모지'>
            {resultEmoji}
          </span>
        </p>
        <div className={styles.bottomCard} tabIndex={0} aria-label='결과 설명'>
          {descriptionLines.map((t, idx) => (
            <p key={idx} className={styles.bottomCardLine}>
              {t}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Receipt;
