import {DISCORD_BOT_AUTHORIZE_URL} from '@/common/config';
import {BotStatsResponse} from '@/common/database';

export default function InviteButton({botStats}: {botStats: BotStatsResponse}) {
  return (
    <div className="my-4 flex flex-col gap-4">
      <div className="flex flex-row gap-2 items-center">
        <div className="bg-green-500 rounded-full w-4 h-4" />
        <p className="font-display tracking-tight font-medium text-xl text-gray-700 dark:text-gray-300">
          Currently in <strong>{botStats.guilds.toLocaleString()} servers</strong> with{' '}
          <strong>{botStats.members.toLocaleString()} members</strong>
        </p>
      </div>

      <a
        className="max-w-max rounded-xl bg-blue-500 px-4 py-2 font-display font-bold text-white transition-colors duration-200 ease-in-out hover:bg-blue-600"
        href={DISCORD_BOT_AUTHORIZE_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        Invite Discord Bot
      </a>

      <div className="flex flex-col gap-2 font-body text-base font-light text-gray-700 dark:text-gray-400">
        <p>
          By inviting the bot, you agree to the anonymous collection of the same data as the &quot;I got
          Pomelo&apos;d!&quot; button above.
        </p>
        <p>
          We&apos;ll make an educated guess if someone has Nitro since the Discord API doesn&apos;t provide this to
          bots.
        </p>
        <p>
          Given Discord&apos;s 250 server limit for unverified bots, we&apos;ll auto-leave servers under 20 members.
        </p>
      </div>
    </div>
  );
}
