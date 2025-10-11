// app/head.tsx
export default function Head() {
  return (
    <>
      {/* ✅ AdSense 사이트 소유 확인용 메타 태그 */}
      <meta name='google-adsense-account' content='ca-pub-9943215492404656' />

      {/* ✅ 기본 문서 세팅 */}
      <meta charSet='utf-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />

      {/* ✅ 파비콘 / 아이콘 (필요 시 경로 수정) */}
      {/* <link rel='icon' href='/favicon.ico' /> */}

      {/* ✅ 오픈그래프 예시 (metadata에서도 관리 가능하지만, 고정하고 싶을 때 추가 가능) */}
      {/* 
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Testival" />
        <meta property="og:title" content="Testival" />
        <meta property="og:description" content="심리테스트 & 라이프 실험 플랫폼 Testival" />
        <meta property="og:image" content="https://testival.kr/images/og.png" />
        */}

      {/* ⚠️ 광고 스크립트는 여기 말고 app/layout.tsx 의 <Script>로 유지할 것 */}
    </>
  );
}
