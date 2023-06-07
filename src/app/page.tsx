import {getPomeloStats} from '@/common/database';
import Landing from '@/components/landing';

export const revalidate = 60;

export default async function Home() {
  const pomeloStats = await getPomeloStats();
  return <Landing pomeloStats={pomeloStats} />;
}
