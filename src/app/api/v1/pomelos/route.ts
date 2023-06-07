import {getPomeloStats} from '@/common/database';
import {NextRequest, NextResponse} from 'next/server';

export const revalidate = 60;

export async function GET(request: NextRequest) {
  const {searchParams} = new URL(request.url);
  const pomeloStats = await getPomeloStats({onlyOAuth2: searchParams.get('onlyOAuth2') === 'true'});
  return NextResponse.json(pomeloStats);
}
