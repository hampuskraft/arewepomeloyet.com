import {getPomelos} from '@/common/database';
import {NextResponse} from 'next/server';

export const revalidate = 60;

export async function GET() {
  const {pomelos, timestamp} = await getPomelos();
  return NextResponse.json({
    pomelos: pomelos.map(({hash, ...pomelo}) => ({hash: '', ...pomelo})),
    timestamp,
  });
}
