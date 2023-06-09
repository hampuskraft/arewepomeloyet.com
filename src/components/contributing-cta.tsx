import Timestamp from '@/components/timestamp';
import {ChevronDownIcon} from '@heroicons/react/24/solid';
import NextLink from 'next/link';
import {useEffect, useState} from 'react';

function smoothScrollTo(selector: string) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const element = document.querySelector(selector);
  if (element) {
    element.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'center',
      inline: 'center',
    });
  }
}

const STORAGE_KEY = 'isCTAHidden';

export default function ContributingCTA({isOAuth2, lastPomeloAt}: {isOAuth2: boolean; lastPomeloAt: number}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isCTAHidden, setIsCTAHidden] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsCTAHidden(window.localStorage.getItem(STORAGE_KEY) === 'true');
  }, []);

  if (!isMounted) {
    return null;
  }

  const buttonProps = {
    role: 'button',
    'aria-label': `${isCTAHidden ? 'Show' : 'Hide'} CTA`,
    onClick() {
      setIsCTAHidden((prev) => {
        window.localStorage.setItem(STORAGE_KEY, String(!prev));
        return !prev;
      });
    },
  };

  return (
    <div
      className="flex bg-blue-500 text-white rounded-xl p-4 lg:p-6 flex-col gap-4 select-none"
      {...(isCTAHidden ? buttonProps : {})}
    >
      <div className="flex flex-row gap-4 items-center justify-between" {...(!isCTAHidden ? buttonProps : {})}>
        <h2 className="font-display text-xl lg:text-2xl font-semibold">
          Here&apos;s looking at you, kid. And you&apos;re looking at the {isOAuth2 ? 'OAuth2-Only' : 'Default'} View.
        </h2>

        <ChevronDownIcon
          className="w-6 h-6 flex-shrink-0"
          style={{
            transform: isCTAHidden ? 'rotate3d(0, 0, -1, 180deg)' : 'rotate3d(0, 0, -1, 0deg)',
            transition: 'transform .2s ease',
          }}
        />
      </div>

      {!isCTAHidden && (
        <>
          <div className="flex flex-col gap-4 font-body text-md lg:text-xl font-light select-all">
            <p>
              Due to limitations with the Discord API, the Nitro status of users collected from the bot might have been
              inaccurate. Premium usage could be inferred from features such as animated avatars, avatar decorations,
              banners, and server profiles.
            </p>
            <p>
              To confirm Nitro status, users could switch to the OAuth2-only view. However, eligibility was not
              guaranteed as Discord didn&apos;t provide information on the duration of a user&apos;s subscription to
              OAuth2 applications.
            </p>
            <p>
              Partners and staff members were automatically excluded. Entries with few Pomelos in the default view
              likely originated from staff members with hidden badges, staff alternate accounts, verified server owners,
              or owners of highly monetized servers.
            </p>
            <p>
              The last Pomelo was registered on <Timestamp value={lastPomeloAt} />.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <a
              className="max-w-max rounded-xl bg-white px-4 py-2 font-display font-bold text-blue-500 transition-colors duration-200 ease-in-out hover:bg-opacity-80"
              role="button"
              onClick={() => {
                smoothScrollTo('#contributing');
                window.history.pushState({}, '', '#contributing');
              }}
            >
              How did this work?
            </a>

            <NextLink
              className="max-w-max rounded-xl bg-white px-4 py-2 font-display font-bold text-blue-500 transition-colors duration-200 ease-in-out hover:bg-opacity-80"
              href={isOAuth2 ? '/' : '/oauth2'}
            >
              Switch to the {isOAuth2 ? 'Default' : 'OAuth2-Only'} View
            </NextLink>
          </div>
        </>
      )}
    </div>
  );
}
