'use client';

import { useEffect, useRef } from 'react';
import styles from './CoupangAd.module.scss';

const COUPANG_AD_CONFIG = {
  id: 965320,
  template: 'carousel',
  trackingCode: 'AF2539500',
  width: '430',
  height: '100',
  tsource: '',
};

const CoupangAd = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current || !iframeRef.current) return;
    isInitialized.current = true;

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          html, body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            width: 100%;
          }
        </style>
      </head>
      <body>
        <script src="https://ads-partners.coupang.com/g.js"><\/script>
        <script>new PartnersCoupang.G(${JSON.stringify(COUPANG_AD_CONFIG)});<\/script>
      </body>
      </html>
    `);
    doc.close();
  }, []);

  return (
    <aside className={styles.coupangAd} aria-label='쿠팡 파트너스 광고'>
      <iframe
        ref={iframeRef}
        className={styles.adIframe}
        title='쿠팡 파트너스 광고'
        scrolling='no'
      />
      <p className={styles.disclosure}>
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를
        제공받습니다.
      </p>
    </aside>
  );
};

export default CoupangAd;
