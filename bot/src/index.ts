import {REST} from '@discordjs/rest';
import {WebSocketManager, WebSocketShardEvents} from '@discordjs/ws';
import {Pomelo, PrismaClient} from '@prisma/client';
import {Mutex} from 'async-mutex';
import {
  APIGuildMember,
  APIUser,
  GatewayDispatchEvents,
  GatewayDispatchPayload,
  GatewayIntentBits,
  GatewayOpcodes,
  UserFlags,
} from 'discord-api-types/v10';
import crypto from 'node:crypto';
import http from 'node:http';
import util, {TextEncoder} from 'node:util';
import PQueue from 'p-queue';

const INELIGIBLE_FLAGS = UserFlags.Staff | UserFlags.Partner;

type PomeloCreate = Omit<Pomelo, 'oauth2' | 'timestamp'>;

export class DiscordBot {
  private token: string;
  private randomBytes = util.promisify(crypto.randomBytes);
  private guilds: Map<string, number> = new Map();
  private processedGuilds: Set<string> = new Set();
  private nonces: Map<string, string> = new Map();
  private prisma: PrismaClient = new PrismaClient();
  private rest: REST;
  private manager: WebSocketManager;
  private pomeloUpsertQueue: PQueue = new PQueue({concurrency: 100});
  private guildCreateQueue: PQueue = new PQueue({concurrency: 1});
  private createManyQueue: PQueue = new PQueue({concurrency: 1});
  private chunkMutex: Mutex = new Mutex();

  constructor(token: string) {
    this.token = token;
    this.rest = new REST().setToken(token);
    this.manager = new WebSocketManager({
      token: this.token,
      intents: GatewayIntentBits.Guilds | GatewayIntentBits.GuildMembers,
      rest: this.rest,
    });
    this.setupManagerEvents();
  }

  private async hashId(id: string) {
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(id));
    const hashHex = Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
  }

  private isValidUser(user: APIUser): boolean {
    return user.discriminator === '0' && !(user.public_flags! & INELIGIBLE_FLAGS);
  }

  private getTimestampFromId(id: string): Date {
    return new Date(Number((BigInt(id) >> BigInt(22)) + BigInt(1420070400000)));
  }

  private async handleMember(member: APIGuildMember): Promise<PomeloCreate> {
    const date = this.getTimestampFromId(member.user!.id);
    const possiblyNitro =
      member.avatar != null ||
      member.premium_since != null ||
      member.user!.accent_color != null ||
      member.user!.avatar?.startsWith('a_') ||
      (member.user as any).avatar_decoration != null ||
      member.user!.banner != null;

    return {
      hash: await this.hashId(member.user!.id),
      date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      nitro: possiblyNitro,
      earlySupporter: Boolean(member.user!.public_flags! & UserFlags.PremiumEarlySupporter),
    };
  }

  private async handleUser(user: APIUser): Promise<PomeloCreate> {
    const date = this.getTimestampFromId(user.id);
    const possiblyNitro =
      user.accent_color != null ||
      user.avatar?.startsWith('a_') ||
      (user as any).avatar_decoration != null ||
      user.banner != null;

    return {
      hash: await this.hashId(user.id),
      date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      nitro: possiblyNitro,
      earlySupporter: Boolean(user.public_flags! & UserFlags.PremiumEarlySupporter),
    };
  }

  private async upsertPomelo(pomelo: PomeloCreate) {
    await this.pomeloUpsertQueue.add(async () => {
      try {
        await this.prisma.pomelo.upsert({where: {hash: pomelo.hash}, create: pomelo, update: {}});
      } catch (error) {
        console.error(error);
      }
    });
  }

  private async handleDispatchData(data: GatewayDispatchPayload, shardId: number) {
    switch (data.t) {
      case GatewayDispatchEvents.Ready: {
        console.log(`Shard ${shardId} is ready.`);
        break;
      }

      case GatewayDispatchEvents.GuildCreate: {
        console.log(`Guild ${data.d.id} has ${data.d.member_count} members.`);
        this.guilds.set(data.d.id, data.d.member_count!);

        if (!this.processedGuilds.has(data.d.id)) {
          await this.guildCreateQueue.add(async () => {
            const nonce = await this.randomBytes(16).then((b) => b.toString('hex'));
            this.nonces.set(nonce, data.d.id);

            await this.manager.send(shardId, {
              op: GatewayOpcodes.RequestGuildMembers,
              d: {guild_id: data.d.id, query: '', limit: 0, nonce},
            });

            await new Promise((resolve) => {
              const interval = setInterval(() => {
                if (this.processedGuilds.has(data.d.id)) {
                  clearInterval(interval);
                  resolve(undefined);
                }
              }, 100);
            });
          });
        }
        break;
      }

      case GatewayDispatchEvents.GuildMembersChunk: {
        const {chunk_index, chunk_count, guild_id, nonce, members} = data.d;
        console.log(`Handling chunk index ${chunk_index} of ${chunk_count} for guild ${guild_id}`);

        const guildId = this.nonces.get(nonce ?? '');
        if (guildId == null) {
          console.warn(`No guild ID found for nonce ${nonce}`);
          return;
        }

        let count = 0;
        while (members.length > 0) {
          const chunkedMembers = members.splice(0, 1000);
          const memberPromises = chunkedMembers
            .filter((member) => this.isValidUser(member.user!))
            .map((member) => this.handleMember(member));

          const pomelos: PomeloCreate[] = await Promise.all(memberPromises);
          if (pomelos.length > 0) {
            await this.createManyQueue.add(async () => {
              await this.prisma.pomelo.createMany({data: pomelos, skipDuplicates: true});
            });
            count += pomelos.length;
          }
        }

        console.log(`Added ${count} pomelos to the database (guild ${guildId}).`);
        if (chunk_index + 1 === chunk_count) {
          this.processedGuilds.add(guildId);
          console.log(`Finished handling guild ${guildId}.`);
        }
        break;
      }

      case GatewayDispatchEvents.GuildMemberAdd: {
        if (!this.isValidUser(data.d.user!)) return;
        const pomelo = await this.handleMember(data.d);
        await this.upsertPomelo(pomelo);
        console.log(`Added pomelo ${pomelo.hash} to the database.`);
        const guild = this.guilds.get(data.d.guild_id);
        if (guild == null) return;
        this.guilds.set(data.d.guild_id, guild + 1);
        break;
      }

      case GatewayDispatchEvents.GuildMemberUpdate: {
        if (!this.isValidUser(data.d.user)) return;
        const pomelo = await this.handleMember(data.d as APIGuildMember);
        await this.upsertPomelo(pomelo);
        console.log(`Updated pomelo ${pomelo.hash} in the database.`);
        break;
      }

      case GatewayDispatchEvents.UserUpdate: {
        if (!this.isValidUser(data.d)) return;
        const pomelo = await this.handleUser(data.d);
        await this.upsertPomelo(pomelo);
        console.log(`Updated pomelo ${pomelo.hash} in the database.`);
        break;
      }

      case GatewayDispatchEvents.GuildMemberRemove: {
        const guild = this.guilds.get(data.d.guild_id);
        if (guild == null) return;
        this.guilds.set(data.d.guild_id, guild - 1);
        break;
      }

      case GatewayDispatchEvents.GuildDelete: {
        const guild = this.guilds.get(data.d.id);
        if (guild == null) return;
        this.guilds.delete(data.d.id);
        break;
      }
    }
  }

  private setupManagerEvents() {
    this.manager.on(WebSocketShardEvents.Dispatch, async ({data, shardId}) => {
      if (data.t === GatewayDispatchEvents.GuildMembersChunk) {
        console.log(`Received chunk for guild ${data.d.guild_id}`);
        await this.chunkMutex.runExclusive(async () => {
          await this.handleDispatchData(data, shardId);
        });
      } else {
        await this.handleDispatchData(data, shardId);
      }
    });
  }

  async connect() {
    await this.manager.connect();
    http
      .createServer((_req, res) => {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(
          JSON.stringify({
            guilds: this.guilds.size,
            members: [...this.guilds.values()].reduce((a, b) => a + b, 0),
            uptime: process.uptime(),
          }),
        );
      })
      .listen(8080);

    console.log('Listening on port 8080');
  }
}

const token = process.env['DISCORD_TOKEN'];
if (!token) {
  throw new Error('No token provided');
}

const bot = new DiscordBot(token);
bot.connect();
