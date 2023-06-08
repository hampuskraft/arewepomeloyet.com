import Prisma from '@prisma/client';
import {Client, Events, IntentsBitField, UserFlags} from 'discord.js';
import crypto from 'node:crypto';
import http from 'node:http';
import {TextEncoder} from 'node:util';

const {PrismaClient} = Prisma;

const client = new Client({
  intents: IntentsBitField.Flags.Guilds | IntentsBitField.Flags.GuildMembers | IntentsBitField.Flags.GuildPresences,
});

const prisma = new PrismaClient();

/**
 * @param {import('discord.js').Guild} guild
 */
async function handleGuildCreate(guild) {
  await guild.members.fetch();
  const pomelos = [];
  for (const member of guild.members.cache.values()) {
    if (!isValidMember(member)) continue;
    const pomelo = await handleMember(member);
    pomelos.push(pomelo);
  }
  if (pomelos.length > 0) {
    await prisma.pomelo.createMany({data: pomelos, skipDuplicates: true});
    console.log(`Added ${pomelos.length} pomelos to the database.`);
  }
}

client.on(Events.ClientReady, async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`Currently in ${client.guilds.cache.size} guilds.`);
  for (const guild of client.guilds.cache.values()) {
    await handleGuildCreate(guild);
  }
});

async function hashId(id) {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(id));
  const hashHex = Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}

/**
 * @param {import('discord.js').GuildMember} member
 */
function isValidMember(member) {
  return (
    member.user.discriminator === '0' &&
    !member.user.flags.has(UserFlags.Staff) &&
    !member.user.flags.has(UserFlags.Partner)
  );
}

/**
 * @param {import('discord.js').GuildMember} member
 */
async function handleMember(member) {
  const date = new Date(member.user.createdTimestamp);
  const possiblyNitro =
    member.avatar != null ||
    member.premiumSinceTimestamp != null ||
    member.user.accentColor != null ||
    member.user.avatar?.startsWith('a_') ||
    member.user.avatarDecoration != null ||
    member.user.banner != null;
  return {
    hash: await hashId(member.id),
    date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
    nitro: possiblyNitro,
    earlySupporter: member.user.flags.has(UserFlags.PremiumEarlySupporter),
  };
}

client.on(Events.GuildCreate, handleGuildCreate);

client.on(Events.GuildMemberAdd, async (member) => {
  if (!isValidMember(member)) return;
  const pomelo = await handleMember(member);
  await prisma.pomelo.create({data: pomelo});
  console.log(`Added ${pomelo.hash} to the database.`);
});

client.on(Events.GuildMemberUpdate, async (_oldMember, newMember) => {
  if (!isValidMember(newMember)) return;
  const pomelo = await handleMember(newMember);
  await prisma.pomelo.upsert({
    where: {hash: pomelo.hash},
    create: pomelo,
    update: {},
  });
  console.log(`Updated ${pomelo.hash} in the database.`);
});

client.on(Events.UserUpdate, async (_, user) => {
  const date = new Date(user.createdTimestamp);
  const possiblyNitro =
    user.accentColor != null || user.avatar?.startsWith('a_') || user.avatarDecoration != null || user.banner != null;
  const pomelo = {
    hash: await hashId(user.id),
    date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
    nitro: possiblyNitro,
    earlySupporter: user.flags.has(UserFlags.PremiumEarlySupporter),
  };
  await prisma.pomelo.upsert({
    where: {hash: pomelo.hash},
    create: pomelo,
    update: {},
  });
  console.log(`Updated ${pomelo.hash} in the database.`);
});

client.login();

http
  .createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(
      JSON.stringify({
        guilds: client.guilds.cache.size,
        members: client.users.cache.size,
        uptime: client.uptime,
      }),
    );
  })
  .listen(8080);

console.log('Listening on port 8080');
