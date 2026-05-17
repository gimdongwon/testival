import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: '이용약관',
  description:
    'Testival 이용약관 - 서비스 이용에 관한 기본적인 사항을 안내합니다.',
  robots: {
    index: true,
    follow: true,
  },
};

const EFFECTIVE_DATE = '2025년 6월 1일';

const TermsPage = () => {
  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <h1 className={styles.title}>이용약관</h1>
        <p className={styles.effectiveDate}>시행일: {EFFECTIVE_DATE}</p>

        <div className={styles.content}>
          <section className={styles.section}>
            <p className={styles.intro}>
              본 약관은 Testival(이하 &quot;서비스&quot;)의 이용에 관한 기본적인
              사항을 규정합니다. 서비스를 이용하시는 경우, 본 약관에 동의하는
              것으로 간주됩니다.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>제1조 (목적)</h2>
            <p className={styles.text}>
              본 약관은 Testival이 제공하는 온라인 심리테스트 서비스(이하
              &quot;서비스&quot;)의 이용 조건 및 절차, 이용자와 서비스 간의 권리,
              의무 및 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>제2조 (용어의 정의)</h2>
            <ul className={styles.list}>
              <li>
                <strong>&quot;서비스&quot;</strong>란 Testival이 운영하는
                웹사이트(testival.kr)를 통해 제공되는 심리테스트, 성격 테스트, 재미
                테스트 및 관련 콘텐츠를 의미합니다.
              </li>
              <li>
                <strong>&quot;이용자&quot;</strong>란 본 약관에 따라 서비스를
                이용하는 모든 방문자를 의미합니다.
              </li>
              <li>
                <strong>&quot;콘텐츠&quot;</strong>란 서비스에서 제공하는 테스트
                문항, 결과, 이미지, 텍스트 등 일체의 정보를 의미합니다.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>제3조 (약관의 효력 및 변경)</h2>
            <ul className={styles.list}>
              <li>
                본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게
                공지함으로써 효력을 발생합니다.
              </li>
              <li>
                서비스는 합리적인 사유가 발생할 경우 관련 법령에 위배되지 않는
                범위에서 본 약관을 변경할 수 있으며, 변경된 약관은 적용일 7일
                전부터 서비스 내 공지를 통해 알려드립니다.
              </li>
              <li>
                변경된 약관에 동의하지 않으시는 경우 서비스 이용을 중단하실 수
                있으며, 계속 이용하시는 경우 변경된 약관에 동의한 것으로
                간주됩니다.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>제4조 (서비스의 제공)</h2>
            <p className={styles.text}>
              서비스는 다음과 같은 콘텐츠를 제공합니다.
            </p>
            <ul className={styles.list}>
              <li>
                다양한 주제의 심리테스트 및 성격 테스트 (성격, 여행, 명절, 트렌드
                등)
              </li>
              <li>테스트 결과 분석 및 유형 설명</li>
              <li>테스트 결과 공유 기능</li>
              <li>추천 테스트 안내</li>
            </ul>
            <p className={styles.text}>
              서비스는 회원가입 없이 누구나 무료로 이용할 수 있습니다. 서비스의
              내용은 운영 상황에 따라 변경, 추가, 중단될 수 있습니다.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>제5조 (서비스 이용)</h2>
            <ul className={styles.list}>
              <li>
                서비스는 연중무휴 24시간 제공을 원칙으로 하나, 시스템 점검, 서버
                장애 등 불가피한 경우 일시적으로 중단될 수 있습니다.
              </li>
              <li>
                서비스는 무료로 제공되며, 이용에 필요한 통신 요금 등은 이용자
                본인이 부담합니다.
              </li>
              <li>
                테스트 응답 데이터는 서버에 저장되지 않으며, 브라우저 메모리에만
                임시 저장됩니다.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>제6조 (지식재산권)</h2>
            <ul className={styles.list}>
              <li>
                서비스에서 제공하는 모든 콘텐츠(테스트 문항, 결과 텍스트, 이미지,
                디자인 등)에 대한 저작권 및 지식재산권은 Testival에 귀속됩니다.
              </li>
              <li>
                이용자는 서비스를 통해 제공받은 콘텐츠를 개인적 용도로만 이용할 수
                있으며, 상업적 목적으로 복제, 배포, 전송, 출판 등에 이용할 수
                없습니다.
              </li>
              <li>
                테스트 결과를 SNS 등에 공유하는 것은 허용되나, 서비스의 콘텐츠를
                무단으로 수정하거나 서비스의 출처를 표시하지 않고 재배포하는 것은
                금지됩니다.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>제7조 (이용자의 의무)</h2>
            <p className={styles.text}>
              이용자는 서비스 이용 시 다음 행위를 하여서는 안 됩니다.
            </p>
            <ul className={styles.list}>
              <li>
                서비스의 안정적 운영을 방해하는 행위 (비정상적 트래픽 유발, 해킹
                시도 등)
              </li>
              <li>서비스의 콘텐츠를 무단으로 크롤링, 수집, 복제하는 행위</li>
              <li>타인의 명예를 훼손하거나 불이익을 주는 행위</li>
              <li>관련 법령에 위배되는 행위</li>
              <li>
                기타 서비스의 정상적인 운영을 방해하거나 공공질서 및 미풍양속에
                반하는 행위
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>제8조 (광고 게재)</h2>
            <p className={styles.text}>
              서비스는 운영 및 유지를 위해 서비스 내에 광고를 게재할 수 있습니다.
            </p>
            <ul className={styles.list}>
              <li>
                서비스에는 Google AdSense 등 제3자 광고 네트워크를 통한 광고가
                표시될 수 있습니다.
              </li>
              <li>
                광고 게재로 인해 이용자에게 발생하는 손실이나 손해에 대해 서비스는
                책임을 지지 않습니다.
              </li>
              <li>
                광고와 관련된 거래는 이용자와 광고주 간의 문제이며, 서비스는
                중개자로서의 역할을 하지 않습니다.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>제9조 (면책 조항)</h2>
            <ul className={styles.list}>
              <li>
                서비스에서 제공하는 테스트 결과는 오락 및 참고 목적으로만
                제공되며, 전문적인 심리 상담이나 진단을 대체하지 않습니다.
              </li>
              <li>
                서비스는 이용자가 서비스를 통해 얻은 정보에 대해 정확성, 완전성을
                보장하지 않으며, 이로 인해 발생하는 손해에 대해 책임을 지지
                않습니다.
              </li>
              <li>
                천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력으로 인한
                서비스 제공 불능에 대해서는 책임을 지지 않습니다.
              </li>
              <li>
                이용자가 서비스 이용 과정에서 타인에게 끼친 피해에 대해서는
                해당 이용자가 직접 책임을 부담합니다.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>제10조 (개인정보 보호)</h2>
            <p className={styles.text}>
              서비스는 이용자의 개인정보 보호를 위해 노력하며, 개인정보의 처리에
              관한 사항은{' '}
              <a href='/privacy' className={styles.link}>
                개인정보처리방침
              </a>
              에 따릅니다.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>제11조 (분쟁 해결)</h2>
            <ul className={styles.list}>
              <li>
                서비스와 이용자 간에 발생한 분쟁에 대해서는 상호 협의를 통해
                원만히 해결하도록 노력합니다.
              </li>
              <li>
                협의가 이루어지지 않을 경우, 대한민국 법률에 따르며 관할 법원은
                민사소송법에 따른 법원으로 합니다.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              제12조 (약관의 해석 및 준거법)
            </h2>
            <ul className={styles.list}>
              <li>본 약관에서 정하지 않은 사항은 관련 법령에 따릅니다.</li>
              <li>본 약관의 해석 및 서비스 이용에 관하여는 대한민국 법을 적용합니다.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>부칙</h2>
            <p className={styles.text}>
              본 약관은 <strong>{EFFECTIVE_DATE}</strong>부터 시행됩니다.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>문의하기</h2>
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
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;
