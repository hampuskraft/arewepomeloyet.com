import {getBotStats, getPomeloStats} from '@/common/database';
import Landing from '@/components/landing';

export const revalidate = 60;

export default async function OAuth2() {
  const botStats = await getBotStats();
  const pomeloStats = await getPomeloStats({oauth2: true});
  return <Landing botStats={botStats} pomeloStats={pomeloStats} isOAuth2 />;
}
