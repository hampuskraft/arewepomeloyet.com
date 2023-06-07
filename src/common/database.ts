import prisma from '@/common/prisma';
import {Pomelo} from '@prisma/client';
import {revalidatePath} from 'next/cache';

export type PomeloSerialized = Omit<Pomelo, 'date'> & {date: string};
export type PomelosResponse = {
  pomelos: PomeloSerialized[];
  timestamp: number;
};

export async function getPomelos(): Promise<PomelosResponse> {
  const pomelos = await prisma.pomelo.findMany({orderBy: {date: 'asc'}});
  const pomelosResponse: PomelosResponse = {
    pomelos: pomelos.map((pomelo) => ({
      ...pomelo,
      date: pomelo.date.toISOString(),
    })),
    timestamp: Date.now(),
  };
  return pomelosResponse;
}

export type PomeloStats = {
  year: string;
  month: string;
  totalCount: number;
  nitroCount: number;
  possiblyNitroCount: number;
  earlySupporterCount: number;
  nonNitroCount: number;
};

export type PomeloStatsResponse = {
  stats: PomeloStats[];
  lastPomeloAt: number;
  lastUpdatedAt: number;
};

export async function getPomeloStats({onlyOAuth2 = false} = {}): Promise<PomeloStatsResponse> {
  const pomelos = await prisma.pomelo.findMany({
    orderBy: {date: 'asc'},
    where: onlyOAuth2 ? {oauth2: true} : undefined,
  });

  const pomeloGroups = pomelos.reduce((groups, pomelo) => {
    const date = new Date(pomelo.date);
    const month = date.toLocaleString('default', {month: 'long'});
    const year = date.getFullYear();
    const groupKey = `${year}-${month}`;
    groups[groupKey] ??= [];
    groups[groupKey].push(pomelo);
    return groups;
  }, {} as Record<string, Pomelo[]>);

  const stats = Object.entries(pomeloGroups).map(([groupKey, pomelos]) => {
    const [year, month] = groupKey.split('-');
    const nitro = pomelos.filter((pomelo) => pomelo.nitro);
    const earlySupporter = pomelos.filter((pomelo) => pomelo.earlySupporter);
    const possiblyNitro = pomelos.filter((pomelo) => pomelo.possiblyNitro);
    return {
      year,
      month,
      totalCount: pomelos.length,
      nitroCount: nitro.length,
      possiblyNitroCount: possiblyNitro.length,
      earlySupporterCount: earlySupporter.length,
      nonNitroCount: pomelos.length - nitro.length - possiblyNitro.length,
    };
  });

  return {
    stats,
    lastPomeloAt: pomelos.at(-1)?.date.getTime() ?? 0,
    lastUpdatedAt: Date.now(),
  };
}

export async function getPomeloByHash(hash: string): Promise<Pomelo | null> {
  return prisma.pomelo.findUnique({where: {hash}});
}

export async function createPomelo({
  hash,
  date,
  nitro,
  earlySupporter,
}: {
  hash: string;
  date: Date;
  nitro: boolean;
  earlySupporter: boolean;
}): Promise<Pomelo> {
  const pomelo = await prisma.pomelo.upsert({
    where: {hash},
    create: {hash, date, nitro, earlySupporter, oauth2: true},
    update: {date, nitro, earlySupporter, oauth2: true},
  });
  revalidatePath('/');
  return pomelo;
}
