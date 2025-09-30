// app/quiz/[id]/result/page.tsx
import ResultClient from './result.client';

export const revalidate = 600;

export default async function Page() {
  return <ResultClient />;
}
