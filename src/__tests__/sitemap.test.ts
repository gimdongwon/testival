import { describe, it, expect } from 'vitest';
import sitemap from '@/app/sitemap';
import { getQuizRepository } from '@/infrastructure/quiz.repository';

describe('sitemap', () => {
  it('정적 페이지 5종을 포함한다', async () => {
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain('https://testival.kr');
    expect(urls).toContain('https://testival.kr/about');
    expect(urls).toContain('https://testival.kr/contact');
    expect(urls).toContain('https://testival.kr/terms');
    expect(urls).toContain('https://testival.kr/privacy');
  });

  it('quiz 랜딩 페이지를 포함하지만 question/result 베이스 URL은 포함하지 않는다', async () => {
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain('https://testival.kr/quiz/solo_escape');
    expect(urls).not.toContain('https://testival.kr/quiz/solo_escape/question');
    expect(urls).not.toContain('https://testival.kr/quiz/solo_escape/result');
  });

  it('result type별 파라미터 URL은 sitemap에서 제외한다(개인 결과 인스턴스, noindex 대상)', async () => {
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);
    const repo = getQuizRepository();
    const list = await repo.list();
    for (const item of list) {
      const def = await repo.getById(item.meta.id);
      if (!def) continue;
      for (const type of def.meta.resultTypes) {
        expect(urls).not.toContain(
          `https://testival.kr/quiz/${item.meta.id}/result?type=${type}`,
        );
      }
    }
  });

  it('가이드 인덱스를 sitemap에 포함한다', async () => {
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain('https://testival.kr/guide');
  });
});
