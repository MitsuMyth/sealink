import { Bar } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';

interface BarChartProps {
  labels: string[];
  data: number[];
  label: string;
  colors?: string[];
  yAxisLabel?: string;
}

export default function BarChart({ labels, data, label, colors, yAxisLabel }: BarChartProps) {
  const defaultColors = labels.map((_, i) => {
    const palette = ['#1e40af', '#0891b2', '#8b5cf6', '#059669', '#d97706', '#dc2626', '#2563eb', '#7c3aed'];
    return palette[i % palette.length];
  });

  const chartData = {
    labels,
    datasets: [
      {
        label,
        data,
        backgroundColor: colors || defaultColors.map(c => `${c}cc`),
        borderColor: colors || defaultColors,
        borderWidth: 1,
        borderRadius: 6,
        maxBarThickness: 48,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } },
      },
      y: {
        grid: { color: '#f3f4f6' },
        ticks: { font: { size: 11 } },
        title: yAxisLabel ? { display: true, text: yAxisLabel, font: { size: 11 } } : undefined,
      },
    },
    plugins: {
      legend: { display: false },
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

  return <Bar data={chartData} options={options} />;
}
