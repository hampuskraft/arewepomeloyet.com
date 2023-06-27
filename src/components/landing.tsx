import ContributingCTA from '@/components/contributing-cta';
import GitHubIcon from '@/components/github-icon';
import InviteButton from '@/components/invite-button';
import Link from '@/components/link';
import PomeloButton from '@/components/pomelo-button';
import PomeloChart from '@/components/pomelo-chart';
import PomeloTimeline from '@/components/pomelo-timeline';
import ThemeSwitch from '@/components/theme-switch';
import Timestamp from '@/components/timestamp';
import {GITHUB_REPO_URL} from '@/config';
import {getPomeloStats} from '@/database';
import Image from 'next/image';
import NextLink from 'next/link';

export default function Landing({isOAuth2 = false}: {isOAuth2?: boolean}) {
  const pomeloStats = getPomeloStats({oauth2: isOAuth2});
  const {lastUpdatedAt, lastPomeloAt} = pomeloStats;

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-32 md:gap-16">
      <div className="flex flex-col gap-8">
        <div className="flex flex-row items-center gap-4 text-gray-700 dark:text-gray-400">
          <h1 className="font-body text-4xl tracking-tighter font-light lg:text-6xl">Are we Pomelo yet?</h1>
          <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer">
            <GitHubIcon size={48} />
          </a>
        </div>
        <NextLink href="https://youtu.be/TNBR2Js1dH0?t=12" target="_blank" rel="noopener noreferrer">
          <p className="font-display text-6xl tracking-tighter font-bold text-blue-500 underline lg:text-8xl">
            Yes. Yes, we are.
          </p>
        </NextLink>
      </div>

      <ContributingCTA isOAuth2={isOAuth2} lastPomeloAt={lastPomeloAt} />
      <PomeloChart pomeloStats={pomeloStats} isOAuth2={isOAuth2} />
      <PomeloTimeline pomeloStats={pomeloStats} isOAuth2={isOAuth2} />

      <div className="flex flex-col gap-4 lg:gap-6">
        <h2 className="font-display text-2xl font-semibold lg:text-4xl">What was Pomelo, anyway?</h2>

        <div className="flex flex-col gap-4 font-body text-xl lg:text-2xl">
          <p>
            Discord forced all its{' '}
            <Link href="https://www.statista.com/statistics/1367922/discord-registered-users-worldwide/">
              560M+ registered users
            </Link>{' '}
            to migrate from Username#1234 to unique @usernames.
          </p>

          <p>
            Despite{' '}
            <Link href="https://support.discord.com/hc/en-us/community/posts/14337329256983">
              significant community backlash
            </Link>
            , this change, internally known as Pomelo, was still implemented.
          </p>

          <p>
            Discord&apos;s <Link href="https://discord.com/blog/usernames">official blog post</Link> offered more
            information.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:gap-6" id="contributing">
        <h2 className="font-display text-2xl font-semibold lg:text-4xl">How did this site work?</h2>

        <div className="flex flex-col gap-4 font-body text-xl lg:text-2xl">
          <p>
            There had been much indirection and rapidly changing information from the Discord team, prompting the
            creation of this site to track the progress of the Pomelo rollout.
          </p>

          <p>The site relied on Pomelo&apos;d users authenticating below. Users remained anonymous.</p>

          <PomeloButton />

          <p>
            <strong>NOTE</strong>: This project had no affiliation with Discord or its employees.
          </p>

          <InviteButton />

          <p>
            Pomelos from members were collected in real-time by inviting the bot. No permissions were required. All
            collected data remained anonymous; <Link href={GITHUB_REPO_URL}>the source code</Link> was open for
            auditing.
          </p>

          <p>
            Refer to the <Link href="/legal">Terms of Service & Privacy Policy</Link> for more information.
          </p>
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
              <Link href="https://discord.com/verification">Verified Server Owners</Link>, and some owners of servers
              with{' '}
              <Link href="https://creator-support.discord.com/hc/articles/10423011974551">
                Server Subscriptions (US only)
              </Link>
              . Moderator Programs Alumni, HypeSquad Events, and Discord Admins{' '}
              <strong>did NOT get early access</strong>. Some Moderator Programs Alumnis received early access by
              mistake when Discord tried to fix bugs with the rollout.
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
              server on June 5, 2023 (UTC) that &quot;Starting today, users will become eligible to update their
              usernames over the coming weeks on a rolling basis.&quot;
            </p>
          </div>

          <div className="flex flex-col gap-4 font-body text-xl lg:text-2xl">
            <p>
              <strong>Q: Did Nitro users get priority in the rollout?</strong>
            </p>

            <p>
              A: According to Discord&apos;s <Link href="https://discord.com/blog/usernames">official blog post</Link>:
              &quot;<strong>Current</strong> Nitro [non-Basic] subscribers [...] that registered for Nitro{' '}
              <strong>on or before March 1, 2023</strong> will also be given early access.&quot; Moreover,{' '}
              <Link href="https://twitter.com/DiscordPreviews/status/1665788875594186754">
                some Early Supporters registered in 2015
              </Link>{' '}
              appeared to have gotten early access.
            </p>
          </div>

          <div className="flex flex-col gap-4 font-body text-xl lg:text-2xl">
            <p>
              <strong>Q: I was an eligible Nitro user. Why was my username not available?</strong>
            </p>
            <p>
              A: Discord reserved usernames for the first registered active user on the platform with that name,
              regardless of their Nitro status or discriminator. This ensured that getting early access to Pomelo most
              of the time only meant that users got to pick a bad name before everyone else picked even worse names.
            </p>
          </div>

          <div className="flex flex-col gap-4 font-body text-xl lg:text-2xl">
            <p>
              <strong>Q: What were discriminators, and why were they removed?</strong>
            </p>

            <p>
              A: Discriminators were the four digits following a username, such as &quot;The Real Jason#0001.&quot; The
              term &quot;discriminator&quot; was not used in the app but was rather known as a &quot;tag.&quot; Discord
              claimed in their <Link href="https://discord.com/blog/usernames">blog post</Link> that &quot;nobody knows
              what a discriminator is&quot; and referenced a Reddit post as a source.
            </p>

            <p>
              Discord mentioned problems with the old system (that could&apos;ve been fixed without Pomelo), such as:
            </p>

            <ul className="ml-8 list-disc list-outside space-y-2">
              <li className="font-semibold">Usernames were case-sensitive.</li>
              <li className="font-semibold">Usernames sometimes contained special characters.</li>
              <li>
                <span className="font-semibold">&quot;Only&quot; 10,000 users were allowed per name.</span> (Then it
                became only 1 per name instead.)
              </li>
            </ul>

            <p>
              Friend invites would have made sense, right? Discord didn&apos;t think so. They had those for about a
              month, only on iOS, without marketing, claiming nobody used them. Instead, they decided to become
              &quot;one of the boys&quot; in the social media landscape and adopt unique @usernames and all the problems
              that came with them.
            </p>

            <p>
              Either way, this definitely happened, and criticism{' '}
              <Link href="https://old.reddit.com/r/discordapp/comments/13mceaw/removed_by_reddit/">
                was often silenced
              </Link>
              .
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
              <Link href="https://old.reddit.com/r/discordapp/comments/136urpb/comment/jiqdm9d/?context=1000">
                staff member at Discord
              </Link>
              , you &quot;could always add 4 numbers at the end of your username.&quot; Of course, there was a system
              for this already: discriminators.
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

      <div className="flex flex-col gap-4 text-md font-display font-light text-gray-700 dark:text-gray-400">
        <p>
          This site was archived on <Timestamp value={lastUpdatedAt} />.{' '}
          <Link href="/legal">Terms of Service & Privacy Policy</Link>.
        </p>
        <ThemeSwitch />
      </div>
    </main>
  );
}
