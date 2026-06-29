# Testival — 디자인 시스템 & Figma 연동 규칙

> Figma MCP로 디자인을 코드로 옮길 때 따라야 할 종합 가이드.
> 이 프로젝트는 **JSON 콘텐츠 기반 + SCSS Modules** 구조다. Tailwind/디자인토큰 패키지/스토리북을 쓰지 **않는다**.
> 관련 기존 룰: `.cursor/rules/figma-to-code.mdc`, `.cursor/rules/project-overview.mdc`, `.cursor/rules/quiz-content.mdc`, `.cursor/rules/code-conventions.mdc`

## TL;DR — Figma 작업 시 핵심 원칙

1. **Tailwind 출력을 그대로 쓰지 말 것.** Figma MCP는 React+Tailwind를 내놓는다 → 반드시 **SCSS Modules**로 변환한다.
2. **디자인 토큰은 두 군데에 산다.** (a) 전역: `globals.css`의 CSS 변수 + `@font-face`, (b) 퀴즈별: 콘텐츠 JSON의 `ui` 필드(런타임 인라인 스타일).
3. **새 퀴즈의 색/폰트/간격은 SCSS가 아니라 콘텐츠 JSON `ui`에 넣는다.** 공용 레이아웃 컴포넌트가 그 값을 인라인 스타일로 주입한다.
4. **아이콘은 SVGR로 import.** 아이콘 패키지를 설치하지 않는다.
5. **에셋은 `public/images/quiz/{quiz_id}/`** 에 두고, PNG는 `yarn optimize-images`로 WebP 동반 생성한다.

---

## 1. 토큰 정의 (Token Definitions)

전용 토큰 시스템(Style Dictionary 등)은 **없다**. 토큰은 두 계층으로 나뉜다.

### (a) 전역 토큰 — `src/app/globals.css`

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
}

body {
  font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, /* ... */ sans-serif;
}
```

- 전역 색 토큰은 `--background` / `--foreground` 두 개뿐. 거의 모든 색은 퀴즈별 JSON에서 온다.
- `* { box-sizing: border-box; margin: 0; padding: 0; }` 리셋이 전역 적용됨.

### (b) 퀴즈별 토큰 — 콘텐츠 JSON `ui` 필드 (런타임 주입)

색상/타이포/간격을 **JSON으로 선언**하면 공용 컴포넌트가 인라인 `style`로 적용한다. 스키마: `src/domain/quiz.schema.ts` (`ResultUIConfigZ`, `QuestionUIConfigZ`, `LandingUIConfigZ`).

```jsonc
// src/content/tetoman/tetoman.json → "ui"
{
  "result": {
    "resultLayout": "eolppa",        // 레이아웃 프리셋 선택
    "theme": "white",
    "backgroundColor": "#2a1520",
    "loadingTextStyle": {            // CSS-in-JS 형태 (camelCase 키, string 값)
      "fontFamily": "'Noto Sans KR', sans-serif",
      "fontSize": "20px", "fontWeight": 700, "color": "#ff9ec4"
    }
  },
  "question": {
    "optionVariant": "dark",
    "progressFillColor": "#ff9ec4",
    "optionStyle": { "padding": "17px 21px", "borderRadius": "16px", "background": "rgba(255,255,255,0.05)" },
    "questionTitleStyle": { "fontSize": "20px", "fontWeight": 700, "color": "#ffffff" }
  }
}
```

**Figma → 토큰 매핑 규칙:**
- Figma의 fill/stroke hex → JSON의 `backgroundColor`, `progressFillColor`, `*Style.color` 등.
- Figma 텍스트 스타일(font, size, weight, letter-spacing) → `*Style` 객체(`questionTitleStyle`, `loadingTextStyle`, `resultHeroStyle`, `descriptionStyle` 등). **키는 React 인라인 스타일 형식(camelCase), 값은 문자열**.
- 그룹 스타일(`resultHeroStyle`, `resultImageStyle`, `contentCardStyle`)이 평면 필드(`resultHeroColor` 등)보다 **우선**한다 → 새 작업은 그룹 스타일을 선호.

### 헬퍼 스크립트: Figma 토큰 추출

`scripts/figma-extract-design.js` — Figma REST API에서 노드의 색/타이포/간격을 뽑아 JSON `ui` 채우기를 돕는다.

```bash
FIGMA_ACCESS_TOKEN=xxx node scripts/figma-extract-design.js
# 내부에 FIGMA_FILE_KEY / NODE_ID 상수가 있으니 대상에 맞게 수정
```

---

## 2. 컴포넌트 라이브러리 (Component Library)

스토리북/디자인 시스템 패키지는 **없다**. 컴포넌트는 폴더 단위 + barrel export.

```
ComponentName/
├── index.ts                  # export { default } from './ComponentName'
├── ComponentName.tsx         # 구현
└── ComponentName.module.scss # 스타일
```

- **공용 컴포넌트**: `src/components/common/` — `Header/`, `Footer/`, `QuestionCard/`, `ResultCard/`, `QuizListCard/`, `RecommendedQuizzes/`, `ResultShareActions/`, `QuizHeader/`. **새 UI는 먼저 여기서 재사용 가능한지 확인.**
- **결과 레이아웃 프리셋**: `src/components/results/` — 퀴즈마다 다른 결과 디자인은 여기에 "레이아웃"으로 등록.

### 결과 레이아웃 등록 패턴 (Figma로 새 결과 화면 만들 때 핵심)

`src/components/results/index.ts`가 `resultLayout` 문자열 → 컴포넌트를 매핑한다:

```ts
export const RESULT_LAYOUTS: Record<ResultLayout, ComponentType<ResultLayoutProps>> = {
  classic: ClassicResult, spring: SpringResult, grade: GradeResult,
  goodboyfriend: GoodBoyfriendResult, young40: Young40Result,
  soloescape: SoloEscapeResult, eolppa: EolppaResult, cctest: CcTestResult,
  coward: CowardResult, couple: CoupleResult,
};
```

**새 디자인 추가 절차:**
1. `src/components/results/{name}/{Name}Result.tsx` + `.module.scss` 생성 (`ResultLayoutProps` 사용).
2. `src/components/results/index.ts`의 `RESULT_LAYOUTS`에 등록.
3. `src/domain/quiz.schema.ts`의 `ResultLayoutZ` enum에 `'{name}'` 추가.
4. 콘텐츠 JSON `ui.result.resultLayout`에 `"{name}"` 지정.

레이아웃 컴포넌트는 `props.result`(결과 상세) + JSON `ui` 스타일을 받아 렌더한다. 텍스트는 `description`을 `\n\n` 단위로 파싱하는 컨벤션이 있다(예: `EolppaResult.tsx` — 첫 청크=소제목, `label|emoji|name` 라인=궁합).

---

## 3. 프레임워크 & 라이브러리

| 항목 | 사용 |
|------|------|
| 프레임워크 | **Next.js 15.5** (App Router) + **React 19** |
| 언어 | TypeScript 5 (strict) |
| 스타일링 | **SCSS Modules** (`sass`). Tailwind/styled-components/CSS-in-JS 라이브러리 **없음** |
| 상태관리 | Zustand 5(클라이언트), TanStack React Query 5(서버 상태) |
| 검증 | Zod 4 (콘텐츠 스키마) |
| 빌드/번들 | Next.js 내장(Turbopack/webpack). 별도 Vite 없음 (Vitest만 테스트용) |
| 캐러셀 | Swiper 12 |
| 저장소 | Vercel KV(조회수), 파일시스템(콘텐츠 JSON) |
| 테스트 | Vitest 4 + Testing Library |
| 패키지매니저 | **Yarn 1.22** |

```bash
yarn dev            # 개발 서버
yarn build          # 프로덕션 빌드
yarn test           # Vitest 1회 (content-integrity 포함)
yarn optimize-images # PNG→WebP 최적화
```

경로 별칭: `@/*` → `./src/*`, `public/*` → `./public/*` (tsconfig.json).

---

## 4. 에셋 관리 (Asset Management)

### 저장 위치
```
public/images/quiz/{quiz_id}/
├── og-image.png            # OG/썸네일 (필수)
├── content_background.png  # 배경 (선택)
├── question_1.png          # 질문 이미지 (선택)
├── result_{type}.png       # 결과 이미지 (선택, OG 공유에도 사용)
└── stamp.png               # 특수 이미지 (선택)
```
JSON에서는 `/images/quiz/{quiz_id}/...` 절대경로로 참조.

### 최적화 (`scripts/optimize-images.js`)
- 500KB 초과 PNG만 처리. **WebP 동반 생성**(quality 85) + PNG 재압축.
- 이미 `.webp`가 있으면 건너뜀. 실행: `yarn optimize-images`.
- Next.js가 자동으로 AVIF/WebP를 우선 서빙(`next.config.ts` `images.formats`).

### Next.js 이미지 설정 (`next.config.ts`)
```ts
images: {
  formats: ['image/avif', 'image/webp'],
  minimumCacheTTL: 31536000,           // 1년
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  dangerouslyAllowSVG: true,
}
```
- 별도 CDN 없음 — `public/` 정적 서빙 + Next 이미지 최적화 파이프라인 사용.

### Figma 에셋 처리 규칙
- Figma MCP가 반환하는 localhost 에셋 URL은 **그대로 사용**(임의 다운로드/플레이스홀더 생성 금지).
- 최종 확정 이미지만 `public/images/quiz/{quiz_id}/`에 배치하고 `optimize-images` 실행.

---

## 5. 아이콘 시스템 (Icon System)

- **저장**: SVG 원본은 `public/images/quiz/common/`(예: `share.svg`), 래퍼 컴포넌트는 `src/components/icons/`(`share.tsx`, `reset.tsx`).
- **import 방식**: SVGR(webpack)로 SVG를 React 컴포넌트로 가져온다. `next.config.ts`에 규칙 정의됨:
  - `import Icon from './icon.svg'` → React 컴포넌트 (기본)
  - `import Icon from './icon.svg?component'` → React 컴포넌트 (명시)
  - `import url from './icon.svg?url'` → URL 문자열
- **색상**: SVGR `replaceAttrValues`가 `#000`/`#000000` → `currentColor`로 치환 → 부모 `color`로 제어.

```tsx
// src/components/icons/share.tsx
import ShareSvg from 'public/images/quiz/common/share.svg';
export default function ShareIcon({ color = '#000', width = 24, height = 24 }) {
  return <ShareSvg width={width} height={height} style={{ color }} />;
}
```

- **네이밍**: 소문자 파일명(`share.tsx`), default export는 `XxxIcon` PascalCase.
- **아이콘 패키지 설치 금지** — Figma 페이로드의 SVG를 위 패턴으로 래핑한다.

---

## 6. 스타일링 접근법 (Styling Approach)

- **CSS Modules + SCSS** (`*.module.scss`). 컴포넌트 옆에 위치, `import styles from './X.module.scss'`.
- **전역 스타일**: `src/app/globals.css`(리셋, CSS 변수, `@font-face`)만. `layout.tsx`에서 1회 import.
- **테마/색은 SCSS에 하드코딩하지 않는다** → CSS 변수(`--option-bg` 등) + 퀴즈 JSON `ui` 인라인 스타일 조합.

### 테마링 패턴 — CSS 변수 + variant 클래스 (`QuestionCard.module.scss`)
```scss
.optionBtn {
  background-color: var(--option-bg, #fff);
  color: var(--option-color, #000);
  border: 1px solid var(--option-border, rgba(0,0,0,0.08));
}
.optionLight { --option-bg: #fff;  --option-color: #000; }
.optionDark  { --option-bg: #000;  --option-color: #fff; --option-border: rgba(255,255,255,0.12); }
.optionChuseokDark { --option-bg: #2a4a48; --option-color: #fff; }
```
→ `optionVariant`(JSON) 값으로 클래스를 선택하고, 세부 색은 변수로 오버라이드.

### 반응형
- 모바일 우선 단일 컬럼 중심(세로형 퀴즈 UI). `html, body`가 `display:flex; justify-content:center`로 중앙 정렬 + `overflow-x: clip`.
- 폭은 `%`/`max-width`/`flex`/`grid`로 처리. 고정 px는 모바일 캔버스 기준 값.
- 미디어쿼리는 필요한 컴포넌트의 `.module.scss` 안에 국소적으로.

### 폰트 (`globals.css` `@font-face`)
기본은 `Noto Sans KR`(Google Fonts CDN). 다수의 커스텀 OTF/woff2가 `@font-face`로 선언됨(예: `Yeossihyangyakeonhae`, `Shilla_Culture(B)`, `MangoByeolbyeol`, `Cafe24Classictype`, `PyeongchangPeace` 등). 로컬 폰트는 `public/fonts/`.
- Figma의 폰트는 **이미 선언된 `@font-face`를 재사용**한다. 새 폰트면 `globals.css`에 `@font-face` 추가 후 JSON `*Style.fontFamily`로 지정.

---

## 7. 프로젝트 구조 (Project Structure)

```
src/
├── app/              # Next.js App Router (페이지/API/메타)
│   ├── quiz/[id]/    # 랜딩·question·loading·result (page.tsx=Server, *.client.tsx=Client)
│   ├── globals.css   # 전역 스타일 + @font-face + CSS 변수
│   └── layout.tsx    # 루트 레이아웃
├── components/
│   ├── common/       # 공용 UI (폴더+barrel)
│   ├── results/      # 결과 레이아웃 프리셋 (resultLayout 매핑)
│   └── icons/        # SVGR 아이콘 래퍼
├── content/          # ★ 퀴즈 콘텐츠 JSON (데이터 소스 of truth)
│   ├── quiz-meta.json        # 홈 노출 메타 목록(순서 = 노출 순서)
│   └── {quiz_id}/{quiz_id}.json + index.json
├── domain/           # Zod 스키마(quiz.schema.ts), 타입, 채점 도메인
├── infrastructure/   # 레포지토리 (FS + Vercel KV)
├── lib/              # scoring, 이미지, 추천 유틸
├── store/            # Zustand (quizStore.ts)
└── types/            # 전역 d.ts (SVG 모듈 선언 등)
```

### 핵심 데이터 흐름
1. 콘텐츠 JSON(`src/content/`) → Zod 검증(`domain/quiz.schema.ts`).
2. `FSQuizRepository`가 JSON을 읽어 `TestDefinition` 반환.
3. Server Component(`page.tsx`)에서 fetch → Client Component(`*.client.tsx`)에 props 전달.
4. Zustand로 진행 상태 → `lib/scoring.ts` 채점(weighted / amount-sum / type-count) → `RESULT_LAYOUTS`로 결과 렌더.

### Server/Client 분리 규칙
- `page.tsx`는 **Server Component**(데이터 fetch). 인터랙션은 `*.client.tsx`(`'use client'`)로 분리.

### 새 퀴즈 추가 체크리스트
1. `src/content/{quiz_id}/{quiz_id}.json` 작성 (`TestDefinitionZ` 준수).
2. `src/content/{quiz_id}/index.json` 작성 (`metaList`).
3. `src/content/quiz-meta.json`의 `metas`에 등록.
4. `public/images/quiz/{quiz_id}/`에 이미지 배치 → `yarn optimize-images`.
5. `yarn test`로 content-integrity 통과 확인.

> 키 일관성: `meta.resultTypes`가 모든 키의 기준. `resultDetails`/`messages`/`weights`/`amountSumBrackets[].key`/`mapType` 전부 여기 포함돼야 함.

---

## Figma → 코드 변환 워크플로우 (요약)

`.cursor/rules/figma-to-code.mdc` 기준:

1. **URL 파싱**: `figma.com/design/:fileKey/...?node-id=1-2` → nodeId `-`를 `:`로 변환. board=FigJam(`get_figjam`).
2. **수집**: `get_design_context` → `get_screenshot`(1:1 비교) → 크면 `get_metadata`로 노드맵 후 하위 개별 fetch.
3. **변환**:
   - Tailwind 클래스 → **SCSS Module** 규칙으로.
   - 색/타이포/간격 → 가능하면 **콘텐츠 JSON `ui`** 로(퀴즈별 테마), 구조적 스타일만 `.module.scss`.
   - 폰트 → `globals.css` `@font-face` 재사용.
   - 공용 컴포넌트 재사용 우선, 새 컴포넌트는 폴더+barrel.
   - 에셋: Figma localhost URL 그대로 → 확정본만 `public/images/quiz/{quiz_id}/`.
4. **검증**: 스크린샷과 레이아웃/타이포/색/반응형/접근성 비교. `yarn test` 통과.
