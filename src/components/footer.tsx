'use client';

import Link from '@/components/link';
import ThemeSwitch from '@/components/theme-switch';

export default function Footer({lastUpdatedAt, lastPomeloAt}: {lastUpdatedAt: number; lastPomeloAt: number}) {
  return (
    <div className="flex flex-col gap-2 text-md font-display font-light text-gray-700 dark:text-gray-400">
      <p>
        Last updated on <strong>{new Date(lastUpdatedAt).toLocaleString()}</strong>.
      </p>

      <p>
        Last pomelo registered on <strong>{new Date(lastPomeloAt).toLocaleString()}</strong>.
      </p>

      <p>
        Protip: There&apos;s a <Link href="/api/v1/pomelos">GET /api/v1/pomelos</Link> endpoint that returns the
        aggregated stats.
      </p>

      <ThemeSwitch />
    </div>
  );
}
