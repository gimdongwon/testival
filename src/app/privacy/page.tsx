import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description:
    'Testival 개인정보처리방침 - 이용자의 개인정보 보호를 위한 처리 방침을 안내합니다.',
  robots: {
    index: true,
    follow: true,
  },
};

const EFFECTIVE_DATE = '2025년 6월 1일';

const PrivacyPage = () => {
  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <h1 className={styles.title}>개인정보처리방침</h1>
        <p className={styles.effectiveDate}>시행일: {EFFECTIVE_DATE}</p>

        <div className={styles.content}>
          <section className={styles.section}>
            <p className={styles.intro}>
              Testival(이하 &quot;서비스&quot;)은 이용자의 개인정보를
              중요시하며, 「개인정보 보호법」 등 관련 법령을 준수합니다. 본
              개인정보처리방침을 통해 이용자의 개인정보가 어떻게 처리되고
              보호되는지 안내드립니다.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. 개인정보의 처리 목적</h2>
            <p className={styles.text}>
              서비스는 다음의 목적으로 개인정보를 처리합니다. 처리하는
              개인정보는 다음 목적 이외의 용도로 이용되지 않으며, 목적이
              변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행합니다.
            </p>
            <ul className={styles.list}>
              <li>
                서비스 제공 및 운영: 심리테스트 콘텐츠 제공, 퀴즈 결과 표시
              </li>
              <li>
                서비스 이용 통계 분석: 방문자 수, 페이지 조회 현황 등 서비스
                개선을 위한 통계 분석
              </li>
              <li>
                광고 게재: Google AdSense, 쿠팡파트너스를 통한 맞춤형 광고 제공
              </li>
              <li>서비스 안정성 확보: 서비스 오류 파악 및 성능 모니터링</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. 수집하는 개인정보 항목</h2>
            <p className={styles.text}>
              서비스는 회원가입을 통해 이름, 이메일, 전화번호 등
              개인식별정보를 직접 입력받지 않습니다. 다만, 서비스 이용
              과정에서 IP 주소, 쿠키 등 일부 정보가 자동으로 수집될 수
              있습니다.
            </p>

            <h3 className={styles.subTitle}>자동 수집 항목</h3>
            <p className={styles.text}>
              서비스 이용 과정에서 아래와 같은 정보가 자동으로 생성·수집될 수
              있습니다.
            </p>
            <ul className={styles.list}>
              <li>접속 IP 주소, 브라우저 종류 및 버전, 운영체제 정보</li>
              <li>방문 일시, 페이지 조회 기록, 서비스 이용 패턴</li>
              <li>기기 정보 (화면 해상도, 기기 유형 등)</li>
              <li>쿠키(Cookie) 및 유사 기술을 통한 정보</li>
            </ul>

            <h3 className={styles.subTitle}>서비스 이용 중 생성되는 정보</h3>
            <ul className={styles.list}>
              <li>
                퀴즈 조회수: 각 테스트의 조회수가 익명 카운트 형태로 서버에
                저장됩니다. 개별 이용자를 식별할 수 없습니다.
              </li>
              <li>
                퀴즈 선택 응답: 테스트 진행 중 선택한 답변은 브라우저 메모리에만
                임시 저장되며, 서버로 전송되거나 저장되지 않습니다. 페이지를
                떠나면 즉시 삭제됩니다.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              3. 개인정보의 보유 및 이용 기간
            </h2>
            <p className={styles.text}>
              서비스는 개인식별정보를 직접 입력받지 않으므로 별도의 보유
              기간이 적용되지 않습니다. 자동 수집 정보의 보유 기간은 다음과
              같습니다.
            </p>
            <ul className={styles.list}>
              <li>
                퀴즈 조회수 데이터: 서비스 운영 목적 달성 시까지 보유하며,
                최대 3년을 초과하지 않습니다
              </li>
              <li>
                세션 저장소(sessionStorage) 데이터: 브라우저 탭 또는 창 종료 시
                자동 삭제
              </li>
              <li>
                브라우저 메모리 데이터(퀴즈 선택 응답): 페이지 이탈 시 즉시 삭제
              </li>
              <li>쿠키 데이터: 각 제3자 서비스의 정책에 따름</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              4. 쿠키(Cookie) 사용에 관한 사항
            </h2>
            <p className={styles.text}>
              서비스는 자체적으로 쿠키를 설정하지 않으나, 아래 제3자 서비스에
              의해 쿠키가 사용될 수 있습니다.
            </p>

            <div className={styles.table}>
              <div className={styles.tableHeader}>
                <span className={styles.tableCell}>서비스</span>
                <span className={styles.tableCell}>목적</span>
              </div>
              <div className={styles.tableRow}>
                <span className={styles.tableCell}>Google Analytics</span>
                <span className={styles.tableCell}>
                  방문자 통계 분석 및 서비스 개선
                </span>
              </div>
              <div className={styles.tableRow}>
                <span className={styles.tableCell}>Google Tag Manager</span>
                <span className={styles.tableCell}>
                  마케팅 태그 및 스크립트 관리
                </span>
              </div>
              <div className={styles.tableRow}>
                <span className={styles.tableCell}>Google AdSense</span>
                <span className={styles.tableCell}>
                  맞춤형 광고 제공 (DoubleClick 쿠키 포함)
                </span>
              </div>
              <div className={styles.tableRow}>
                <span className={styles.tableCell}>쿠팡파트너스</span>
                <span className={styles.tableCell}>제휴 광고 및 구매 추적</span>
              </div>
              <div className={styles.tableRow}>
                <span className={styles.tableCell}>Vercel Analytics</span>
                <span className={styles.tableCell}>서비스 성능 모니터링</span>
              </div>
            </div>

            <h3 className={styles.subTitle}>
              Google AdSense 및 광고 쿠키 안내
            </h3>
            <p className={styles.text}>
              서비스는 Google AdSense를 통해 광고를 게재하며, 이 과정에서
              다음과 같은 기술이 사용됩니다.
            </p>
            <ul className={styles.list}>
              <li>
                Google은 DoubleClick 쿠키를 사용하여 이용자의 관심사에
                기반한 맞춤형 광고를 제공합니다.
              </li>
              <li>
                제3자 광고 파트너(광고 네트워크)가 쿠키를 사용하여 이용자에게
                적합한 광고를 표시할 수 있습니다.
              </li>
              <li>
                이용자는{' '}
                <a
                  href='https://adssettings.google.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className={styles.link}
                  aria-label='Google 광고 설정 페이지 (새 탭에서 열림)'
                >
                  Google 광고 설정
                </a>
                에서 맞춤형 광고를 비활성화할 수 있습니다.
              </li>
              <li>
                또한{' '}
                <a
                  href='https://www.aboutads.info/choices/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className={styles.link}
                  aria-label='DAA 옵트아웃 페이지 (새 탭에서 열림)'
                >
                  www.aboutads.info
                </a>
                를 통해 제3자 광고 쿠키 사용을 거부할 수 있습니다.
              </li>
            </ul>
            <p className={styles.text}>
              유럽경제지역(EEA) 및 영국 소재 이용자의 경우, 관련 법령에 따라
              광고 쿠키 사용 전 별도의 동의를 요청할 수 있습니다.
            </p>

            <h3 className={styles.subTitle}>쿠키 동의 및 거부 방법</h3>
            <p className={styles.text}>
              서비스는 이용자의 최초 방문 시 쿠키 사용에 대한 동의를 요청할 수
              있습니다. 이용자는 동의 배너를 통해 쿠키 사용을 수락하거나
              거부할 수 있으며, 웹 브라우저 설정을 통해서도 쿠키 저장을
              거부하거나 삭제할 수 있습니다. 다만, 쿠키를 거부할 경우 일부
              서비스 이용에 제한이 있을 수 있습니다.
            </p>
            <ul className={styles.list}>
              <li>
                Chrome: 설정 → 개인정보 및 보안 → 쿠키 및 기타 사이트 데이터
              </li>
              <li>
                Safari: 환경설정 → 개인정보 보호 → 쿠키 및 웹 사이트 데이터 관리
              </li>
              <li>Firefox: 설정 → 개인정보 및 보안 → 쿠키 및 사이트 데이터</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              5. 개인정보의 제3자 제공 및 위탁
            </h2>
            <p className={styles.text}>
              서비스는 이용자의 정보를 판매하거나 임의로 제3자에게 제공하지
              않습니다. 다만, 서비스 운영을 위해 아래 제3자 서비스와의 연동
              과정에서 자동 수집된 정보가 해당 서비스로 전송될 수 있습니다.
            </p>

            <div className={styles.table}>
              <div className={styles.tableHeader}>
                <span className={styles.tableCell}>업체명</span>
                <span className={styles.tableCell}>목적</span>
                <span className={styles.tableCell}>항목</span>
              </div>
              <div className={styles.tableRow}>
                <span className={styles.tableCell}>Google LLC</span>
                <span className={styles.tableCell}>통계 분석, 광고</span>
                <span className={styles.tableCell}>
                  쿠키, 접속 로그, 기기 정보
                </span>
              </div>
              <div className={styles.tableRow}>
                <span className={styles.tableCell}>Vercel Inc.</span>
                <span className={styles.tableCell}>호스팅, 성능 분석</span>
                <span className={styles.tableCell}>접속 로그, 성능 데이터</span>
              </div>
              <div className={styles.tableRow}>
                <span className={styles.tableCell}>쿠팡</span>
                <span className={styles.tableCell}>제휴 광고</span>
                <span className={styles.tableCell}>쿠키, 클릭 정보</span>
              </div>
            </div>

            <p className={styles.text}>
              각 서비스의 개인정보처리방침은 아래 링크에서 확인하실 수 있습니다.
            </p>
            <ul className={styles.list}>
              <li>
                <a
                  href='https://policies.google.com/privacy'
                  target='_blank'
                  rel='noopener noreferrer'
                  className={styles.link}
                  aria-label='Google 개인정보처리방침 (새 탭에서 열림)'
                >
                  Google 개인정보처리방침
                </a>
              </li>
              <li>
                <a
                  href='https://vercel.com/legal/privacy-policy'
                  target='_blank'
                  rel='noopener noreferrer'
                  className={styles.link}
                  aria-label='Vercel 개인정보처리방침 (새 탭에서 열림)'
                >
                  Vercel Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href='https://privacy.coupang.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className={styles.link}
                  aria-label='쿠팡 개인정보처리방침 (새 탭에서 열림)'
                >
                  쿠팡 개인정보처리방침
                </a>
              </li>
            </ul>

            <h3 className={styles.subTitle}>개인정보의 해외 이전</h3>
            <p className={styles.text}>
              서비스는 Google LLC(미국), Vercel Inc.(미국) 등 해외에 서버를
              둔 제3자 서비스를 이용하고 있으며, 서비스 이용 과정에서 수집된
              정보가 해당 서비스의 해외 서버로 전송·저장될 수 있습니다. 각
              서비스 제공자는 자사의 개인정보처리방침에 따라 적절한 보호
              조치를 적용하고 있습니다.
            </p>
            <p className={styles.text}>
              유럽경제지역(EEA), 영국, 스위스 소재 이용자의 경우, 해당
              서비스 제공자가 EU 표준계약조항(SCC) 등 적절한 보호 장치를
              적용하여 개인정보를 이전하고 있습니다. 이용자는 자신의
              개인정보에 대한 접근, 정정, 삭제, 처리 제한, 이동성에 대한
              권리를 행사할 수 있으며, 관련 문의는 아래 개인정보
              보호책임자에게 연락해 주시기 바랍니다.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              6. 이용자의 권리와 행사 방법
            </h2>
            <p className={styles.text}>
              이용자는 다음과 같은 권리를 행사할 수 있습니다.
            </p>
            <ul className={styles.list}>
              <li>
                <strong>쿠키 수집 거부:</strong> 브라우저 설정을 통해 쿠키
                저장을 거부할 수 있습니다.
              </li>
              <li>
                <strong>Google 광고 개인화 설정:</strong>{' '}
                <a
                  href='https://adssettings.google.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className={styles.link}
                  aria-label='Google 광고 설정 (새 탭에서 열림)'
                >
                  Google 광고 설정
                </a>
                에서 맞춤 광고를 비활성화할 수 있습니다.
              </li>
              <li>
                <strong>Google Analytics 수집 거부:</strong>{' '}
                <a
                  href='https://tools.google.com/dlpage/gaoptout'
                  target='_blank'
                  rel='noopener noreferrer'
                  className={styles.link}
                  aria-label='Google Analytics Opt-out 브라우저 부가기능 (새 탭에서 열림)'
                >
                  Google Analytics Opt-out 브라우저 부가기능
                </a>
                을 설치하여 데이터 수집을 차단할 수 있습니다.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              7. 개인정보의 파기 절차 및 방법
            </h2>
            <p className={styles.text}>
              서비스는 이용자의 개인식별정보를 직접 입력받지 않으므로 별도의
              파기 절차가 적용되지 않습니다. 자동 수집된 정보는 다음과 같이
              처리됩니다.
            </p>
            <ul className={styles.list}>
              <li>브라우저 메모리 저장 데이터: 페이지 이탈 시 자동 삭제</li>
              <li>세션 저장소 데이터: 브라우저 종료 시 자동 삭제</li>
              <li>
                제3자 서비스 쿠키: 각 서비스의 정책에 따라 관리되며, 이용자가
                브라우저 설정을 통해 직접 삭제 가능
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. 개인정보 보호책임자</h2>
            <p className={styles.text}>
              서비스의 개인정보 처리에 관한 업무를 총괄하는 개인정보
              보호책임자는 다음과 같습니다.
            </p>
            <div className={styles.contactInfo}>
              <p>서비스명: Testival</p>
              <p>
                이메일:{' '}
                <a
                  href='mailto:testival2025@gmail.com'
                  className={styles.link}
                  aria-label='Testival 이메일로 문의하기'
                >
                  testival2025@gmail.com
                </a>
              </p>
              <p>
                Instagram:{' '}
                <a
                  href='https://www.instagram.com/testival.official/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className={styles.link}
                  aria-label='Testival 인스타그램 (새 탭에서 열림)'
                >
                  @testival.official
                </a>
              </p>
              <p>
                X (Twitter):{' '}
                <a
                  href='https://x.com/testival2025'
                  target='_blank'
                  rel='noopener noreferrer'
                  className={styles.link}
                  aria-label='Testival X 계정 (새 탭에서 열림)'
                >
                  @testival2025
                </a>
              </p>
            </div>
            <p className={styles.text}>
              이용자는 서비스 이용 과정에서 발생한 모든 개인정보 보호 관련 문의,
              불만, 피해구제 등에 관한 사항을 위 이메일 또는 SNS 계정으로 문의하실 수 있습니다.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>9. 아동의 개인정보 보호</h2>
            <p className={styles.text}>
              서비스는 회원가입 절차가 없어 이용자의 연령을 확인하지 않으며,
              만 14세 미만 아동을 대상으로 별도의 개인식별정보를 수집하거나
              저장하지 않습니다. 만 14세 미만 아동의 법정대리인이 자동 수집된
              정보(쿠키 등)에 관해 문의하거나 삭제를 요청하고자 하는 경우,
              아래 개인정보 보호책임자에게 연락해 주시기 바랍니다.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>10. 개인정보처리방침의 변경</h2>
            <p className={styles.text}>
              본 개인정보처리방침은 법령이나 서비스 변경에 따라 내용이 추가,
              삭제 또는 수정될 수 있습니다. 변경 시에는 시행일 최소 7일 전에
              서비스 내 공지를 통해 알려드리겠습니다.
            </p>
            <p className={styles.text}>
              본 방침은 <strong>{EFFECTIVE_DATE}</strong>부터 시행됩니다.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
