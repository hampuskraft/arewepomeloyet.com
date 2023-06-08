import {REST} from '@discordjs/rest';
import {WebSocketManager, WebSocketShardEvents} from '@discordjs/ws';
import {Pomelo, PrismaClient} from '@prisma/client';
import {APIGuildMember, APIUser, GatewayDispatchEvents, GatewayIntentBits, UserFlags} from 'discord-api-types/v10';
import crypto from 'node:crypto';
import http from 'node:http';
import {TextEncoder} from 'node:util';

const token = process.env['DISCORD_TOKEN'];
if (!token) {
  throw new Error('No token provided');
}

const guilds: Map<string, number> = new Map();
const prisma = new PrismaClient();
const rest = new REST().setToken(token);
const manager = new WebSocketManager({
  token,
  intents: GatewayIntentBits.Guilds | GatewayIntentBits.GuildMembers | GatewayIntentBits.GuildPresences,
  rest,
});

async function hashId(id: string) {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(id));
  const hashHex = Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}

const INELIGIBLE_FLAGS = UserFlags.Staff | UserFlags.Partner;

function isValidUser(user: APIUser): boolean {
  return user.discriminator === '0' && !(user.public_flags! & INELIGIBLE_FLAGS);
}

function getTimestampFromId(id: string): Date {
  return new Date(Number((BigInt(id) >> BigInt(22)) + BigInt(1420070400000)));
}

type PomeloCreate = Omit<Pomelo, 'oauth2' | 'timestamp'>;

async function handleMember(member: APIGuildMember): Promise<PomeloCreate> {
  const date = getTimestampFromId(member.user!.id);
  const possiblyNitro =
    member.avatar != null ||
    member.premium_since != null ||
    member.user!.accent_color != null ||
    member.user!.avatar?.startsWith('a_') ||
    (member.user as any).avatar_decoration != null ||
    member.user!.banner != null;

  return {
    hash: await hashId(member.user!.id),
    date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
    nitro: possiblyNitro,
    earlySupporter: Boolean(member.user!.public_flags! & UserFlags.PremiumEarlySupporter),
  };
}

async function handleUser(user: APIUser): Promise<PomeloCreate> {
  const date = getTimestampFromId(user.id);
  const possiblyNitro =
    user.accent_color != null ||
    user.avatar?.startsWith('a_') ||
    (user as any).avatar_decoration != null ||
    user.banner != null;

  return {
    hash: await hashId(user.id),
    date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
    nitro: possiblyNitro,
    earlySupporter: Boolean(user.public_flags! & UserFlags.PremiumEarlySupporter),
  };
}

async function upsertPomelo(pomelo: PomeloCreate) {
  try {
    await prisma.pomelo.upsert({
      where: {hash: pomelo.hash},
      create: pomelo,
      update: {},
    });
  } catch (error) {
    console.error(error);
  }
}

manager.on(WebSocketShardEvents.Dispatch, async (data) => {
  switch (data.data.t) {
    case GatewayDispatchEvents.Ready: {
      console.log(`Shard ${data.shardId} is ready.`);
      break;
    }

    case GatewayDispatchEvents.GuildCreate: {
      const pomelos: PomeloCreate[] = [];
      for (const member of data.data.d.members) {
        if (!isValidUser(member.user!)) continue;
        const pomelo = await handleMember(member);
        pomelos.push(pomelo);
      }
      if (pomelos.length > 0) {
        await prisma.pomelo.createMany({data: pomelos, skipDuplicates: true});
        console.log(`Added ${pomelos.length} pomelos to the database.`);
      }
      guilds.set(data.data.d.id, data.data.d.member_count!);
      break;
    }

    case GatewayDispatchEvents.GuildMemberAdd: {
      if (!isValidUser(data.data.d.user!)) return;
      const pomelo = await handleMember(data.data.d);
      await upsertPomelo(pomelo);
      console.log(`Added pomelo ${pomelo.hash} to the database.`);
      break;
    }

    case GatewayDispatchEvents.GuildMemberUpdate: {
      if (!isValidUser(data.data.d.user)) return;
      const pomelo = await handleMember(data.data.d as APIGuildMember);
      await upsertPomelo(pomelo);
      console.log(`Updated pomelo ${pomelo.hash} in the database.`);
      break;
    }

    case GatewayDispatchEvents.UserUpdate: {
      if (!isValidUser(data.data.d)) return;
      const pomelo = await handleUser(data.data.d);
      await upsertPomelo(pomelo);
      console.log(`Updated pomelo ${pomelo.hash} in the database.`);
      break;
    }

    case GatewayDispatchEvents.GuildMemberRemove: {
      const guild = guilds.get(data.data.d.guild_id);
      if (guild == null) return;
      guilds.set(data.data.d.guild_id, guild - 1);
      break;
    }

    case GatewayDispatchEvents.GuildDelete: {
      const guild = guilds.get(data.data.d.id);
      if (guild == null) return;
      guilds.delete(data.data.d.id);
      break;
    }
  }
});

await manager.connect();

http
  .createServer((_req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(
      JSON.stringify({
        guilds: guilds.size,
        members: [...guilds.values()].reduce((a, b) => a + b, 0),
        uptime: process.uptime(),
      }),
    );
  })
  .listen(8080);

console.log('Listening on port 8080');
