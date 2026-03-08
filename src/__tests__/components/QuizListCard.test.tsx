import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import QuizListCard from '@/components/common/QuizListCard/QuizListCard';

describe('QuizListCard 컴포넌트', () => {
  const defaultProps = {
    id: 'chuseok',
    title: '추석 연휴, 나는 어디에 있을까?',
    thumbnail: '/images/quiz/chuseok/og-image.png',
    views: 12345,
  };

  describe('기본 렌더링', () => {
    it('퀴즈 제목이 렌더링되어야 한다', () => {
      render(<QuizListCard {...defaultProps} />);

      expect(
        screen.getByRole('heading', { level: 3 })
      ).toHaveTextContent('추석 연휴, 나는 어디에 있을까?');
    });

    it('썸네일 이미지가 올바른 src와 alt로 렌더링되어야 한다', () => {
      render(<QuizListCard {...defaultProps} />);

      const img = screen.getByAltText('추석 연휴, 나는 어디에 있을까?');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/images/quiz/chuseok/og-image.png');
    });

    it('조회수가 로케일 포맷으로 표시되어야 한다', () => {
      render(<QuizListCard {...defaultProps} />);

      expect(screen.getByText('12,345')).toBeInTheDocument();
    });

    it('재생 아이콘(▷)이 표시되어야 한다', () => {
      render(<QuizListCard {...defaultProps} />);

      expect(screen.getByText('▷')).toBeInTheDocument();
    });
  });

  describe('링크 동작', () => {
    it('/quiz/{id} 경로로의 링크가 생성되어야 한다', () => {
      render(<QuizListCard {...defaultProps} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/quiz/chuseok');
    });

    it('링크에 올바른 aria-label이 설정되어야 한다', () => {
      render(<QuizListCard {...defaultProps} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute(
        'aria-label',
        '추석 연휴, 나는 어디에 있을까? 퀴즈로 이동'
      );
    });

    it('링크에 tabIndex가 0으로 설정되어야 한다', () => {
      render(<QuizListCard {...defaultProps} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('tabindex', '0');
    });
  });

  describe('다양한 데이터 시나리오', () => {
    it('조회수가 0일 때도 정상 렌더링되어야 한다', () => {
      render(<QuizListCard {...defaultProps} views={0} />);

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('조회수가 큰 숫자일 때 로케일 포맷이 적용되어야 한다', () => {
      render(<QuizListCard {...defaultProps} views={1000000} />);

      expect(screen.getByText('1,000,000')).toBeInTheDocument();
    });

    it('긴 제목도 렌더링되어야 한다', () => {
      const longTitle = '이것은 매우 긴 퀴즈 제목입니다 - 어떤 결과가 나올까요?';
      render(<QuizListCard {...defaultProps} title={longTitle} />);

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('다른 퀴즈 ID로 올바른 링크가 생성되어야 한다', () => {
      render(<QuizListCard {...defaultProps} id="yarr" />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/quiz/yarr');
    });
  });
});
