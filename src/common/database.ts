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
  const pomelo = await prisma.pomelo.create({data: {hash, date, nitro, earlySupporter}});
  revalidatePath('/');
  return pomelo;
}
