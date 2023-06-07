import {DISCORD_API_HOST, DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI} from '@/common/config';
import {CallbackCode} from '@/common/constants';
import {createPomelo} from '@/common/database';
import {APIUser, UserFlags, UserPremiumType} from 'discord-api-types/v10';
import {NextRequest, NextResponse} from 'next/server';
import crypto from 'node:crypto';
import {TextEncoder} from 'node:util';

const INELIGIBLE_FLAGS = UserFlags.Staff | UserFlags.Partner;
const ELIGIBLE_PREMIUM_TYPES = new Set([UserPremiumType.Nitro, UserPremiumType.NitroClassic]);

export async function POST(request: NextRequest) {
  const body = await request.json();
  const code = body.code;
  if (typeof code !== 'string') {
    return NextResponse.json({status: CallbackCode.InvalidCode}, {status: 400});
  }

  const response = await fetch(`${DISCORD_API_HOST}/oauth2/token`, {
    method: 'POST',
    body: new URLSearchParams({
      code,
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: DISCORD_REDIRECT_URI,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (!response.ok) {
    return NextResponse.json({status: CallbackCode.UnknownError}, {status: 400});
  }

  const {access_token} = await response.json();
  const userResponse = await fetch(`${DISCORD_API_HOST}/users/@me`, {
    headers: {
      authorization: `Bearer ${access_token}`,
    },
  });

  if (!userResponse.ok) {
    return NextResponse.json({status: CallbackCode.UnknownError}, {status: 400});
  }

  const user = (await userResponse.json()) as APIUser;
  if (user.discriminator !== '0') {
    return NextResponse.json({status: CallbackCode.NotEligible}, {status: 400});
  }

  if (user.public_flags! & INELIGIBLE_FLAGS) {
    return NextResponse.json({status: CallbackCode.NotEligibleFlags}, {status: 400});
  }

  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(user.id));
  const hashHex = Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const date = new Date(Number((BigInt(user.id) >> BigInt(22)) + BigInt(1420070400000)));

  await createPomelo({
    hash: hashHex,
    date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
    nitro: ELIGIBLE_PREMIUM_TYPES.has(user.premium_type!),
    earlySupporter: Boolean(user.public_flags! & UserFlags.PremiumEarlySupporter),
  });

  return NextResponse.json({status: CallbackCode.Success});
}
