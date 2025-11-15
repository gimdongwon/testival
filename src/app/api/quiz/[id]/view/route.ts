import { NextRequest, NextResponse } from 'next/server';

// KV 클라이언트 타입 정의
type KVClient = {
  get: <T = unknown>(key: string) => Promise<T | null>;
  incr: (key: string) => Promise<number>;
};

let kv: KVClient | null = null;

// 환경 변수가 유효한 경우에만 KV 클라이언트 초기화
if (
  process.env.KV_REST_API_URL &&
  process.env.KV_REST_API_TOKEN &&
  process.env.KV_REST_API_URL.startsWith('https://')
) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const kvModule = require('@vercel/kv');
    kv = kvModule.kv as KVClient;
  } catch {
    console.warn('Vercel KV is not configured. View counts will be disabled.');
  }
}

type Params = {
  params: Promise<{ id: string }>;
};

// 조회수 증가
export const POST = async (
  _req: NextRequest,
  context: Params
): Promise<NextResponse> => {
  // KV가 설정되지 않았을 때
  if (!kv) {
    console.warn('KV not configured, view count not incremented');
    return NextResponse.json({ 
      views: 0, 
      success: false,
      message: 'KV not configured'
    });
  }

  try {
    const { id } = await context.params;
    const key = `quiz:views:${id}`;

    // 조회수 증가
    await kv.incr(key);

    // 증가된 조회수 가져오기
    const views = (await kv.get<number>(key)) ?? 1;

    return NextResponse.json({ views, success: true });
  } catch (error) {
    console.error('View count increment error:', error);
    return NextResponse.json(
      { error: 'Failed to increment view count', success: false },
      { status: 500 }
    );
  }
};

