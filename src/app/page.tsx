import { PomeloSerialized, getPomelos } from "./database";
import DiscordButton from "./discord-button";
import ThemeSwitch from "./theme-switch";

const numberFormatter = new Intl.NumberFormat("en-US");

export const revalidate = 60;

export default async function Home() {
  const { pomelos, timestamp } = await getPomelos();

  const pomeloGroups = pomelos.reduce((groups, pomelo) => {
    const date = new Date(pomelo.date);
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const groupKey = `${year}-${month}`;
    groups[groupKey] ??= [];
    groups[groupKey].push(pomelo);
    return groups;
  }, {} as Record<string, PomeloSerialized[]>);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-32 md:gap-16">
      <div className="flex flex-col gap-8">
        <h1 className="font-body text-4xl font-light text-gray-700 dark:text-gray-400 lg:text-6xl">
          Are we Pomelo yet?
        </h1>
        <p className="font-display text-6xl font-bold text-black dark:text-white lg:text-8xl">
          Yes, but actually no.
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-2xl font-semibold lg:text-4xl">
            Timeline
          </h2>

          <p className="font-body text-sm font-light text-gray-700 dark:text-gray-400">
            The featured Nitro percentages are deliberately best effort
            (premium_since is not accounted for) and include users with the
            Early Supporter badge.
          </p>
        </div>

        {pomelos.length === 0 ? (
          <p className="font-body text-xl lg:text-2xl">
            No Pomelos registered yet. Be the first!
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(pomeloGroups).map(([groupKey, pomelos]) => {
              const [year, month] = groupKey.split("-");
              const nitroPercentage = Math.round(
                (pomelos.filter((pomelo) => pomelo.nitro).length /
                  pomelos.length) *
                  100
              );
              return (
                <div
                  key={groupKey}
                  className="p-4 rounded-xl bg-blue-500 text-white flex flex-col gap-2"
                >
                  <time className="font-body text-xl font-light">
                    {month} {year}
                  </time>
                  <h3 className="font-display text-2xl font-semibold lg:text-4xl">
                    {numberFormatter.format(pomelos.length)}
                  </h3>
                  <p className="font-body text-sm font-light">
                    {pomelos.length === 1 ? "Pomelo" : "Pomelos"} registered (
                    {nitroPercentage}% with Nitro)
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 lg:gap-6">
        <h2 className="font-display text-2xl font-semibold lg:text-4xl">
          What is Pomelo, anyway?
        </h2>

        <div className="flex flex-col gap-4 font-body text-xl lg:text-2xl">
          <p>
            Discord is forcing all its{" "}
            <Link href="https://www.statista.com/statistics/1367922/discord-registered-users-worldwide/">
              560M+ registered users
            </Link>{" "}
            to migrate from Username#1234 to unique @usernames.
          </p>

          <p>
            Despite{" "}
            <Link href="https://support.discord.com/hc/en-us/community/posts/14337329256983">
              community backlash
            </Link>
            , this change, internally known as <strong>Pomelo</strong>, is still
            being implemented.
          </p>

          <p>
            Please refer to Discord&apos;s{" "}
            <Link href="https://discord.com/blog/usernames">
              official blog post
            </Link>{" "}
            for more information.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:gap-6">
        <h2 className="font-display text-2xl font-semibold lg:text-4xl">
          How does this site work?
        </h2>

        <div className="flex flex-col gap-4 font-body text-xl lg:text-2xl">
          <p>
            There has been much indirection and rapidly changing information
            from the Discord team, so we&apos;ve decided to create this site to
            track the progress of the Pomelo rollout.
          </p>

          <p>
            We rely on Pomelo&apos;d users authenticating below.{" "}
            <strong>You are anonymous</strong>—
            <Link href="https://github.com/hampuskraft/arewepomeloyet.com">
              feel free to audit the code
            </Link>
            .
          </p>

          <DiscordButton />

          <p>We&apos;re not affiliated with Discord or any of its employees.</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 text-md font-display font-light text-gray-700 dark:text-gray-400">
        <p>
          Last updated at{" "}
          <strong>{new Date(timestamp).toLocaleString()}</strong>.
        </p>

        {pomelos[0] && (
          <p>
            Last pomelo registered at{" "}
            <strong>{new Date(pomelos[0].timestamp).toLocaleString()}</strong>.
          </p>
        )}

        <ThemeSwitch />
      </div>
    </main>
  );
}

function Link({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      className="text-blue-500 hover:underline"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
