// src/lib/resolveQuizImages.ts
// 서버 전용: 퀴즈 이미지 디렉토리에서 사용 가능한 webp 파일 목록을 반환

import fs from 'fs';
import path from 'path';

/**
 * 퀴즈 ID에 해당하는 이미지 디렉토리를 스캔하여
 * 사용 가능한 .webp 파일명 목록을 반환합니다.
 *
 * 서버 컴포넌트에서 호출하여 클라이언트에 prop으로 전달하면
 * 클라이언트에서 불필요한 404 프로빙 없이 webp 사용 여부를 결정할 수 있습니다.
 */
export const getAvailableWebP = (quizId: string): string[] => {
  const dir = path.join(process.cwd(), 'public', 'images', 'quiz', quizId);

  try {
    const files = fs.readdirSync(dir);
    return files.filter((f) => f.endsWith('.webp'));
  } catch {
    // 디렉토리가 없거나 읽기 실패 시 빈 배열 반환
    return [];
  }
};
