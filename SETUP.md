# 환경 변수 설정 가이드

## 🚀 Vercel 배포 환경 설정 (프로덕션)

### 1. Vercel KV 데이터베이스 생성

1. [Vercel 대시보드](https://vercel.com/dashboard) 접속
2. 프로젝트 선택
3. **Storage** 탭 클릭
4. **Create Database** 버튼 클릭
5. **KV** 선택
6. 데이터베이스 이름 입력 (예: `testival-views`)
7. **Create** 클릭

### 2. 프로젝트에 KV 연결

1. 생성된 KV 데이터베이스 페이지에서
2. **Connect Project** 클릭
3. 프로젝트 선택 (`testival`)
4. **Connect** 클릭

✅ **완료!** 환경 변수가 자동으로 설정됩니다:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

### 3. 배포

```bash
git push
```

Vercel이 자동으로 빌드하고 배포합니다.

---

## 💻 로컬 개발 환경 설정

### 1. Vercel CLI 설치 (선택)

```bash
npm i -g vercel
```

### 2. 환경 변수 다운로드 (자동)

```bash
vercel env pull .env.local
```

✅ `.env.local` 파일이 자동 생성됩니다!

### 3. 수동 설정 (Vercel CLI 미사용 시)

1. Vercel 대시보드 → Storage → KV 선택
2. **.env.local** 탭 클릭
3. 표시되는 환경 변수 복사
4. 프로젝트 루트에 `.env.local` 파일 생성
5. 복사한 내용 붙여넣기

```bash
# .env.local
KV_REST_API_URL="https://your-kv-url.vercel.kv.io"
KV_REST_API_TOKEN="your-token-here"
KV_REST_API_READ_ONLY_TOKEN="your-readonly-token-here"
```

### 4. 개발 서버 실행

```bash
yarn dev
```

---

## 📁 환경 변수 파일 정리

| 파일 | 용도 | Git 커밋 |
|------|------|----------|
| `.env.example` | 필요한 환경 변수 문서화 | ✅ 커밋 |
| `.env.local` | 로컬 개발용 실제 값 | ❌ 커밋 안함 |
| `.env` | 기본값 (사용 안함) | ❌ 커밋 안함 |

---

## 🔒 보안 체크리스트

- [x] `.env.local`이 `.gitignore`에 포함됨
- [x] `.env.example`에는 실제 값이 없음
- [x] Vercel 대시보드에서만 실제 값 관리
- [x] KV 토큰은 절대 public하게 노출 안됨

---

## 🧪 테스트

### 로컬 환경 테스트

```bash
# 1. 환경 변수 확인
cat .env.local

# 2. 개발 서버 실행
yarn dev

# 3. 브라우저에서 테스트
# http://localhost:3000
```

### Vercel 환경 테스트

```bash
# 1. 배포
git push

# 2. Vercel 대시보드에서 배포 로그 확인

# 3. 프로덕션 URL 접속
# https://your-project.vercel.app
```

---

## ❓ 문제 해결

### "KV is not configured" 에러

**원인**: 환경 변수가 설정되지 않음

**해결**:
1. Vercel 대시보드 → Settings → Environment Variables 확인
2. KV 데이터베이스가 프로젝트에 연결되어 있는지 확인
3. 로컬 개발: `.env.local` 파일 존재 여부 확인

### 로컬에서 조회수가 안 보임

**원인**: `.env.local` 파일이 없거나 잘못된 값

**해결**:
```bash
# Vercel CLI로 환경 변수 다운로드
vercel env pull .env.local

# 또는 Vercel 대시보드에서 수동으로 복사
```

### 배포 후 조회수가 작동 안함

**원인**: KV 데이터베이스가 프로젝트에 연결되지 않음

**해결**:
1. Vercel 대시보드 → Storage → KV
2. "Connect Project" 버튼 클릭
3. 프로젝트 선택 후 연결

---

## 📚 참고 문서

- [Vercel KV 문서](https://vercel.com/docs/storage/vercel-kv)
- [Vercel 환경 변수 문서](https://vercel.com/docs/projects/environment-variables)
- [Next.js 환경 변수](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

