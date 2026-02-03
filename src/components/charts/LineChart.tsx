import { Line } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';

interface LineChartDataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
}

interface LineChartProps {
  labels: string[];
  datasets: LineChartDataset[];
  yAxisLabel?: string;
}

export default function LineChart({ labels, datasets, yAxisLabel }: LineChartProps) {
  const colors = ['#1e40af', '#0891b2', '#8b5cf6', '#059669', '#d97706', '#dc2626', '#2563eb', '#7c3aed'];

  const data = {
    labels,
    datasets: datasets.map((ds, i) => ({
      label: ds.label,
      data: ds.data,
      borderColor: ds.borderColor || colors[i % colors.length],
      backgroundColor: ds.backgroundColor || `${colors[i % colors.length]}15`,
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 4,
      tension: 0.3,
      fill: datasets.length === 1,
    })),
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { maxTicksLimit: 8, font: { size: 11 } },
      },
      y: {
        grid: { color: '#f3f4f6' },
        ticks: { font: { size: 11 } },
        title: yAxisLabel ? { display: true, text: yAxisLabel, font: { size: 11 } } : undefined,
      },
    },
    plugins: {
      legend: {
        display: datasets.length > 1,
        position: 'top',
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

  return <Line data={data} options={options} />;
}
