import {getPomeloStats} from '@/common/database';
import Landing from '@/components/landing';

export const revalidate = 60;

export default async function OAuth2() {
  const pomeloStats = await getPomeloStats({oauth2: true});
  return <Landing pomeloStats={pomeloStats} isOAuth2 />;
}
