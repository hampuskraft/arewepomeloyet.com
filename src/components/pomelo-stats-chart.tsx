'use client';

import {PomeloStats} from '@/common/database';

import {
  CategoryScale,
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

export default function PomeloStatsChart({data}: {data: PomeloStats[]}) {
  const chartData = {
    labels: data.map((item) => item.date),
    datasets: [
      {
        label: 'Total Count',
        data: data.map((item) => item.totalCount),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
      {
        label: 'Nitro Count',
        data: data.map((item) => item.nitroCount),
        borderColor: 'rgba(255,99,132,1)',
        fill: false,
      },
      {
        label: 'Early Supporter Count',
        data: data.map((item) => item.earlySupporterCount),
        borderColor: 'rgba(255,205,86,1)',
        fill: false,
      },
      {
        label: 'Non-Nitro Count',
        data: data.map((item) => item.nonNitroCount),
        borderColor: 'rgba(54,162,235,1)',
        fill: false,
      },
    ],
  };

  return (
    <div>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top' as const,
            },
            title: {
              display: true,
              text: 'Pomelo Stats Over Time',
            },
          },
          scales: {
            x: {title: {display: true, text: 'Date'}},
            y: {title: {display: true, text: 'Count'}},
          },
        }}
      />
    </div>
  );
}
