import pomelosAggregatedJsonOAuth2 from '@/assets/pomelos-aggregated-oauth2.json';
import pomelosAggregatedJson from '@/assets/pomelos-aggregated.json';

export type PomeloStats = {
  date: string;
  totalCount: number;
  nitroCount: number;
  earlySupporterCount: number;
  nonNitroCount: number;
};

export type PomeloStatsResponse = {
  stats: PomeloStats[];
  total: number;
  lastPomeloAt: number;
  lastUpdatedAt: number;
  pomelosOverTime: Record<string, number>;
};

export const POMELOS = pomelosAggregatedJson as PomeloStatsResponse;
export const POMELOS_OAUTH2 = pomelosAggregatedJsonOAuth2 as PomeloStatsResponse;
