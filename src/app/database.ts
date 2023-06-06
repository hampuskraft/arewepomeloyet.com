import { Pomelo } from "@prisma/client";
import Redis from "ioredis";
import { REDIS_URL } from "./config";
import prisma from "./prisma";

const redis = new Redis(REDIS_URL, { family: 6, lazyConnect: true });

export type PomeloSerialized = Omit<Pomelo, "date"> & { date: string };
export type PomelosResponse = {
  pomelos: PomeloSerialized[];
  timestamp: number;
};

export async function getPomelos(): Promise<PomelosResponse> {
  if (process.env.BUILD === "1") {
    return {
      pomelos: [],
      timestamp: Date.now(),
    };
  }

  const cachedPomelos = await redis.get("pomelos");
  if (cachedPomelos) {
    return JSON.parse(cachedPomelos);
  }

  const pomelos = await prisma.pomelo.findMany({ orderBy: { date: "asc" } });
  const pomelosResponse: PomelosResponse = {
    pomelos: pomelos.map((pomelo) => ({
      ...pomelo,
      date: pomelo.date.toISOString(),
    })),
    timestamp: Date.now(),
  };
  await redis.set("pomelos", JSON.stringify(pomelosResponse), "EX", 5 * 60);
  return pomelosResponse;
}

export async function getPomeloByHash(hash: string): Promise<Pomelo | null> {
  return prisma.pomelo.findUnique({ where: { hash } });
}

export async function createPomelo({
  hash,
  date,
  nitro,
}: {
  hash: string;
  date: Date;
  nitro: boolean;
}): Promise<Pomelo> {
  const pomelo = await prisma.pomelo.create({ data: { hash, date, nitro } });
  await redis.del("pomelos");
  return pomelo;
}
