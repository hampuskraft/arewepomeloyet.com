"use client";

import { PomeloSerialized } from "./database";
import ThemeSwitch from "./theme-switch";

export default function Footer({
  pomelos,
  timestamp,
}: {
  pomelos: PomeloSerialized[];
  timestamp: number;
}) {
  const [latestPomelo] = pomelos.sort((a, b) => {
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  return (
    <div className="flex flex-col gap-2 text-md font-display font-light text-gray-700 dark:text-gray-400">
      <p>
        Last updated on <strong>{new Date(timestamp).toLocaleString()}</strong>.
      </p>

      {latestPomelo && (
        <p>
          Last pomelo registered on{" "}
          <strong>{new Date(latestPomelo.timestamp).toLocaleString()}</strong>.
        </p>
      )}

      <p>
        Protip: There&apos;s a GET /api/pomelos endpoint that returns the raw
        JSON data.
      </p>

      <ThemeSwitch />
    </div>
  );
}
