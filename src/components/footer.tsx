'use client';

import Link from '@/components/link';
import ThemeSwitch from '@/components/theme-switch';

export default function Footer({lastUpdatedAt, lastPomeloAt}: {lastUpdatedAt: number; lastPomeloAt: number}) {
  return (
    <div className="flex flex-col gap-4 text-md font-display font-light text-gray-700 dark:text-gray-400">
      <div className="flex flex-col gap-2">
        <p>
          Last updated on <strong>{new Date(lastUpdatedAt).toLocaleString()}</strong>.
        </p>

        <p>
          Last pomelo registered on <strong>{new Date(lastPomeloAt).toLocaleString()}</strong>.
        </p>
      </div>

      <p>
        Protip: There&apos;s a <Link href="/api/v1/pomelos">GET /api/v1/pomelos</Link> endpoint for aggregated stats.
      </p>

      <ThemeSwitch />
    </div>
  );
}
