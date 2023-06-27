import GitHubIcon from '@/components/github-icon';
import Link from '@/components/link';
import {DESCRIPTION, GITHUB_REPO_URL} from '@/config';
import NextLink from 'next/link';

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
          Yes. Yes, we are.
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
          <p>{DESCRIPTION}</p>

          <p>
            <strong>NOTE</strong>: This project had no affiliation with Discord or its employees.
          </p>

          <p>
            Users had two ways to engage with this service: adding the bot to a server or using the OAuth2 button on the
            landing page to contribute to the dataset.
          </p>

          <p>
            By engaging with this service, users agreed to the following terms of service. If these terms were not
            agreeable, the service should not have been used.
          </p>
        </div>

        <div className="flex flex-col gap-4 font-body text-xl lg:text-2xl">
          <h3 className="font-semibold">1. Data Collection</h3>
          <p>
            The following anonymized data was gathered (refer to{' '}
            <Link href={`${GITHUB_REPO_URL}/blob/436d134101b09de808b20044c3311dd17ae3c15d/prisma/schema.prisma`}>
              source code
            </Link>
            ):
          </p>

          <ul className="ml-8 list-disc list-outside space-y-1">
            <li>Discord user ID hash (SHA-256)</li>
            <li>Discord registration date (YYYY-MM)</li>
            <li>Possibly Nitro (yes/no)</li>
            <li>Early Supporter (yes/no)</li>
            <li>Added through OAuth2 (yes/no)</li>
            <li>Creation time of the record</li>
          </ul>

          <p>
            To collect this data, several Discord Gateway events were monitored (refer to{' '}
            <Link href={`${GITHUB_REPO_URL}/blob/436d134101b09de808b20044c3311dd17ae3c15d/bot/src/index.ts`}>
              source code
            </Link>
            ):
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
            * These events also helped synchronize the total guilds and members counters on the landing page.
          </p>

          <p>
            There were no logs that contained uniquely identifiable information, nor was any other information stored
            outside of the data model described earlier. This claim could be verified by examining the source code.
          </p>
        </div>

        <div className="flex flex-col gap-4 font-body text-xl lg:text-2xl">
          <h3 className="font-semibold">2. Data Usage</h3>
          <p>
            The gathered data was used to display anonymized statistics on the website through crowdsourcing. The data
            was strictly used for this purpose.
          </p>

          <p>
            The bot developer didn&apos;t access the data unless it was needed for debugging purposes and didn&apos;t
            share the data with anyone else. The hash database was permanently deleted when the Pomelo rollout was
            considered concluded on June 27, 2023.
          </p>

          <p>
            The only slightly personal information collected was the hashed Discord user ID using SHA-256, which helped
            prevent the addition of duplicate records to the database. However, this information was not used for any
            other purpose, and the dataset is no longer available.
          </p>
        </div>

        <div className="flex flex-col gap-4 font-body text-xl lg:text-2xl">
          <h3 className="font-semibold">3. Data Storage</h3>

          <p>
            Services were hosted using <Link href="https://fly.io">Fly.io</Link> in the State of California in the
            United States of America. Details regarding database endpoint security, anti-spoofing controls, hardened
            hosting, secrets management, and more can be provided upon request.
          </p>

          <ul className="ml-8 list-disc list-outside space-y-4">
            <li>
              <strong>Database Endpoint Security</strong>: Databases on Fly.io talked to app servers over 6PN and
              WireGuard, and never to the public Internet.
            </li>

            <li>
              <strong>Anti-Spoofing Controls</strong>: Attackers that booted up harmful Fly.io apps couldn&apos;t spoof
              packets to other Fly.io instances.
            </li>

            <li>
              <strong>Hardened Hosting</strong>: Apps running on Fly.io ran inside Firecracker, a Rust-based,
              memory-safe KVM hypervisor designed at Amazon as the engine for Fargate.
            </li>

            <li>
              <strong>Secrets Management</strong>: A &quot;write-only&quot; secrets management scheme was employed that
              kept app secrets encrypted, exposing them only to running instances of the app.
            </li>

            <li>
              <strong>WireGuard Everywhere</strong>: Every component communicated with every other component over
              WireGuard. WireGuard is a next-generation in-kernel (and userland) VPN designed by vulnerability
              researchers for simplicity, auditability, and modern cryptography.
            </li>

            <li>
              <strong>Encryption in Transit</strong>: WireGuard operated 256-bit ChaCha20-Poly1305 with an authenticated
              Curve25519 key exchange.
            </li>

            <li>
              <strong>TLS Everywhere</strong>: Fly.io terminated TLS at its edge. A fleet of memory-safe, Rust-based
              proxies that used the Hyper and Rustls libraries to implement HTTPS was in operation.
            </li>

            <li>
              <strong>6PN Private Networking</strong>: eBPF in the Linux kernel was utilized to ensure that private
              networks couldn&apos;t talk to each other; they were completely private, without any extra configuration.
            </li>

            <li>
              <strong>Encryption at Rest (Fly Postgres was used)</strong>: Fly.io Volumes functioned like a drive
              plugged in and mounted in an app instance. And those drives were block-level encrypted with AES-XTS.
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4 font-body text-xl lg:text-2xl">
          <h3 className="font-semibold">4. Data Deletion</h3>

          <p>
            Since the database was anonymized, it wasn&apos;t possible to identify a record without running the user
            ID(s) through the SHA-256 algorithm. This is a one-way hash function, meaning it&apos;s only possible to
            reverse the process and identify a record by knowing the user ID(s).
          </p>

          <p>
            As previously mentioned, the Postgres database was encrypted at rest using AES-XTS. This meant that even if
            someone managed to access the database volume, they would not be able to read the data without the
            encryption key. The Fly.io account was protected with hardware security keys.
          </p>

          <p>
            Moreover, after the Pomelo rollout was considered mostly finished on June 27, 2023, the hash database was
            permanently deleted and real-time data collection was stopped. The anonymized statistics were then exported
            to a flat JSON file hosted on GitHub.
          </p>

          <p>
            For those who wanted to delete their anonymized data before the end of the Pomelo rollout, they were advised
            to send an email to{' '}
            <Link href="mailto:legal@arewepomeloyet.com" isExternal={false}>
              legal@arewepomeloyet.com
            </Link>
            , and the corresponding record(s) was removed from the database. However, it was noted that this would
            affect the accuracy of the anonymized statistics.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:gap-8">
        <h2 className="font-display text-2xl font-semibold lg:text-4xl">Contact</h2>

        <div className="flex flex-col gap-4 font-body text-xl lg:text-2xl">
          <p>
            <Link href="https://hampuskraft.com">Hampus Kraft</Link> acted as the data controller, while{' '}
            <Link href="https://fly.io">Fly.io</Link> was the data processor. The data was stored in the United States
            of America and was encrypted at rest using AES-XTS.
          </p>

          <p>
            For any questions or concerns regarding the terms of service or privacy policy, users were advised to send
            an email to{' '}
            <Link href="mailto:legal@arewepomeloyet.com" isExternal={false}>
              legal@arewepomeloyet.com
            </Link>
            .
          </p>

          <p>
            For general inquiries, emails could be sent to{' '}
            <Link href="mailto:support@arewepomeloyet.com" isExternal={false}>
              support@arewepomeloyet.com
            </Link>
            . Vulnerability disclosure was encouraged and could be sent to{' '}
            <Link href="mailto:security@arewepomeloyet.com" isExternal={false}>
              security@arewepomeloyet.com
            </Link>
            .
          </p>

          <p>
            The source code is publicly auditable on <Link href={GITHUB_REPO_URL}>GitHub</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
