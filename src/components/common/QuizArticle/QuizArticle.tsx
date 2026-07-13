import React from 'react';
import styles from './QuizArticle.module.scss';
import type { ArticleSection } from '@/domain/quiz.schema';

/** `**굵게**` 마커를 <strong>으로 변환한 인라인 노드로 렌더 */
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i}>{part}</strong>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );
}

interface QuizArticleProps {
  sections: ArticleSection[];
}

/**
 * 퀴즈 랜딩 하단의 장문 정보성 콘텐츠를 시맨틱 HTML(h2/h3/p/ul)로 렌더한다.
 * 서버 컴포넌트에서 그대로 사용하며, 크롤러가 읽는 본문 텍스트를 늘리는 것이 목적.
 */
export default function QuizArticle({ sections }: QuizArticleProps) {
  return (
    <div className={styles.article}>
      {sections.map((section, si) => (
        <section key={si} className={styles.section}>
          <h2 className={styles.heading}>{section.heading}</h2>
          {section.body.map((block, bi) => {
            if (block.type === 'h3') {
              return (
                <h3 key={bi} className={styles.subheading}>
                  {renderInline(block.text)}
                </h3>
              );
            }
            if (block.type === 'ul') {
              return (
                <ul key={bi} className={styles.list}>
                  {block.items.map((item, ii) => (
                    <li key={ii}>{renderInline(item)}</li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={bi} className={styles.paragraph}>
                {renderInline(block.text)}
              </p>
            );
          })}
        </section>
      ))}
    </div>
  );
}
