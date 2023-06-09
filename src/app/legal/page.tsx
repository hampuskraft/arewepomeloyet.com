import {GITHUB_REPO_URL} from '@/common/config';
import GitHubIcon from '@/components/github-icon';
import Link from '@/components/link';
import {Metadata} from 'next';
import NextLink from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service & Privacy Policy',
  description:
    '"Are we Pomelo yet?" is a crowdsourcing project to collect anonymized data about Discord\'s Pomelo rollout.',
};

export default function Legal() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-32 md:gap-16">
      <div className="flex flex-col gap-8">
        <div className="flex flex-row items-center gap-4 text-gray-700 dark:text-gray-400">
          <h1 className="font-body text-4xl tracking-tighter font-light lg:text-6xl">Are we Pomelo yet?</h1>
          <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer">
            <GitHubIcon size={48} />
          </a>
        </div>
        <p className="font-display text-6xl tracking-tighter font-bold text-black dark:text-white lg:text-8xl">
          Yes, but actually no.
        </p>
      </div>

      <NextLink
        className="max-w-max rounded-xl bg-blue-500 px-4 py-2 font-display font-bold text-white transition-colors duration-200 ease-in-out hover:bg-blue-600"
        href="/"
      >
        Take me home, country roads
      </NextLink>

      <div className="flex flex-col gap-6 lg:gap-8">
        <h2 className="font-display text-2xl font-semibold lg:text-4xl">Terms of Service & Privacy Policy</h2>

        <div className="flex flex-col gap-4 font-body text-xl lg:text-2xl">
          <p>
            &quot;Are we Pomelo yet?&quot; is a crowdsourcing project to collect anonymized data about Discord&apos;s
            Pomelo rollout.
          </p>

          <p>
            <strong>NOTE</strong>: We&apos;re not affiliated with Discord or any of its employees.
          </p>

          <p>
            You can use this service in two ways: adding the bot to your server or using the OAuth2 button on the
            landing page to add yourself to the website.
          </p>
          <p>
            By using this service, you agree to the following terms of service. If you disagree with these terms, do not
            use this service.
          </p>
        </div>

        <div className="flex flex-col gap-4 font-body text-xl lg:text-2xl">
          <h3 className="font-semibold">1. Data Collection</h3>
          <p>
            We collect the following <strong>anonymized</strong> data (see{' '}
            <Link href={`${GITHUB_REPO_URL}/blob/main/prisma/schema.prisma`}>source code</Link>):
          </p>

          <ul className="ml-8 list-disc list-outside space-y-1">
            <li>Discord user ID hash (SHA-256)</li>
            <li>Discord registration date (YYYY-MM)</li>
            <li>Possible Nitro status (boolean)</li>
            <li>Early Supporter status (boolean)</li>
            <li>Added through OAuth2 or bot? (boolean)</li>
            <li>When the record was created (timestamp)</li>
          </ul>

          <p>
            We listen for the following Discord Gateway events to collect this data (see{' '}
            <Link href={`${GITHUB_REPO_URL}/blob/main/bot/src/index.ts`}>source code</Link>):
          </p>

          <ul className="ml-8 list-disc list-outside space-y-1">
            <li>Guild Create*</li>
            <li>Guild Member Add*</li>
            <li>Guild Member Update</li>
            <li>User Update</li>
            <li>Guild Member Remove*</li>
            <li>Guild Delete*</li>
          </ul>

          <p className="text-base text-gray-500">
            * These events are also used to synchronize the total guilds and members counters on the landing page.
          </p>

          <p>
            We do NOT have any logs containing uniquely identifiable information, nor store anything else but the data
            model described earlier. This can be independently verified by looking at the source code.
          </p>
        </div>

        <div className="flex flex-col gap-4 font-body text-xl lg:text-2xl">
          <h3 className="font-semibold">2. Data Usage</h3>
          <p>
            We use the collected data to display anonymized aggregated statistics on the website through crowdsourcing.
            We only use the data for this purpose and nothing else.
          </p>

          <p>
            The bot developer will NOT access the data unless for debugging purposes and will NOT share the data with
            anyone else. <strong>We will permanently delete the hash database when the Pomelo rollout is over.</strong>
          </p>

          <p>
            The only barely personal information we collect is your hashed Discord user ID using SHA-256 to prevent
            adding duplicate records to the database.
          </p>
        </div>

        <div className="flex flex-col gap-4 font-body text-xl lg:text-2xl">
          <h3 className="font-semibold">3. Data Storage</h3>

          <p>
            Our services are hosted using{' '}
            <Link href="https://fly.io/docs/about/healthcare/" isExternal>
              Fly.io
            </Link>{' '}
            in the State of California in the United States of America:
          </p>

          <ul className="ml-8 list-disc list-outside space-y-4">
            <li>
              <strong>Database Endpoint Security</strong>: &quot;Databases on Fly.io talk to app servers over 6PN and
              WireGuard, and never to the public Internet.&quot;
            </li>

            <li>
              <strong>Anti-Spoofing Controls</strong>: &quot;Attackers that boot up evil Fly.io apps can&apos;t spoof
              packets to other Fly.io instances.&quot;
            </li>

            <li>
              <strong>Hardened Hosting</strong>: &quot;Apps running on Fly.io run inside Firecracker, a Rust-based,
              memory-safe KVM hypervisor designed at Amazon as the engine for Fargate.&quot;
            </li>

            <li>
              <strong>Secrets Management</strong>: &quot;We provide a &apos;write-only&apos; secrets management scheme
              that keeps app secrets encrypted, exposing them only to running instances of your app.&quot;
            </li>

            <li>
              <strong>WireGuard Everywhere</strong>: &quot;Everything talks to everything else over WireGuard. WireGuard
              is a next-generation in-kernel (and userland) VPN designed by vulnerability researchers for simplicity,
              auditability, and modern cryptography.&quot;
            </li>

            <li>
              <strong>Encryption in Transit</strong>: &quot;WireGuard runs 256-bit ChaCha20-Poly1305 with an
              authenticated Curve25519 key exchange.&quot;
            </li>

            <li>
              <strong>TLS Everywhere</strong>: &quot;Fly.io terminates TLS for our users at our edge. We run a fleet of
              memory-safe, Rust-based proxies that use the Hyper and Rustls libraries to implement HTTPS.&quot;
            </li>

            <li>
              <strong>6PN Private Networking</strong>: &quot;We use eBPF in the Linux kernel to ensure that private
              networks can&apos;t talk to each other; they&apos;re completely private, without any extra
              configuration.&quot;
            </li>

            <li>
              <strong>Encryption at Rest (we use Fly Postgres)</strong>: &quot;[...] It works like a drive plugged in
              and mounted in your app instance. And those drives are block-level encrypted with AES-XTS.&quot;
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4 font-body text-xl lg:text-2xl">
          <h3 className="font-semibold">4. Data Deletion</h3>

          <p>
            Since the database is anonymized, we cannot identify your record without running your user ID(s) through the
            SHA-256 algorithm. This is a one-way hash function, meaning it is only possible to reverse the process and
            identify your record by knowing your user ID(s).
          </p>

          <p>
            As previously mentioned, our Postgres database is encrypted at rest using AES-XTS. This means that even if
            someone could access the database volume, they would not be able to read the data without the encryption
            key. The Fly.io account is protected with hardware security keys.
          </p>

          <p>
            Moreover, <strong>we will permanently delete the hash database when the Pomelo rollout is over</strong> and
            cease collecting real-time data. We will export the aggregated statistics to a flat JSON file hosted on
            GitHub.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:gap-8">
        <h2 className="font-display text-2xl font-semibold lg:text-4xl">Contact</h2>

        <div className="flex flex-col gap-4 font-body text-xl lg:text-2xl">
          <p>
            The data controller is{' '}
            <Link href="https://hampuskraft.com" isExternal>
              Hampus Kraft
            </Link>
            , and the data processor is <Link href="https://fly.io">Fly.io</Link>. The data is stored in the United
            States of America and is encrypted at rest using AES-XTS.
          </p>

          <p>
            If you have any questions or concerns regarding this terms of service or privacy policy, please contact us
            through email at{' '}
            <Link href="mailto:arewepomeloyet@hampuskraft.com" isExternal>
              arewepomeloyet@hampuskraft.com
            </Link>
            .
          </p>

          <p>
            Our source code is publicly auditable on{' '}
            <Link href={GITHUB_REPO_URL} isExternal>
              GitHub
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
