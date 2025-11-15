# Testival

간단한 JSON 정의만으로 다양한 성격의 테스트(성향 테스트, 금액 합산 테스트 등)를 구성하고, Next.js App Router로 SSR/CSR 혼합 렌더링하는 퀴즈 플랫폼입니다.

### 데모 경로

- `/:` 테스트 목록
- `/quiz/:id:` 테스트 랜딩
- `/quiz/:id/question:` 문항 진행
- `/quiz/:id/loading:` 결과 산출 전 로딩
- `/quiz/:id/result:` 결과 페이지

## 빠른 시작

### 요구사항

- Node.js 18+ (권장 LTS)
- Yarn 1.x

### 설치 & 실행

```bash
yarn
yarn dev
```

### 빌드 & 배포 실행

```bash
yarn build
yarn start
```

## 스택

- Next.js 15 (App Router)
- React 19
- TypeScript
- Zustand (진행 상태/선택 관리)
- Zod (콘텐츠 스키마 검증)
- @tanstack/react-query (프로바이더 구성 및 Devtools)
- Vercel KV (Redis) - 조회수 카운팅

## 프로젝트 구조

```text
src/
  app/
    page.tsx                  // 테스트 목록
    layout.tsx                // 전역 메타/GA/Providers
    quiz/[id]/
      page.tsx               // 테스트 랜딩
      layout.tsx             // 테스트별 메타/OG
      question/
        page.tsx             // 서버에서 정의 로드 + 배경
        question.client.tsx  // 문항 진행 클라이언트
      result/
        page.tsx             // 결과 메타/OG + 데이터 로드
        result.client.tsx    // 결과 렌더링
  content/                    // 테스트 정의(JSON)
    chuseok/
      index.json
      chuseok.json
    chuseok_money/
      index.json
      chuseok_money.json
  domain/
    quiz.schema.ts            // Zod 스키마/타입
  infrastructure/
    quiz.repository.ts        // Repository 인터페이스/팩토리
    quiz.fs.repository.ts     // 파일 시스템 기반 구현
  store/
    quizStore.ts              // 진행 인덱스/선택 상태(Zustand)
  lib/
    scoring.ts                // 스코어링(가중치/금액 합산)
    ga-listener.tsx           // SPA page_view 추적
  components/
    common/QuestionCard       // 문항 카드 UI
    chuseok_money/receipt     // 영수증 UI
```

## 콘텐츠 스키마

모든 테스트는 `src/content/**.json`으로 정의되며 런타임에 Zod로 검증됩니다. 주요 스키마는 `src/domain/quiz.schema.ts` 참고.

- **meta.mode**: `weighted | type-count | amount-sum`
  - `weighted`: 선택지별 `weights: { 타입: 숫자 }` 합산 후 최상위 타입 도출
  - `amount-sum`: 선택지별 `amount(만원)` 합산 → 구간(`zero|oneToThree|fourToFive|sixToNine|tenPlus`) 매핑
  - `type-count`: 향후 확장용(`mapType` 지원)
- **resultDetails**: 타입 키 → 상세 정보(`name/title/description/image/keywords/type`)
- **questions[].choices**:
  - `weighted`: `weights` 필요
  - `amount-sum`: `amount` 필요(음수 허용)

검증 규칙 예시

- `resultDetails`/`messages` 키는 `meta.resultTypes`에 존재해야 함
- `weighted`에서는 모든 `weights` 키가 `meta.resultTypes`에 포함되어야 함
- `amount-sum`에서는 모든 선택지에 `amount` 숫자 필요

## 데이터 로딩

- `FSQuizRepository`가 `src/content` 하위 네임스페이스를 탐색하고 `index.json`/`*.json`을 동적 import 후 검증합니다.
- `getQuizRepository().list()`로 목록, `getQuizRepository().getById(id)`로 개별 테스트를 획득합니다.

## 진행/상태 관리

- `quizStore`에서 테스트별 현재 문항 인덱스와 선택 기록을 관리합니다.
- 진입/리로드 시 `start(testId)`로 0번 인덱스부터 시작합니다.
- 선택 시 `choose(testId, qId, cId)` → 마지막 문항이면 `/loading`으로 이동, 아니면 `next()`.

## 스코어링

- `lib/scoring.ts`
  - `amount-sum`: 합계 계산 → 금액 브라켓 키 도출
  - `weighted`: 타입별 가중치 합산 → 최상위 타입 결정(동점 시 선언 순서 우선)

## 접근성/UX

- 버튼에 `aria-label`, 리스트/리전 역할 지정, `aria-live`로 동적 값 전달
- 키보드 포커스 고려, 이미지에 `alt` 제공(배경 이미지는 시각 장식용 `alt` 처리)

## SEO/공유

- 전역/페이지 메타 및 OG 이미지 설정: `app/layout.tsx`, `quiz/[id]/layout.tsx`, `quiz/[id]/result/page.tsx`
- 결과/테스트 별 OG 이미지: `public/images/quiz/:id/{ogImage,ogResult}.png`

## 분석 도구

- GA4 gtag 및 GTM 스니펫(`NEXT_PUBLIC_GA_ID` 필요)
- SPA 네비게이션에서 `page_view` 전송: `lib/ga-listener.tsx`

## 조회수 카운팅

- Vercel KV (Redis)를 사용하여 각 퀴즈의 조회수를 실시간으로 카운팅합니다.
- 퀴즈 상세 페이지 진입 시 자동으로 조회수가 증가합니다.
- 메인 페이지 목록에서 각 퀴즈의 조회수를 확인할 수 있습니다.

### 주요 구성

- **API Route**: `/api/quiz/[id]/view` (GET: 조회, POST: 증가)
- **Hook**: `useViewCount(quizId)` - 조회수 가져오기 및 증가
- **Component**: `ViewTracker` - 페이지 진입 시 자동 조회수 증가
- **Storage Key**: `quiz:views:{quizId}` 형식으로 Redis에 저장

## SVG 사용

- `next.config.ts`에서 SVGR 설정. `?component`로 React 컴포넌트 사용 가능, `?url`로 URL 사용 가능.

## 환경변수

- `NEXT_PUBLIC_GA_ID`: Google Analytics ID (예: `G-XXXXXX`)
- `KV_REST_API_URL`: Vercel KV REST API URL
- `KV_REST_API_TOKEN`: Vercel KV REST API Token
- `KV_REST_API_READ_ONLY_TOKEN`: Vercel KV REST API Read Only Token (선택)

### Vercel KV 설정

1. Vercel 대시보드에서 프로젝트 선택
2. Storage 탭에서 "Create Database" → "KV" 선택
3. 생성된 KV 데이터베이스를 프로젝트에 연결
4. 환경 변수가 자동으로 설정됩니다

로컬 개발 시에는 `.env.local` 파일에 다음을 추가:
```bash
KV_REST_API_URL="your_kv_rest_api_url"
KV_REST_API_TOKEN="your_kv_rest_api_token"
```

## 새로운 테스트 추가 방법

1. `src/content/<namespace>/index.json`에 `{ metaList: [{ id, title }] }` 추가
2. 동일 디렉토리에 `<id>.json` 정의 파일 추가(스키마 준수)
3. `public/images/quiz/<id>/`에 필요한 이미지 배치(`main.png`, `content_background.png`, `result.png` 또는 `result_<type>.png`, `ogImage.png`, `ogResult.png` 등)
4. 필요 시 스타일(`.scss`)과 옵션 버튼 테마 클래스 추가

## 라이선스

사내/개인 프로젝트 용도로 사용 중. 필요 시 라이선스를 명시하세요.
