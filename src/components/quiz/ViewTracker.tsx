'use client';

import { useEffect, useRef } from 'react';

interface ViewTrackerProps {
  quizId: string;
}

const ViewTracker: React.FC<ViewTrackerProps> = ({ quizId }) => {
  const hasTracked = useRef(false);

  useEffect(() => {
    // 세션 스토리지 키
    const sessionKey = `quiz_view_tracked_${quizId}`;
    
    // 이미 조회수를 증가시켰다면 리턴
    if (hasTracked.current) {
      return;
    }

    // 현재 세션에서 이미 조회수를 증가시켰는지 확인
    const alreadyTracked = sessionStorage.getItem(sessionKey);
    if (alreadyTracked) {
      hasTracked.current = true;
      return;
    }

    // API 호출 전에 먼저 플래그를 설정하여 중복 호출 방지
    hasTracked.current = true;
    sessionStorage.setItem(sessionKey, 'true');

    const incrementView = async (): Promise<void> => {
      try {
        await fetch(`/api/quiz/${quizId}/view`, {
          method: 'POST',
        });
      } catch (error) {
        console.error('Failed to track view:', error);
        // 실패 시 플래그 초기화 (다음에 재시도 가능하도록)
        hasTracked.current = false;
        sessionStorage.removeItem(sessionKey);
      }
    };

    incrementView();
  }, [quizId]);

  return null;
};

export default ViewTracker;

