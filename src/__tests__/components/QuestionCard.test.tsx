import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuestionCard from '@/components/common/QuestionCard/QuestionCard';
import type { QuestionCardProps } from '@/components/common/QuestionCard/QuestionCard';

const DEFAULT_OPTIONS = [
  { id: 'c1', label: 'A', text: '첫 번째 선택지' },
  { id: 'c2', label: 'B', text: '두 번째 선택지' },
  { id: 'c3', label: 'C', text: '세 번째 선택지' },
];

const renderCard = (overrides: Partial<QuestionCardProps> = {}) => {
  const defaultProps: QuestionCardProps = {
    number: 1,
    title: '당신의 취미는?',
    options: DEFAULT_OPTIONS,
    ...overrides,
  };
  return render(<QuestionCard {...defaultProps} />);
};

describe('QuestionCard 컴포넌트', () => {
  describe('기본 렌더링', () => {
    it('질문 번호와 제목이 렌더링되어야 한다', () => {
      renderCard();

      expect(screen.getByText(/Q1/)).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('당신의 취미는?');
    });

    it('모든 선택지가 렌더링되어야 한다', () => {
      renderCard();

      expect(screen.getByText('첫 번째 선택지')).toBeInTheDocument();
      expect(screen.getByText('두 번째 선택지')).toBeInTheDocument();
      expect(screen.getByText('세 번째 선택지')).toBeInTheDocument();
    });

    it('선택지 라벨(A, B, C)이 표시되어야 한다', () => {
      renderCard();

      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
      expect(screen.getByText('C')).toBeInTheDocument();
    });

    it('옵션 리스트가 role="list"를 가져야 한다', () => {
      renderCard();

      expect(screen.getByRole('list')).toBeInTheDocument();
    });
  });

  describe('사용자 상호작용', () => {
    it('선택지 클릭 시 onSelect가 올바른 ID로 호출되어야 한다', async () => {
      const user = userEvent.setup();
      const handleSelect = vi.fn();
      renderCard({ onSelect: handleSelect });

      await user.click(screen.getByText('첫 번째 선택지'));
      expect(handleSelect).toHaveBeenCalledWith('c1');

      await user.click(screen.getByText('세 번째 선택지'));
      expect(handleSelect).toHaveBeenCalledWith('c3');

      expect(handleSelect).toHaveBeenCalledTimes(2);
    });

    it('각 선택지 버튼에 aria-label이 설정되어야 한다', () => {
      renderCard();

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);

      expect(buttons[0]).toHaveAttribute('aria-label', 'A 첫 번째 선택지');
      expect(buttons[1]).toHaveAttribute('aria-label', 'B 두 번째 선택지');
    });
  });

  describe('커스터마이징 옵션', () => {
    it('hideQuestionNumberPrefix가 true이면 "Q"가 표시되지 않아야 한다', () => {
      renderCard({ hideQuestionNumberPrefix: true });

      const qNum = screen.getByText(/^1/);
      expect(qNum).toBeInTheDocument();
      expect(qNum.textContent).not.toContain('Q');
    });

    it('hideQuestionNumberDot이 true이면 "."이 표시되지 않아야 한다', () => {
      renderCard({ hideQuestionNumberDot: true });

      const qNum = screen.getByText(/Q1/);
      expect(qNum.textContent).toBe('Q1');
    });

    it('hideOptionLabel이 true이면 선택지 라벨이 표시되지 않아야 한다', () => {
      renderCard({ hideOptionLabel: true });

      expect(screen.queryByText('A')).not.toBeInTheDocument();
      expect(screen.queryByText('B')).not.toBeInTheDocument();
      expect(screen.queryByText('C')).not.toBeInTheDocument();

      expect(screen.getByText('첫 번째 선택지')).toBeInTheDocument();
    });

    it('columns가 2 이상이면 grid 레이아웃 스타일이 적용되어야 한다', () => {
      renderCard({ columns: 2 });

      const list = screen.getByRole('list');
      expect(list.style.display).toBe('grid');
      expect(list.style.gridTemplateColumns).toBe('repeat(2, minmax(0, 1fr))');
    });

    it('questionImage가 전달되면 이미지가 렌더링되어야 한다', () => {
      renderCard({ questionImage: '/images/quiz/test/q1.png' });

      const img = screen.getByAltText('질문 1 이미지');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/images/quiz/test/q1.png');
    });

    it('questionImage가 없으면 이미지가 렌더링되지 않아야 한다', () => {
      renderCard();

      expect(screen.queryByAltText('질문 1 이미지')).not.toBeInTheDocument();
    });

    it('optionColors가 전달되면 각 버튼에 배경색이 적용되어야 한다', () => {
      renderCard({ optionColors: ['#ff0000', '#00ff00', '#0000ff'] });

      const buttons = screen.getAllByRole('button');
      expect(buttons[0].style.backgroundColor).toBe('rgb(255, 0, 0)');
      expect(buttons[1].style.backgroundColor).toBe('rgb(0, 255, 0)');
      expect(buttons[2].style.backgroundColor).toBe('rgb(0, 0, 255)');
    });

    it('cardBorderColor가 전달되면 보더 스타일이 적용되어야 한다', () => {
      renderCard({ cardBorderColor: '#333' });

      const header = screen.getByLabelText('질문지 상단');
      expect(header.style.border).toContain('1.5px solid');
    });
  });

  describe('다양한 콘텐츠 시나리오', () => {
    it('2개의 선택지만 있는 경우도 정상 렌더링되어야 한다', () => {
      renderCard({
        options: [
          { id: 'c1', label: 'A', text: '예' },
          { id: 'c2', label: 'B', text: '아니오' },
        ],
      });

      expect(screen.getAllByRole('button')).toHaveLength(2);
    });

    it('긴 텍스트가 포함된 선택지도 렌더링되어야 한다', () => {
      const longText = '이것은 매우 긴 선택지 텍스트입니다. 여러 줄에 걸쳐 표시될 수 있습니다.';
      renderCard({
        options: [
          { id: 'c1', label: 'A', text: longText },
          { id: 'c2', label: 'B', text: '짧은 텍스트' },
        ],
      });

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('줄바꿈이 포함된 제목도 렌더링되어야 한다', () => {
      renderCard({ title: '다음 그림의 상황에서\n남자가 할 말은?' });

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('다음 그림의 상황에서');
      expect(heading).toHaveTextContent('남자가 할 말은?');
    });
  });
});
