import Image from 'next/image';
import styles from './Result.module.scss';

export default function Result() {
  return (
    <section className={styles.result} aria-label='테스트 결과'>
      {/* 배경 레이어 */}
      <div className={styles.bg} aria-hidden />

      {/* 상단 타이틀 */}
      <header className={styles.header}>
        <p className={styles.kicker}>당신의 테스트 결과는..</p>
        <h1 className={styles.title}>
          <span className={styles.emoji} aria-hidden>
            🚗
          </span>
          <strong>운전자석형</strong>
          <span className={styles.emoji} aria-hidden>
            🚗
          </span>
        </h1>
      </header>

      {/* 결과 일러스트 카드 */}
      <figure className={styles.figure} aria-label='결과 이미지'>
        <div className={styles.figureInner}>
          <Image
            src='/result_1.png' // 교체
            alt=''
            fill
            sizes='(max-width: 480px) 80vw, 425px'
            priority
          />
        </div>
      </figure>

      {/* 한 문장 결과(인용) */}
      <blockquote className={styles.quote}>
        <p>“내가 알아서 할 테니까 넌 그냥 가만히 앉아 있어.”</p>
      </blockquote>

      {/* 설명 카드 */}
      <section className={styles.card} aria-labelledby='desc-heading'>
        <h2 id='desc-heading' className={styles.cardTitle}>
          설명
        </h2>
        <div className={styles.cardBody}>
          <p>
            당신은 오늘 여행의 수퍼바이저. 일정표, 내비, 정산까지 다 챙기는
            여행대장.
          </p>
          <p>
            다들 어리바리할 때 혼자 깨어 있고, 무슨 일이 생기면 제일 먼저
            해결하러 드는 사람.
          </p>
          <p>근데 또 은근히 이 역할 즐기는 거 다 안다? 😏</p>
        </div>
        {/* 공유 문구 */}
        <h2 id='share-heading' className={styles.cardTitle}>
          공유 문구
        </h2>
        <div className={styles.cardBody}>
          <p>응, 나 없으면 여행 못 가~</p>
          <p>#운전석 #리더 #책임감</p>
        </div>
      </section>
      <button className={styles.shareBtn}>테스트 공유하기</button>
    </section>
  );
}
