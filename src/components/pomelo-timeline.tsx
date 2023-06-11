'use client';

import {PomeloStats, PomeloStatsResponse} from '@/common/database';
import {ChevronDownIcon} from '@heroicons/react/24/solid';
import {Temporal} from '@js-temporal/polyfill';
import {useEffect, useState} from 'react';

const STORAGE_KEY = 'isTimelineHidden';

export default function PomeloTimeline({pomeloStats, isOAuth2}: {pomeloStats: PomeloStatsResponse; isOAuth2: boolean}) {
  const {stats, total} = pomeloStats;
  const [isMounted, setIsMounted] = useState(false);
  const [isTimelineHidden, setIsTimelineHidden] = useState(false);
  const [showDetails, setShowDetails] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    setIsTimelineHidden(window.localStorage.getItem(STORAGE_KEY) === 'true');
  }, []);

  if (!isMounted) {
    return null;
  }

  const statsByYear = stats.reduce((acc, stats) => {
    const date = Temporal.PlainYearMonth.from(stats.date);
    if (!acc[date.year]) {
      acc[date.year] = [];
    }
    acc[date.year].push(stats);
    return acc;
  }, {} as Record<number, PomeloStats[]>);

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <div className="flex flex-col md:flex-row justify-between gap-2 items-center">
        <div className="flex flex-row gap-3 items-center">
          <h2 className="font-display text-2xl font-semibold lg:text-4xl">Timeline</h2>
          <span className="font-display text-sm font-semibold px-2 py-1 bg-blue-500 text-white rounded-2xl">
            {total.toLocaleString()} records
          </span>
        </div>

        <button
          className="flex flex-row gap-2 items-center font-display text-xl font-semibold"
          onClick={() => {
            setIsTimelineHidden((prev) => {
              window.localStorage.setItem(STORAGE_KEY, String(!prev));
              return !prev;
            });
          }}
        >
          <span>{isTimelineHidden ? 'Show' : 'Hide'} Timeline</span>
          <ChevronDownIcon
            className="w-6 h-6 flex-shrink-0"
            style={{
              transform: isTimelineHidden ? 'rotate3d(0, 0, -1, 180deg)' : 'rotate3d(0, 0, -1, 0deg)',
              transition: 'transform .2s ease',
            }}
          />
        </button>
      </div>

      {!isTimelineHidden && (
        <>
          <p className="font-body text-xl lg:text-2xl">
            You&apos;re in the {isOAuth2 ? 'OAuth2-Only' : 'Default'} View.
            {isOAuth2 ? '' : ' Nitro counts are inaccurate, see above.'}{' '}
            <span
              className="text-blue-500 font-semibold hover:underline"
              role="button"
              tabIndex={0}
              onClick={() => setShowDetails((prev) => !prev)}
            >
              Want to {showDetails ? 'hide' : 'show'} details?
            </span>
          </p>

          {stats.length === 0 ? (
            <p className="font-body text-xl lg:text-2xl">No Pomelos registered yet. Be the first!</p>
          ) : (
            Object.entries(statsByYear).map(([year, stats]) => (
              <div key={year} className="flex flex-col gap-4">
                <div className="flex flex-row gap-2 items-center">
                  <h3 className="font-display text-2xl font-semibold lg:text-4xl">{year}</h3>
                  <span className="font-display text-sm font-semibold px-2 py-1 bg-blue-500 text-white rounded-2xl">
                    {stats.reduce((acc, stats) => acc + stats.totalCount, 0).toLocaleString()} records
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.map((stats) => (
                    <PomeloStatsEntry key={stats.date} stats={stats} total={total} showDetails={showDetails} />
                  ))}
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

function PomeloStatsEntry({stats, total, showDetails}: {stats: PomeloStats; total: number; showDetails: boolean}) {
  const date = Temporal.PlainYearMonth.from(stats.date);

  return (
    <div className="p-4 rounded-xl bg-blue-500 text-white flex flex-col gap-2">
      <time className="font-body text-xl font-light">
        {date.toLocaleString('default', {month: 'long', calendar: 'iso8601'})} {date.year}
      </time>

      <div className="flex flex-row gap-2 items-center">
        <h3 className="font-display text-2xl font-semibold lg:text-4xl">{stats.totalCount.toLocaleString()}</h3>
        <p className="font-body text-xl font-light">({((stats.totalCount / total) * 100).toFixed(1)}%)</p>
      </div>

      {showDetails && (
        <div className="flex flex-col gap-1 font-body text-md font-light">
          {stats.nitroCount > 0 && (
            <p>
              {stats.nitroCount.toLocaleString()} Nitro user{stats.nitroCount > 1 ? 's' : ''}*
            </p>
          )}
          {stats.earlySupporterCount > 0 && (
            <p>
              {stats.earlySupporterCount.toLocaleString()} Early Supporter user
              {stats.earlySupporterCount > 1 ? 's' : ''}
            </p>
          )}
          {stats.nonNitroCount > 0 && (
            <p>
              {stats.nonNitroCount.toLocaleString()} Non-Nitro user{stats.nonNitroCount > 1 ? 's' : ''}*
            </p>
          )}
        </div>
      )}
    </div>
  );
}
