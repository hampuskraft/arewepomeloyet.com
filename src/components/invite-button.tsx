export default function InviteButton() {
  return (
    <div className="my-4 flex flex-col gap-4">
      <div className="flex flex-row gap-2 items-center">
        <div className="bg-gray-500 rounded-full w-4 h-4" />
        <p className="font-display tracking-tight font-medium text-xl text-gray-700 dark:text-gray-300">
          Was in <strong>~150 servers</strong> with <strong>over 1,500,000 members</strong> during June 27, 2023.
        </p>
      </div>

      <div className="max-w-max rounded-xl bg-gray-500 px-4 py-2 font-display font-bold text-white cursor-not-allowed">
        Invite Discord Bot
      </div>

      <div className="flex flex-col gap-2 font-body text-base font-light text-gray-700 dark:text-gray-400">
        <p>
          By inviting the bot, users agreed to the anonymous collection of the same data as the &quot;I got
          Pomelo&apos;d!&quot; button above.
        </p>
        <p>An educated guess was made if someone had Nitro since the Discord API didn&apos;t provide this to bots.</p>
      </div>
    </div>
  );
}
