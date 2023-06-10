'use client';

import {PomeloStatsResponse} from '@/common/database';
import {ChevronDownIcon} from '@heroicons/react/24/solid';
import {useEffect, useState} from 'react';

const STORAGE_KEY = 'isTimelineHidden';

export default function PomeloTimeline({pomeloStats, isOAuth2}: {pomeloStats: PomeloStatsResponse; isOAuth2: boolean}) {
  const {stats, total} = pomeloStats;
  const [isMounted, setIsMounted] = useState(false);
  const [isTimelineHidden, setIsTimelineHidden] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsTimelineHidden(window.localStorage.getItem(STORAGE_KEY) === 'true');
  }, []);

  if (!isMounted) {
    return null;
  }

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

      {isTimelineHidden ? null : stats.length === 0 ? (
        <p className="font-body text-xl lg:text-2xl">No Pomelos registered yet. Be the first!</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stats) => {
            const date = new Date(stats.date);
            const month = date.toLocaleString('default', {month: 'long'});
            const year = date.getFullYear();
            return (
              <div key={stats.date} className="p-4 rounded-xl bg-blue-500 text-white flex flex-col gap-2">
                <time className="font-body text-xl font-light">
                  {month} {year}
                </time>
                <h3 className="font-display text-2xl font-semibold lg:text-4xl">{stats.totalCount.toLocaleString()}</h3>
                <div className="flex flex-col gap-1">
                  {stats.nitroCount > 0 && (
                    <p className="font-body text-md font-light">
                      {stats.nitroCount.toLocaleString()} Nitro user{stats.nitroCount > 1 ? 's' : ''}
                      {isOAuth2 ? '' : ' (inaccurate)'}
                    </p>
                  )}
                  {stats.earlySupporterCount > 0 && (
                    <p className="font-body text-md font-light">
                      {stats.earlySupporterCount.toLocaleString()} Early Supporter
                      {stats.earlySupporterCount > 1 ? 's' : ''}
                    </p>
                  )}
                  {stats.nonNitroCount > 0 && (
                    <p className="font-body text-md font-light">
                      {stats.nonNitroCount.toLocaleString()} non-Nitro user{stats.nonNitroCount > 1 ? 's' : ''}
                      {isOAuth2 ? '' : ' (inaccurate)'}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
