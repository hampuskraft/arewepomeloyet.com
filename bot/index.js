import Prisma from '@prisma/client';
import {Client, Events, IntentsBitField, UserFlags} from 'discord.js';
import crypto from 'node:crypto';
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
  // repair existing pomelos
  const existingPomelos = await prisma.pomelo.findMany({where: {hash: {in: pomelos.map((p) => p.hash)}}});
  for (const pomelo of existingPomelos) {
    if (!pomelo.oauth2 && !pomelo.nitro) {
      const incomingPomelo = pomelos.find((p) => p.hash === pomelo.hash);
      if (incomingPomelo?.nitro) {
        console.log(`Updating Nitro for ${pomelo.hash} in the database.`);
        await prisma.pomelo.update({where: {hash: pomelo.hash}, data: {nitro: true}});
      }
    }
  }
  if (pomelos.length > 0) {
    console.log(`Adding ${pomelos.length} pomelos to the database.`);
    await prisma.pomelo.createMany({data: pomelos, skipDuplicates: true});
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
client.on(Events.UserUpdate, async (_, user) => {
  const date = new Date(user.createdTimestamp);
  const possiblyNitro =
    user.accentColor != null || user.avatar?.startsWith('a_') || user.avatarDecoration != null || user.banner != null;
  return {
    hash: await hashId(user.id),
    date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
    nitro: possiblyNitro,
    earlySupporter: user.flags.has(UserFlags.PremiumEarlySupporter),
  };
});

client.on(Events.GuildMemberAdd, async (member) => {
  if (!isValidMember(member)) return;
  const pomelo = await handleMember(member);
  console.log(`Added ${pomelo.hash} to the database.`);
  await prisma.pomelo.create({data: pomelo});
});

client.on(Events.GuildMemberUpdate, async (_oldMember, newMember) => {
  if (!isValidMember(newMember)) return;
  const pomelo = await handleMember(newMember);
  console.log(`Updated ${pomelo.hash} in the database.`);
  await prisma.pomelo.upsert({
    where: {hash: pomelo.hash},
    create: pomelo,
    update: {},
  });
});

client.login();
