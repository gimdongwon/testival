import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';

type Params = {
  params: Promise<{ id: string }>;
};

// 조회수 증가
export const POST = async (
  _req: NextRequest,
  context: Params
): Promise<NextResponse> => {
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

