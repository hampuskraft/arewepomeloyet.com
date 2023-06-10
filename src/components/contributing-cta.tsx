'use client';

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

export default function ContributingCTA({isOAuth2, lastPomeloAt}: {isOAuth2: boolean; lastPomeloAt: number}) {
  const [isCTAHidden, setIsCTAHidden] = useState(false);
  useEffect(() => {
    if (localStorage.getItem('isCTAHidden') === 'true') {
      setIsCTAHidden(true);
    }
  }, []);

  return (
    <div className="flex bg-blue-500 text-white rounded-xl p-4 lg:p-6 flex-col gap-4">
      <div className="flex flex-row gap-4 items-center justify-between">
        <h2 className="font-display text-xl lg:text-2xl font-semibold">
          Here&apos;s looking at you, kid. And you&apos;re looking at the {isOAuth2 ? 'OAuth2-Only' : 'Default'} View.
        </h2>

        <button
          className="flex items-center justify-center"
          aria-label={`${isCTAHidden ? 'Show' : 'Hide'} CTA`}
          onClick={() => {
            setIsCTAHidden(!isCTAHidden);
            localStorage.setItem('isCTAHidden', String(!isCTAHidden));
          }}
        >
          <ChevronDownIcon
            style={{
              height: 24,
              transform: isCTAHidden ? 'rotate3d(0, 0, -1, 180deg)' : 'rotate3d(0, 0, -1, 0deg)',
              transition: 'transform .2s ease',
              width: 24,
            }}
          />
        </button>
      </div>

      {!isCTAHidden && (
        <>
          <div className="flex flex-col gap-4 font-body text-md lg:text-xl font-light">
            <p>
              Due to limitations with the Discord API, the Nitro status of users collected from the bot may be
              inaccurate. Premium usage can be inferred from features such as animated avatars, avatar decorations,
              banners, and server profiles.
            </p>
            <p>
              To guarantee Nitro status, switch to the OAuth2-only view. However, eligibility is not guaranteed as
              Discord doesn&apos;t provide information on how long a user has been subscribed to OAuth2 applications.
            </p>
            <p>
              Partners and staff members are automatically excluded. Entries with few Pomelos in the default view likely
              come from staff members with hidden badges, staff alternate accounts, verified server owners, or owners of
              highly monetized servers.
            </p>
            <p>
              Last Pomelo registered on <Timestamp value={lastPomeloAt} />.
            </p>
          </div>

          <a
            className="max-w-max rounded-xl bg-white px-4 py-2 font-display font-bold text-blue-500 transition-colors duration-200 ease-in-out hover:bg-opacity-80"
            role="button"
            onClick={() => {
              smoothScrollTo('#contributing');
              window.history.pushState({}, '', '#contributing');
            }}
          >
            How does this work? (And how can I contribute?)
          </a>

          <NextLink
            className="max-w-max rounded-xl bg-white px-4 py-2 font-display font-bold text-blue-500 transition-colors duration-200 ease-in-out hover:bg-opacity-80"
            href={isOAuth2 ? '/' : '/oauth2'}
          >
            Switch to the {isOAuth2 ? 'Default' : 'OAuth2-Only'} View
          </NextLink>
        </>
      )}
    </div>
  );
}
