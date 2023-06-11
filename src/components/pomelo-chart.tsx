'use client';

import {BotStatsResponse, PomeloStatsResponse} from '@/common/database';
import {ArrowsRightLeftIcon} from '@heroicons/react/24/solid';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import {useState} from 'react';
import {Bar, Line} from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, Legend, LinearScale, LineElement, PointElement, Title, Tooltip);

export default function PomeloChart({
  pomeloStats,
  botStats,
  isOAuth2,
}: {
  pomeloStats: PomeloStatsResponse;
  botStats: BotStatsResponse;
  isOAuth2: boolean;
}) {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [isBotChart, setIsBotChart] = useState<boolean>(false);

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

  const botChartData = {
    labels: pomeloStats.stats.map((item) => item.date),
    datasets: [
      {
        label: 'Total (%)',
        data: pomeloStats.stats.map((item) => item.totalCount / botStats.members),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.5)',
        fill: true,
      },
      {
        label: 'Early Supporters (%)',
        data: pomeloStats.stats.map((item) => item.earlySupporterCount / botStats.members),
        borderColor: 'rgba(255,205,86,1)',
        backgroundColor: 'rgba(255,205,86,0.5)',
        fill: true,
        hidden: true,
      },
      {
        label: 'Nitro (%)',
        data: pomeloStats.stats.map((item) => item.nitroCount / botStats.members),
        borderColor: 'rgba(255,99,132,1)',
        backgroundColor: 'rgba(255,99,132,0.5)',
        fill: true,
        hidden: true,
      },
      {
        label: 'Non-Nitro (%)',
        data: pomeloStats.stats.map((item) => item.nonNitroCount / botStats.members),
        borderColor: 'rgba(54,162,235,1)',
        backgroundColor: 'rgba(54,162,235,0.5)',
        fill: true,
        hidden: true,
      },
    ],
  };

  const totalPercentage = (pomeloStats.total / botStats.members) * 100;
  const ChartComponent = chartType === 'line' ? Line : Bar;

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <div className="flex flex-col md:flex-row justify-between gap-2 items-center">
        <div className="flex flex-row gap-3 items-center">
          <h2 className="font-display text-2xl font-semibold lg:text-4xl">Pomelo Stats</h2>
          <span className="font-display text-sm font-semibold px-2 py-1 bg-blue-500 text-white rounded-2xl">
            {isBotChart ? 'Bot Member Chart' : isOAuth2 ? 'OAuth2-Only Chart' : 'Total Chart'}
          </span>
        </div>

        {!isOAuth2 && (
          <button
            className="flex flex-row gap-2 items-center font-display text-xl font-semibold"
            onClick={() => {
              setIsBotChart((prev) => {
                setChartType(prev ? 'line' : 'bar');
                return !prev;
              });
            }}
          >
            <span>Switch to {isBotChart ? 'Total Chart' : 'Bot Member Chart'}</span>
            <ArrowsRightLeftIcon className="w-6 h-6 flex-shrink-0" />
          </button>
        )}
      </div>

      <p className="font-body text-xl lg:text-2xl">
        Protip: You can toggle individual {chartType === 'line' ? 'lines' : 'bars'} by clicking on the legend.{' '}
        {!isBotChart && (
          <span
            className="text-blue-500 font-semibold hover:underline"
            role="button"
            tabIndex={0}
            onClick={() => setChartType(chartType === 'line' ? 'bar' : 'line')}
          >
            Want a {chartType === 'line' ? 'bar' : 'line'} chart instead?
          </span>
        )}
      </p>

      <div className="relative h-[500px] md:h-[600px]">
        <ChartComponent
          data={isBotChart ? botChartData : chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top' as const,
              },
            },
            scales: {
              x: {title: {display: true, text: 'Registration Date'}},
              y: {
                title: {display: true, text: isBotChart ? 'Percentage (%)' : 'Pomelos'},
                ...(isBotChart ? {ticks: {format: {style: 'percent', maximumSignificantDigits: 2}}} : {}),
              },
            },
          }}
        />
      </div>

      {isBotChart && (
        <p>
          {totalPercentage.toFixed(1)}% of the bot&apos;s {botStats.members.toLocaleString()} members have registered a
          Pomelo.
        </p>
      )}
    </div>
  );
}
