import {getPomelos} from '@/common/database';
import {NextResponse} from 'next/server';

export const revalidate = 60;

export async function GET() {
  const pomelos = await getPomelos();
  return NextResponse.json(pomelos);
}
