'use client';

import {PomeloStatsResponse} from '@/common/database';
import {
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import {Line} from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function PomeloLineChart({
  pomeloStats,
  isOAuth2,
}: {
  pomeloStats: PomeloStatsResponse;
  isOAuth2: boolean;
}) {
  const chartData: ChartData<'line', number[], string> = {
    labels: pomeloStats.stats.map((item) => item.date),
    datasets: [
      {
        label: 'Total',
        data: pomeloStats.stats.map((item) => item.totalCount),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
        hidden: true,
      },
      {
        label: 'Early Supporters',
        data: pomeloStats.stats.map((item) => item.earlySupporterCount),
        borderColor: 'rgba(255,205,86,1)',
        fill: false,
        hidden: true,
      },
      {
        label: 'Nitro',
        data: pomeloStats.stats.map((item) => item.nitroCount),
        borderColor: 'rgba(255,99,132,1)',
        fill: false,
      },
      {
        label: 'Non-Nitro',
        data: pomeloStats.stats.map((item) => item.nonNitroCount),
        borderColor: 'rgba(54,162,235,1)',
        fill: false,
      },
    ],
  };

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <h2 className="font-display text-2xl font-semibold lg:text-4xl">
        Pomelo Stats{isOAuth2 ? ' (OAuth2-Only)' : ''}
      </h2>
      <p className="font-body text-xl lg:text-2xl">Protip: You can toggle indvidual lines by clicking on the legend.</p>
      <div className="relative h-[500px] md:h-[600px]">
        <Line
          data={chartData}
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
              y: {title: {display: true, text: 'Pomelos'}},
            },
          }}
        />
      </div>
    </div>
  );
}
