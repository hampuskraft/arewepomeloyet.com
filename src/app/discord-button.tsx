'use client';

import {DISCORD_AUTHORIZE_URL} from './config';

export default function DiscordButton() {
  return (
    <div className="my-4 flex flex-col gap-4">
      <button
        className="max-w-max rounded-xl bg-blue-500 px-4 py-2 font-display font-bold text-white transition-colors duration-200 ease-in-out hover:bg-blue-600"
        onClick={() => {
          const state = Math.random().toString(36).substring(2);
          window.sessionStorage.setItem('state', state);
          window.open(`${DISCORD_AUTHORIZE_URL}&state=${state}`, '_self');
        }}
      >
        I got Pomelo&apos;d!
      </button>

      <div className="flex flex-col gap-2 font-body text-sm font-light text-gray-700 dark:text-gray-400">
        <p>Your user ID is anonymized with a hash function (SHA-256), so we can&apos;t see who you are.</p>
        <p>
          We only store your user ID hash, registration date (month and year), and Nitro status (Early Supporter
          included).
        </p>
      </div>
    </div>
  );
}
