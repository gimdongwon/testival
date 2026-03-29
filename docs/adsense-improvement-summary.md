# Google 에드센스 승인을 위한 개선 작업 요약

> 작성일: 2026-03-28
> 상태: 코드 구현 완료 / 배포 및 후속 작업 필요

---

## 배경

Google 에드센스 신청 시 **"가치가 별로 없는 콘텐츠"** 사유로 반복 거절.
사이트가 Google 게시자 네트워크의 사용 기준(최소 콘텐츠 요건, 고유 콘텐츠, 우수한 사용자 환경)을 충족하지 못하는 것으로 판단됨.

---

## 분석 결과 (거절 원인)

### 1. 텍스트 콘텐츠 부족 (핵심 원인)
- **홈페이지**: 이미지 슬라이더 + 퀴즈 카드 목록만 존재. 서비스 소개 텍스트 없음
- **퀴즈 랜딩 페이지** (`/quiz/[id]`): 이미지 1장 + "테스트 시작하기" 버튼만 존재. 텍스트 콘텐츠 제로
- **결과 페이지**: 클라이언트 사이드 렌더링(CSR) → Googlebot이 콘텐츠를 읽지 못함

### 2. 필수 법적 페이지 누락
- 이용약관 페이지 없음 (에드센스 필수 요구사항)

### 3. 사이트 구조 미비
- Footer 없음 → 사이트 전문성·신뢰성 부족
- 사이트맵에 정적 페이지 미포함 (`/about`, `/contact`, `/privacy`)
- Google Search Console 인증 코드가 플레이스홀더 상태

---

## 완료된 작업

### A. 이용약관 페이지 추가 (`/terms`)
- 12개 조항으로 구성된 이용약관 페이지 신규 생성
- 서비스 제공, 지식재산권, 이용자 의무, 광고 게재, 면책 조항 등 포함

### B. Footer 컴포넌트 추가
- About, 이용약관, 개인정보처리방침, Contact 링크
- SNS 링크 (Instagram, YouTube, TikTok, X)
- 이메일 문의, 저작권 표시, 면책 조항
- 적용 페이지: 홈, About, Contact, Privacy, Terms, 퀴즈 랜딩

### C. 퀴즈 랜딩 페이지 콘텐츠 강화 (`/quiz/[id]`)
- 기존: 이미지 + 버튼만 존재
- 추가: 퀴즈 제목(h1), 설명, 문항 수, 소요 시간, 결과 유형 수, 테스트 방식
- 결과 유형 미리보기 (태그 형태)
- 안내사항 섹션 (회원가입 불필요, 데이터 미저장 등)
- "지금 바로 시작하기" 추가 CTA 버튼

### D. 홈페이지 콘텐츠 강화
- 섹션 제목을 h1으로 변경 + 서비스 소개 subtitle 추가
- FAQ 섹션 5개 항목 (서비스 소개, 회원가입, 결과 정확성, 데이터 저장, 결과 공유)

### E. 사이트맵 보강 (`sitemap.ts`)
- `/about`, `/contact`, `/terms`, `/privacy` 페이지 추가

### F. 네비게이션 보강
- Header 메뉴에 이용약관 링크 추가

### G. Google verification 개선
- 하드코딩된 플레이스홀더 → `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` 환경변수로 변경

---

## 변경 파일 목록

| 파일 | 유형 | 설명 |
|------|------|------|
| `src/app/terms/page.tsx` | 신규 | 이용약관 페이지 |
| `src/app/terms/page.module.scss` | 신규 | 이용약관 스타일 |
| `src/components/common/Footer/Footer.tsx` | 신규 | Footer 컴포넌트 |
| `src/components/common/Footer/Footer.module.scss` | 신규 | Footer 스타일 |
| `src/components/common/Footer/index.ts` | 신규 | Footer export |
| `src/app/page.tsx` | 수정 | 홈 - h1 태그 + subtitle + FAQ 추가, Footer 추가 |
| `src/app/page.module.scss` | 수정 | 홈 - 스타일 추가 |
| `src/app/quiz/[id]/page.tsx` | 수정 | 퀴즈 랜딩 - 텍스트 콘텐츠 + Footer 추가 |
| `src/app/quiz/[id]/detail.module.scss` | 수정 | 퀴즈 랜딩 - 스타일 추가 |
| `src/app/about/page.tsx` | 수정 | Footer 추가 |
| `src/app/contact/page.tsx` | 수정 | Footer 추가 |
| `src/app/privacy/page.tsx` | 수정 | Footer 추가 |
| `src/components/common/Header/Header.tsx` | 수정 | 이용약관 네비게이션 추가 |
| `src/app/sitemap.ts` | 수정 | 정적 페이지 4개 추가 |
| `src/app/layout.tsx` | 수정 | verification 환경변수화 |

---

## 남은 작업 (배포 후)

### 필수
- [ ] `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` 환경변수에 실제 인증 코드 설정
- [ ] Vercel 배포
- [ ] Google Search Console에서 사이트맵 재제출
- [ ] 주요 페이지 URL 검사 → 색인 요청 (홈, 퀴즈 랜딩, about, terms, privacy)

### 권장 (승인률 향상)
- [ ] `quiz-meta.json`의 description 필드 보강 (현재 "Testival - ..."처럼 동일 패턴이 많음 → 각 퀴즈별 고유 설명으로 변경)
- [ ] 퀴즈 개수 확대 (현재 14개 → 20개 이상 권장)
- [ ] 색인 완료 확인 후 에드센스 재신청 (배포 후 최소 2~4주 대기)
- [ ] Lighthouse 성능 점검

---

## 기대 효과

| 항목 | Before | After |
|------|--------|-------|
| 홈 서버 렌더링 텍스트 | 거의 없음 | h1 + subtitle + FAQ 5개 |
| 퀴즈 랜딩 텍스트 | 없음 | 제목, 설명, 메타정보, 결과 미리보기, 안내사항 |
| 법적 페이지 | 개인정보처리방침만 | + 이용약관 |
| 사이트 네비게이션 | Header만 | Header + Footer (전체 페이지) |
| 사이트맵 URL 수 | 홈 + 퀴즈만 | + about, contact, terms, privacy |
