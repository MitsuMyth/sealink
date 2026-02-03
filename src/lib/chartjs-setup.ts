import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

ChartJS.defaults.font.family = 'Inter, system-ui, sans-serif';
ChartJS.defaults.color = '#6b7280';
ChartJS.defaults.responsive = true;
ChartJS.defaults.maintainAspectRatio = false;

export const CHART_COLORS = {
  primary: '#1e40af',
  secondary: '#0891b2',
  accent: '#8b5cf6',
  success: '#22c55e',
  warning: '#eab308',
  danger: '#ef4444',
  gray: '#9ca3af',
  primaryLight: 'rgba(30, 64, 175, 0.1)',
  secondaryLight: 'rgba(8, 145, 178, 0.1)',
};

export const STATION_COLORS = [
  '#1e40af',
  '#0891b2',
  '#8b5cf6',
  '#059669',
  '#d97706',
  '#dc2626',
  '#2563eb',
  '#7c3aed',
];
