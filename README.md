# Testival

## Todo

- [] 스타일링 완성
  - [] 메인
  - [] 질문
  - [] 결과
- [] 가중치 로직 개발
- [] 결과 페이지 매핑
- [] 배포

## page naming

- `/`: 메인 페이지로 home 기능
- `/quiz/:id/:pageNum`: 퀴즈 도메인으로 id는 quiz의 id이고 pageNum은 해당 퀴즈의 page 순서를 의미함
- `/quiz/:id/loading`: loading 페이지
- `/quiz/:id/result`: 해당 퀴즈 도메인의 결과를 보여주는 페이지로 새로고침 시

## use library

- zod: 런타임에서 데이터 형태를 검증하고(Type Guard), 동시에 TypeScript 타입을 생성/일치시켜주는 작은 라이브러리 => 외부/파일에서 들어오는 JSON이 스키마대로 맞는지 실행 시점에 확인하고, 맞다면 타입이 자동으로 좁혀져 이후 코드가 안전해짐.
- zustand

## 참고 사항

- 테스트 중 새로고침시 테스트 맨 처음 페이지로 이동
