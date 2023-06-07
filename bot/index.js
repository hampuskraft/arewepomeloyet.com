import Prisma from '@prisma/client';
import {Client, Events, IntentsBitField, UserFlags} from 'discord.js';
import crypto from 'node:crypto';
import {TextEncoder} from 'node:util';

const {PrismaClient} = Prisma;

const client = new Client({
  intents: IntentsBitField.Flags.Guilds | IntentsBitField.Flags.GuildMembers | IntentsBitField.Flags.GuildPresences,
});

const prisma = new PrismaClient();

async function handleGuildCreate(guild) {
  await guild.members.fetch();
  const pomelos = [];
  for (const member of guild.members.cache.values()) {
    if (!isValidMember(member)) continue;
    const pomelo = await handleMember(member);
    pomelos.push(pomelo);
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

function isValidMember(member) {
  return (
    member.user.discriminator === '0' &&
    !member.user.flags.has(UserFlags.Staff) &&
    !member.user.flags.has(UserFlags.Partner)
  );
}

async function handleMember(member) {
  const date = new Date(member.user.createdTimestamp);
  return {
    hash: await hashId(member.id),
    date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
    nitro: false,
    // We have no idea what the user's premium type is, so we just assume they have Nitro if they're server boosting, which obviously is not always true.
    possiblyNitro: member.premiumSinceTimestamp !== null,
    earlySupporter: member.user.flags.has(UserFlags.PremiumEarlySupporter),
  };
}

client.on(Events.GuildCreate, handleGuildCreate);

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
