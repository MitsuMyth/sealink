import { Doughnut } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';

interface DoughnutChartProps {
  labels: string[];
  data: number[];
  colors?: string[];
  centerLabel?: string;
  centerValue?: string;
}

export default function DoughnutChart({ labels, data, colors, centerLabel, centerValue }: DoughnutChartProps) {
  const defaultColors = ['#22c55e', '#eab308', '#ef4444', '#9ca3af', '#3b82f6', '#8b5cf6'];

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors || defaultColors.slice(0, labels.length),
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, pointStyle: 'circle', padding: 16, font: { size: 11 } },
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#111827',
        bodyColor: '#6b7280',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 10,
      },
    },
  };

  return (
    <div className="relative">
      <Doughnut data={chartData} options={options} />
      {centerLabel && centerValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ marginBottom: '32px' }}>
          <span className="text-2xl font-bold text-gray-900">{centerValue}</span>
          <span className="text-xs text-gray-500">{centerLabel}</span>
        </div>
      )}
    </div>
  );
}
