'use client';

import {PomeloStatsResponse} from '@/common/database';
import {ArrowsRightLeftIcon} from '@heroicons/react/24/solid';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import {useState} from 'react';
import {Bar, Line} from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, Filler, Legend, LinearScale, LineElement, PointElement, Title, Tooltip);

export default function PomeloChart({pomeloStats, isOAuth2}: {pomeloStats: PomeloStatsResponse; isOAuth2: boolean}) {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [isTimestampChart, setIsTimestampChart] = useState(false);

  const chartData = {
    labels: pomeloStats.stats.map((item) => item.date),
    datasets: [
      {
        label: 'Total',
        data: pomeloStats.stats.map((item) => item.totalCount),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.5)',
        fill: chartType === 'line' ? false : true,
        hidden: true,
      },
      {
        label: 'Early Supporters',
        data: pomeloStats.stats.map((item) => item.earlySupporterCount),
        borderColor: 'rgba(255,205,86,1)',
        backgroundColor: 'rgba(255,205,86,0.5)',
        fill: chartType === 'line' ? false : true,
        hidden: true,
      },
      {
        label: 'Nitro',
        data: pomeloStats.stats.map((item) => item.nitroCount),
        borderColor: 'rgba(255,99,132,1)',
        backgroundColor: 'rgba(255,99,132,0.5)',
        fill: chartType === 'line' ? false : true,
      },
      {
        label: 'Non-Nitro',
        data: pomeloStats.stats.map((item) => item.nonNitroCount),
        borderColor: 'rgba(54,162,235,1)',
        backgroundColor: 'rgba(54,162,235,0.5)',
        fill: chartType === 'line' ? false : true,
      },
    ],
  };

  const timestampData = {
    labels: Object.keys(pomeloStats.last24HourPomeloCounts).map((value) => {
      const month = new Date(value).getMonth() + 1;
      const day = new Date(value).getDate();
      const hour = new Date(value).getHours();
      return `${month}/${day} ${hour}:00`;
    }),
    datasets: [
      {
        label: 'New Pomelos',
        data: Object.values(pomeloStats.last24HourPomeloCounts),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.5)',
        fill: chartType === 'line' ? false : true,
      },
    ],
  };

  const ChartComponent = chartType === 'line' ? Line : Bar;

  function toggleChartType() {
    setChartType(chartType === 'line' ? 'bar' : 'line');
  }

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <div className="flex flex-col md:flex-row justify-between gap-2 items-center">
        <div className="flex flex-row gap-3 items-center">
          <h2 className="font-display text-2xl font-semibold lg:text-4xl">Pomelo Stats</h2>
          <span className="font-display text-sm font-semibold px-2 py-1 bg-blue-500 text-white rounded-2xl">
            {isTimestampChart ? 'New Pomelos Chart (24h · UTC)' : isOAuth2 ? 'OAuth2-Only Chart' : 'Total Chart'}
          </span>
        </div>

        {!isOAuth2 && (
          <button
            className="flex flex-row gap-2 items-center font-display text-xl font-semibold"
            onClick={() => setIsTimestampChart((prev) => !prev)}
          >
            <span>Switch to {isTimestampChart ? 'Total' : 'New Pomelos'} Chart</span>
            <ArrowsRightLeftIcon className="w-6 h-6 flex-shrink-0" />
          </button>
        )}
      </div>

      <p className="font-body text-xl lg:text-2xl">
        Protip: You can toggle individual {chartType === 'line' ? 'lines' : 'bars'} by clicking on the legend.{' '}
        <span
          className="text-blue-500 font-semibold hover:underline"
          role="button"
          tabIndex={0}
          onClick={() => toggleChartType()}
          onKeyDown={(e) => {
            if (e.key === 'Enter') toggleChartType();
          }}
        >
          Want a {chartType === 'line' ? 'bar' : 'line'} chart instead?
        </span>
      </p>

      <div className="relative h-[500px] md:h-[600px]">
        <ChartComponent
          data={isTimestampChart ? timestampData : chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {legend: {position: 'top' as const}},
            scales: {
              x: {title: {display: true, text: isTimestampChart ? 'Claimed At' : 'Registration Date'}},
              y: {title: {display: true, text: 'Pomelos'}},
            },
          }}
        />
      </div>
    </div>
  );
}
