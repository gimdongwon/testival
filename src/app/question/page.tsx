'use client';

import React from 'react';
import QuestionCard, {
  QuestionOption,
} from '@/components/QuestionCard/QuestionCard';
import styles from './question.module.scss';

const sampleOptions: QuestionOption[] = [
  { id: 'A', label: 'A.', text: '이번 여행을 위한 플레이리스트 준비 완료' },
  { id: 'B', label: 'B.', text: '친구들 기분에 맞춰 눈치껏 선곡' },
  { id: 'C', label: 'C.', text: '혼자 이어폰 끼고 내 음악 들음' },
  { id: 'D', label: 'D.', text: '라디오 음악이 찐으로 낫다' },
];

const QuestionPage: React.FC = () => {
  const handleSelect = (id: string) => {
    // TODO: 후속 라우팅/상태 저장은 추후 연결
    console.log('selected option', id);
  };

  return (
    <div className={styles.pageContainer}>
      <QuestionCard
        number={1}
        title={`여행 전날 밤,제일 중요한 것은?`}
        options={sampleOptions}
        onSelect={handleSelect}
      />
    </div>
  );
};

export default QuestionPage;
