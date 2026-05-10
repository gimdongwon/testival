'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import ShareIcon from '@/components/icons/share';
import ResetIcon from '@/components/icons/reset';
import { copyCurrentUrlToClipboard } from '@/lib/copyCurrentUrlToClipboard';
import styles from './ResultShareActions.module.scss';

export type ResultShareActionsProps = Readonly<{
  testId: string;
  shareBtnBg: string;
  shareBtnColor: string;
}>;

const ResultShareActions = ({
  testId,
  shareBtnBg,
  shareBtnColor,
}: ResultShareActionsProps) => {
  const router = useRouter();

  const handleClickShareBtn = useCallback(() => {
    copyCurrentUrlToClipboard();
  }, []);

  const handleClickResetBtn = useCallback(() => {
    router.push(`/quiz/${testId}`);
  }, [router, testId]);

  return (
    <div className={styles.shareBtnWrapper}>
      <button
        type='button'
        className={styles.shareBtn}
        onClick={handleClickShareBtn}
        style={{ backgroundColor: shareBtnBg, color: shareBtnColor }}
      >
        <span>내 결과 공유하기</span>
        <ShareIcon color={shareBtnColor} width={12} height={16} />
      </button>
      <button
        type='button'
        className={styles.resetBtn}
        aria-label='처음부터 다시하기'
        onClick={handleClickResetBtn}
        style={{ backgroundColor: '#ED1B7A', color: '#fff' }}
      >
        처음부터 다시하기
        <ResetIcon color='#fff' width={13} height={15} />
      </button>
    </div>
  );
};

export default ResultShareActions;
