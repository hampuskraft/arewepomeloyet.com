import {getPomeloStats} from '@/common/database';
import {NextRequest, NextResponse} from 'next/server';

export const revalidate = 60;

function wantBoolean(value: string | null) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return;
}

export async function GET(request: NextRequest) {
  const {searchParams} = new URL(request.url);
  const pomeloStats = await getPomeloStats({oauth2: wantBoolean(searchParams.get('oauth2'))});
  return NextResponse.json(pomeloStats);
}
