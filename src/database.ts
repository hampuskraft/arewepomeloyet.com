export type Pomelo = {
  date: string; // YYYY-MM-DD
  nitro: boolean;
  timestamp: number; // unix timestmamp in seconds
  early_supporter: boolean;
  oauth2: boolean;
};

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

export function getPomeloStats(data: Pomelo[], isOAuth2 = false): PomeloStatsResponse {
  data = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pomelos = isOAuth2 ? data.filter((pomelo) => pomelo.oauth2) : data;
  const pomeloGroups = pomelos.reduce((groups, pomelo) => {
    const date = new Date(pomelo.date).toISOString().slice(0, 7);
    groups[date] ??= [];
    groups[date].push(pomelo);
    return groups;
  }, {} as Record<string, Pomelo[]>);

  const stats = Object.entries(pomeloGroups).map(([date, pomelos]) => {
    const nitro = pomelos.filter((pomelo) => pomelo.nitro);
    const earlySupporter = pomelos.filter((pomelo) => pomelo.early_supporter);
    const nonNitroCount = pomelos.length - nitro.length;
    return {
      date,
      totalCount: pomelos.length,
      nitroCount: nitro.length,
      earlySupporterCount: earlySupporter.length,
      nonNitroCount,
    };
  });

  const pomelosByTimestamp = pomelos.sort((a, b) => a.timestamp - b.timestamp);
  const pomelosOverTime = pomelosByTimestamp.reduce((counts, pomelo) => {
    const date = new Date(pomelo.timestamp * 1000).toISOString().slice(0, 13) + ':00';
    counts[date] ??= 0;
    counts[date]++;
    return counts;
  }, {} as Record<string, number>);

  return {
    stats,
    total: pomelos.length,
    lastPomeloAt: pomelosByTimestamp.at(-1)?.timestamp || 0,
    lastUpdatedAt: pomelosByTimestamp.at(-1)?.timestamp || 0,
    pomelosOverTime,
  };
}
