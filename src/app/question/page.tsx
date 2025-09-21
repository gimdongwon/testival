'use client';

import React from 'react';
import QuestionCard, {
  QuestionOption,
} from '@/components/QuestionCard/QuestionCard';

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
    <div className='page-center'>
      <QuestionCard
        number={2}
        title={'차 안에서 음악은?'}
        options={sampleOptions}
        onSelect={handleSelect}
        backgroundImage={undefined}
      />
    </div>
  );
};

export default QuestionPage;
