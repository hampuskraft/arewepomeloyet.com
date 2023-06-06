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
  return (
    <div className="flex flex-col gap-2 text-md font-display font-light text-gray-700 dark:text-gray-400">
      <p>
        Last updated at <strong>{new Date(timestamp).toLocaleString()}</strong>.
      </p>

      {pomelos.at(-1) && (
        <p>
          Last pomelo registered at{" "}
          <strong>
            {new Date(pomelos.at(-1)!.timestamp).toLocaleString()}
          </strong>
          .
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
