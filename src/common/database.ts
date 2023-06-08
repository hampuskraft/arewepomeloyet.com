import {BOT_HTTP_ENDPOINT} from '@/common/config';
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
};

export async function getPomeloStats({oauth2}: {oauth2?: boolean} = {}): Promise<PomeloStatsResponse> {
  const pomelos = await prisma.pomelo.findMany({orderBy: {date: 'asc'}, where: {oauth2}});
  const pomeloGroups = pomelos.reduce((groups, pomelo) => {
    const date = pomelo.date.toISOString().slice(0, 7);
    groups[date] ??= [];
    groups[date].push(pomelo);
    return groups;
  }, {} as Record<string, Pomelo[]>);

  const stats = Object.entries(pomeloGroups).map(([date, pomelos]) => {
    const nitro = pomelos.filter((pomelo) => pomelo.nitro);
    const earlySupporter = pomelos.filter((pomelo) => pomelo.earlySupporter);
    const nonNitroCount = pomelos.length - nitro.length;
    return {
      date,
      totalCount: pomelos.length,
      nitroCount: nitro.length,
      earlySupporterCount: earlySupporter.length,
      nonNitroCount,
    };
  });

  return {
    stats,
    total: pomelos.length,
    lastPomeloAt: pomelos.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0].timestamp.getTime(),
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
  revalidatePath('/api/pomelos');
  revalidatePath('/api/v1/pomelos');
  revalidatePath('/oauth2');
  return pomelo;
}

export type BotStatsResponse = {
  guilds: number;
  members: number;
  uptime: number;
};

export async function getBotStats(): Promise<BotStatsResponse> {
  try {
    const res = await fetch(BOT_HTTP_ENDPOINT, {next: {revalidate: 60}});
    if (!res.ok) {
      return {guilds: 0, members: 0, uptime: 0};
    }

    return res.json();
  } catch (error) {
    console.error(error);
    return {guilds: 0, members: 0, uptime: 0};
  }
}
