import Image from 'next/image';
import {PomeloSerialized, getPomelos} from './database';
import DiscordButton from './discord-button';
import Footer from './footer';

const numberFormatter = new Intl.NumberFormat('en-US');

export const revalidate = 60;

export default async function Home() {
  const {pomelos, timestamp} = await getPomelos();

  const pomeloGroups = pomelos.reduce((groups, pomelo) => {
    const date = new Date(pomelo.date);
    const month = date.toLocaleString('default', {month: 'long'});
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
        <p className="font-display text-6xl font-bold text-black dark:text-white lg:text-8xl">Yes, but actually no.</p>
      </div>

      <div className="flex flex-col gap-4 lg:gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-2xl font-semibold lg:text-4xl">Timeline</h2>

          <p className="font-body text-sm font-light text-gray-700 dark:text-gray-400">
            The featured Nitro percentages are deliberately best effort (premium_since is not accounted for) and include
            users with the Early Supporter badge.
          </p>
        </div>

        {pomelos.length === 0 ? (
          <p className="font-body text-xl lg:text-2xl">No Pomelos registered yet. Be the first!</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(pomeloGroups).map(([groupKey, pomelos]) => {
              const [year, month] = groupKey.split('-');
              const nitroPercentage = Math.round(
                (pomelos.filter((pomelo) => pomelo.nitro).length / pomelos.length) * 100,
              );
              return (
                <div key={groupKey} className="p-4 rounded-xl bg-blue-500 text-white flex flex-col gap-2">
                  <time className="font-body text-xl font-light">
                    {month} {year}
                  </time>
                  <h3 className="font-display text-2xl font-semibold lg:text-4xl">
                    {numberFormatter.format(pomelos.length)}
                  </h3>
                  <p className="font-body text-sm font-light">
                    {pomelos.length === 1 ? 'Pomelo' : 'Pomelos'} registered ({nitroPercentage}% with Nitro)
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 lg:gap-6">
        <h2 className="font-display text-2xl font-semibold lg:text-4xl">What is Pomelo, anyway?</h2>

        <div className="flex flex-col gap-4 font-body text-xl lg:text-2xl">
          <p>
            Discord is forcing all its{' '}
            <Link href="https://www.statista.com/statistics/1367922/discord-registered-users-worldwide/">
              560M+ registered users
            </Link>{' '}
            to migrate from Username#1234 to unique @usernames.
          </p>

          <p>
            Despite{' '}
            <Link href="https://support.discord.com/hc/en-us/community/posts/14337329256983">community backlash</Link>,
            this change, internally known as <strong>Pomelo</strong>, is still being implemented.
          </p>

          <p>
            Please refer to Discord&apos;s <Link href="https://discord.com/blog/usernames">official blog post</Link> for
            more information.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:gap-6">
        <h2 className="font-display text-2xl font-semibold lg:text-4xl">How does this site work?</h2>

        <div className="flex flex-col gap-4 font-body text-xl lg:text-2xl">
          <p>
            There has been much indirection and rapidly changing information from the Discord team, so we&apos;ve
            decided to create this site to track the progress of the Pomelo rollout.
          </p>

          <p>
            We rely on Pomelo&apos;d users authenticating below. <strong>You are anonymous</strong>—
            <Link href="https://github.com/hampuskraft/arewepomeloyet.com">feel free to audit the code</Link>.
          </p>

          <DiscordButton />

          <p>We&apos;re not affiliated with Discord or any of its employees.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:gap-6">
        <h2 className="font-display text-2xl font-semibold lg:text-4xl">Frequently Asked Questions</h2>

        <div className="flex flex-col gap-8 lg:gap-10">
          <div className="flex flex-col gap-4 font-body text-xl lg:text-2xl">
            <p>
              <strong>Q: Who got early access?</strong>
            </p>

            <p>
              A: Staff members (and their personal accounts),{' '}
              <Link href="https://discord.com/partners">Partnered Server Owners</Link>,{' '}
              <Link href="https://discord.com/verification">Verified Server Owners</Link>, and owners of servers with{' '}
              <Link href="https://creator-support.discord.com/hc/en-us/articles/10423011974551">
                Server Subscriptions (US only)
              </Link>
              . Moderator Programs Alumni, HypeSquad Events, and Discord Admins{' '}
              <strong>did NOT get early access</strong>—that was simply false information.
            </p>
          </div>

          <div className="flex flex-col gap-4 font-body text-xl lg:text-2xl">
            <p>
              <strong>Q: When did the general rollout start?</strong>
            </p>

            <p>
              A: Discord announced in their{' '}
              <Link href="https://discord.com/channels/169256939211980800/889949624218042420/1115339637959970998">
                Discord Town Hall
              </Link>{' '}
              server on June 5, 2023 (GMT) that &quot;Starting today, users will become eligible to update their
              usernames over the coming weeks on a rolling basis.&quot;
            </p>
          </div>

          <div className="flex flex-col gap-4 font-body text-xl lg:text-2xl">
            <p>
              <strong>Q: Do Nitro users get priority in the rollout?</strong>
            </p>

            <p>
              A: According to Discord&apos;s <Link href="https://discord.com/blog/usernames">official blog post</Link>:
              &quot;<strong>Current</strong> Nitro subscribers [...] that registered for Nitro{' '}
              <strong>on or before March 1, 2023</strong> will also be given early access.&quot; Early Supporters also
              appear to get early access.
            </p>
          </div>

          <div className="flex flex-col gap-4 font-body text-xl lg:text-2xl">
            <p>
              <strong>Q: I&apos;m a Nitro user before March 1, 2023. Why is my username not available?</strong>
            </p>
            <p>
              A: Discord has reserved usernames for the first registered active user on the platform with that name,
              regardless of their Nitro status or discriminator. This ensures that getting early access to Pomelo most
              of the time only means that you get to pick a bad name before everyone else picks even worse names.
            </p>
          </div>

          <div className="flex flex-col gap-4 font-body text-xl lg:text-2xl">
            <p>
              <strong>Q: What are discriminators? Why are they changing?</strong>
            </p>

            <p>
              A: Discriminators are the four digits following a username, such as &quot;The Real Jason#0001.&quot; The
              term &quot;discriminator&quot; was not used in the app but was rather known as a &quot;tag.&quot; Discord
              claims in their <Link href="https://discord.com/blog/usernames">blog post</Link> that &quot;nobody knows
              what a discriminator is&quot; and referenced a Reddit post as a source.
            </p>

            <p>
              Discord mentions problems with the old system (that could&apos;ve been fixed without Pomelo), such as:
            </p>

            <ul className="list-disc list-inside space-y-2">
              <li className="ml-4 font-semibold">Usernames are case-sensitive.</li>
              <li className="ml-4 font-semibold">Usernames sometimes contain special characters.</li>
              <li className="ml-4">
                <span className="font-semibold">&quot;Only&quot; 10,000 users are allowed per name.</span> (Now
                it&apos;s only 1 per name instead.)
              </li>
            </ul>

            <p>
              Friend invites would make sense, right? Discord doesn&apos;t think so. They had those for about a month,
              only on iOS, without marketing, claiming nobody used them. Instead, they decided to become &quot;one of
              the boys&quot; in the social media landscape and adopt unique @usernames and all the problems that come
              with them.
            </p>

            <p>
              Either way, this is definitely happening, and criticism{' '}
              <Link href="https://redd.it/13mceaw">is often silenced</Link>.
            </p>
          </div>

          <div className="flex flex-col gap-4 font-body text-xl lg:text-2xl">
            <p>
              <strong>Q: What happened to the @ symbol in front of usernames?</strong>
            </p>

            <p>
              A: Discord initially had @ symbols in front of usernames. However, after{' '}
              <Link href="https://www.youtube.com/watch?v=ynmnvT_h8BE">Linus Tech Tips</Link> made a video criticizing
              the @ symbol, Discord promptly removed it. Meanwhile, a community feedback post{' '}
              <Link href="https://support.discord.com/hc/en-us/community/posts/14337329256983">
                with 50,000 upvotes criticizing the change as a whole
              </Link>{' '}
              was ignored.
            </p>
          </div>

          <div className="flex flex-col gap-4 font-body text-xl lg:text-2xl">
            <p>
              <strong>Q: What should I do if my username is taken?</strong>
            </p>

            <p>
              A: As helpfully suggested by a{' '}
              <Link href="https://www.reddit.com/r/discordapp/comments/136urpb/comment/jiqdm9d/?context=1000">
                staff member at Discord
              </Link>
              , you &quot;could always add 4 numbers at the end of your username.&quot; Of course, we had a system for
              this already: discriminators.
            </p>
          </div>

          <Image
            src="/jessie.png"
            width={512}
            height={512}
            alt="We've chosen the name Jessie. Sorry, that name is taken. Jessie95836 is available."
          />
        </div>
      </div>

      <Footer timestamp={timestamp} pomelos={pomelos} />
    </main>
  );
}

function Link({href, children}: {href: string; children: React.ReactNode}) {
  return (
    <a className="text-blue-500 hover:underline" href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
