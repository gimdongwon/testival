/**
 * 홈(인덱스) 카테고리 구성.
 *
 * - variant 'list'    : 세로 리스트 (썸네일 좌 + 제목·조회수 우) — QuizListCard 재사용
 * - variant 'carousel': 가로 스크롤 포스터 카드 (썸네일 위 + 제목·조회수 아래)
 *
 * quizIds는 노출 순서. 한 퀴즈가 여러 카테고리에 중복 노출될 수 있다.
 * 여기에 없는 퀴즈는 홈 카테고리에 노출되지 않는다(상세 URL로는 계속 접근 가능).
 * 현재 제외: chuseok(추석 연휴), seollal_nag(설날 잔소리), holiday_activity(연휴 뭐할까).
 */
export type HomeCategoryVariant = 'list' | 'carousel';

export interface HomeCategory {
  key: string;
  /** Testival 톤 섹션 제목 */
  title: string;
  /** 제목 좌측 이모지 */
  emoji: string;
  /** 제목 우측 이모지(있으면 양쪽 배치) */
  emojiRight?: string;
  variant: HomeCategoryVariant;
  quizIds: string[];
}

export const HOME_CATEGORIES: HomeCategory[] = [
  {
    key: 'popular',
    title: '지금 많이 하는 테스트',
    emoji: '🔥',
    emojiRight: '🔥',
    variant: 'list',
    quizIds: ['dujjoenku', 'solo_escape', 'eolppa'],
  },
  {
    key: 'new',
    title: '새로 나온 테스트',
    emoji: '✨',
    variant: 'carousel',
    quizIds: [
      'lovehome',
      'teto_man',
      'tetoman',
      'couple_level_test',
      'coward_test',
      'cc-test',
    ],
  },
  {
    key: 'love',
    title: '연애와 관계',
    emoji: '💟',
    variant: 'carousel',
    quizIds: [
      'goodboyfriend',
      'couple_level_test',
      'cc-test',
      'solo_escape',
      'eolppa',
      'tetoman',
    ],
  },
  {
    key: 'daily',
    title: '일상 속 나의 취향',
    emoji: '🆔',
    variant: 'carousel',
    quizIds: [
      'young40',
      'nightwear',
      'classroom',
      'livinglevel',
      'yarr',
      'dujjoenku',
    ],
  },
  {
    key: 'outside',
    title: '밖에서 보이는 나',
    emoji: '🚺',
    variant: 'carousel',
    quizIds: ['seat', 'spring', 'lovehome', 'travel_winter', 'travel_photo'],
  },
  {
    key: 'season',
    title: '시즌마다 즐기는 테스트',
    emoji: '☪️',
    variant: 'carousel',
    quizIds: [
      'girls',
      'mid-term',
      'chuseok_money',
      'christmas_present',
      'christmas_cake',
      'coward_test',
    ],
  },
];
