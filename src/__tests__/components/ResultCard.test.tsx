import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ResultCard from '@/components/common/ResultCard/ResultCard';
import type { ResultDetail } from '@/domain/quiz.schema';

const makeResult = (overrides: Partial<ResultDetail> = {}): ResultDetail => ({
  name: '집콕 유형',
  title: '집이야 말로 최고의 쉼',
  description: '연휴에 계획 있냐고? 아무것도 안 하는 게 계획이다.',
  image: '/images/quiz/test/result.png',
  keywords: ['충전', '솔플', '익숙함'],
  type: 'house',
  ...overrides,
});

describe('ResultCard 컴포넌트', () => {
  describe('이미지가 있는 결과 (기본 레이아웃)', () => {
    it('결과 이름, 제목, 설명이 렌더링되어야 한다', () => {
      render(
        <ResultCard
          quizTitle="테스트 퀴즈"
          result={makeResult()}
          theme="black"
        />
      );

      expect(screen.getByText('집콕 유형')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
        '집이야 말로 최고의 쉼'
      );
      expect(
        screen.getByText(/아무것도 안 하는 게 계획이다/)
      ).toBeInTheDocument();
    });

    it('결과 이미지가 올바른 src와 alt로 렌더링되어야 한다', () => {
      render(
        <ResultCard
          quizTitle="테스트 퀴즈"
          result={makeResult()}
          theme="black"
        />
      );

      const img = screen.getByAltText('집콕 유형 결과 이미지');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/images/quiz/test/result.png');
    });

    it('키워드가 # 접두사와 함께 표시되어야 한다', () => {
      render(
        <ResultCard
          quizTitle="테스트 퀴즈"
          result={makeResult()}
          theme="black"
        />
      );

      expect(screen.getByText('#충전')).toBeInTheDocument();
      expect(screen.getByText('#솔플')).toBeInTheDocument();
      expect(screen.getByText('#익숙함')).toBeInTheDocument();
    });

    it('키워드 리스트에 aria-label이 설정되어야 한다', () => {
      render(
        <ResultCard
          quizTitle="테스트 퀴즈"
          result={makeResult()}
          theme="black"
        />
      );

      expect(screen.getByLabelText('결과 키워드')).toBeInTheDocument();
    });

    it('키워드가 빈 배열이면 키워드 리스트가 렌더링되지 않아야 한다', () => {
      render(
        <ResultCard
          quizTitle="테스트 퀴즈"
          result={makeResult({ keywords: [] })}
          theme="black"
        />
      );

      expect(screen.queryByLabelText('결과 키워드')).not.toBeInTheDocument();
    });

    it('scoreLabel이 전달되면 표시되어야 한다', () => {
      render(
        <ResultCard
          quizTitle="테스트 퀴즈"
          result={makeResult()}
          theme="black"
          scoreLabel="총 잔소리 비용"
        />
      );

      expect(screen.getByText('총 잔소리 비용')).toBeInTheDocument();
    });
  });

  describe('이미지가 없는 결과 (no-image 레이아웃)', () => {
    const noImageResult = makeResult({
      image: undefined,
      name: '3등급',
      title: '야르쟈나이…',
      description: '야르를 알고는 있는데, 확신은 없다.',
    });

    it('이미지 없이 제목과 이름이 렌더링되어야 한다', () => {
      render(
        <ResultCard
          quizTitle="테스트 퀴즈"
          result={noImageResult}
          theme="black"
        />
      );

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        '야르쟈나이…'
      );
      expect(screen.getByText('3등급')).toBeInTheDocument();
    });

    it('이미지 엘리먼트가 렌더링되지 않아야 한다', () => {
      const { container } = render(
        <ResultCard
          quizTitle="테스트 퀴즈"
          result={noImageResult}
          theme="black"
        />
      );

      const images = container.querySelectorAll('img');
      expect(images).toHaveLength(0);
    });

    it('descriptionHeader가 전달되면 표시되어야 한다', () => {
      render(
        <ResultCard
          quizTitle="테스트 퀴즈"
          result={noImageResult}
          theme="black"
          descriptionHeader="종합의견"
        />
      );

      expect(screen.getByText('종합의견')).toBeInTheDocument();
    });

    it('stampImage와 등급 번호가 있으면 stamp가 렌더링되어야 한다', () => {
      const { container } = render(
        <ResultCard
          quizTitle="테스트 퀴즈"
          result={noImageResult}
          theme="black"
          stampImage="/images/quiz/yarr/stamp.png"
        />
      );

      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('등급')).toBeInTheDocument();

      const stampImg = container.querySelector('img');
      expect(stampImg).toHaveAttribute('src', '/images/quiz/yarr/stamp.png');
    });

    it('이름에 숫자가 없으면 stamp가 렌더링되지 않아야 한다', () => {
      const resultNoGrade = makeResult({
        image: undefined,
        name: '멋진 결과',
      });

      const { container } = render(
        <ResultCard
          quizTitle="테스트 퀴즈"
          result={resultNoGrade}
          theme="black"
          stampImage="/images/quiz/yarr/stamp.png"
        />
      );

      expect(screen.queryByText('등급')).not.toBeInTheDocument();
      expect(container.querySelector('img')).not.toBeInTheDocument();
    });
  });

  describe('스타일 커스터마이징', () => {
    it('fontFamily가 전달되면 hero 섹션에 적용되어야 한다', () => {
      render(
        <ResultCard
          quizTitle="테스트 퀴즈"
          result={makeResult()}
          theme="black"
          fontFamily="'Yeossihyangyakeonhae', sans-serif"
        />
      );

      const heroName = screen.getByText('집콕 유형');
      expect(heroName.style.fontFamily).toContain('Yeossihyangyakeonhae');
    });

    it('heroColor가 전달되면 hero 텍스트 색상에 적용되어야 한다', () => {
      render(
        <ResultCard
          quizTitle="테스트 퀴즈"
          result={makeResult()}
          theme="black"
          heroColor="#ff0000"
        />
      );

      const heroName = screen.getByText('집콕 유형');
      expect(heroName.style.color).toBe('rgb(255, 0, 0)');
    });

    it('textStroke가 전달되면 WebkitTextStroke이 적용되어야 한다', () => {
      render(
        <ResultCard
          quizTitle="테스트 퀴즈"
          result={makeResult()}
          theme="black"
          textStroke="2px #fff"
        />
      );

      const heroName = screen.getByText('집콕 유형');
      expect(heroName.style.webkitTextStroke).toBe('2px #fff');
    });
  });

  describe('다양한 콘텐츠 시나리오', () => {
    it('줄바꿈이 포함된 이름도 정상 렌더링되어야 한다', () => {
      render(
        <ResultCard
          quizTitle="테스트 퀴즈"
          result={makeResult({ name: '연휴 DNA 결과, 당신은\n집콕 유형' })}
          theme="black"
        />
      );

      expect(
        screen.getByText(/연휴 DNA 결과/)
      ).toBeInTheDocument();
    });

    it('긴 설명 텍스트가 포함된 결과도 정상 렌더링되어야 한다', () => {
      const longDescription =
        '이것은 매우 긴 설명 텍스트입니다. '.repeat(20).trim();
      render(
        <ResultCard
          quizTitle="테스트 퀴즈"
          result={makeResult({ description: longDescription })}
          theme="black"
        />
      );

      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });

    it('키워드가 10개인 결과도 모두 렌더링되어야 한다', () => {
      const keywords = Array.from({ length: 10 }, (_, i) => `키워드${i + 1}`);
      render(
        <ResultCard
          quizTitle="테스트 퀴즈"
          result={makeResult({ keywords })}
          theme="black"
        />
      );

      for (const keyword of keywords) {
        expect(screen.getByText(`#${keyword}`)).toBeInTheDocument();
      }
    });
  });
});
