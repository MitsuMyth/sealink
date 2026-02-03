import { motion } from 'framer-motion';
import KPICard from '@/components/ui/KPICard';
import { useStations } from '@/hooks/useStations';
import { useSystemStatus } from '@/hooks/useSystemStatus';
import type { KPIMetric } from '@/types/common';

export default function KPIGrid() {
  const { onlineCount, totalCount } = useStations();
  const { averageBattery, activeConnections, averageUptime } = useSystemStatus();

  const metrics: KPIMetric[] = [
    {
      id: 'active-stations',
      label: 'Active Stations',
      value: `${onlineCount}/${totalCount}`,
      unit: '',
      change: 0,
      changeDirection: 'stable',
      status: 'normal',
      icon: 'Radio',
      sparklineData: [5, 6, 6, 5, 6, 6, 6],
    },
    {
      id: 'water-quality',
      label: 'Water Quality Index',
      value: 87,
      unit: '/100',
      change: 2.3,
      changeDirection: 'up',
      status: 'normal',
      icon: 'Droplets',
      sparklineData: [82, 84, 83, 85, 86, 87, 87],
    },
    {
      id: 'alerts',
      label: 'Active Alerts',
      value: 3,
      unit: '',
      change: 1,
      changeDirection: 'up',
      status: 'warning',
      icon: 'AlertTriangle',
      sparklineData: [1, 2, 1, 2, 3, 2, 3],
    },
    {
      id: 'data-points',
      label: 'Data Points (24h)',
      value: 13456,
      unit: '',
      change: 5.2,
      changeDirection: 'up',
      status: 'normal',
      icon: 'Database',
      sparklineData: [12100, 12800, 13000, 12900, 13200, 13400, 13456],
    },
    {
      id: 'solar',
      label: 'Avg Battery Level',
      value: averageBattery,
      unit: '%',
      change: 3.1,
      changeDirection: 'up',
      status: averageBattery > 60 ? 'normal' : 'warning',
      icon: 'Battery',
      sparklineData: [68, 70, 72, 71, 73, 74, averageBattery],
    },
    {
      id: 'uptime',
      label: 'Fleet Uptime',
      value: averageUptime,
      unit: '%',
      change: 0.5,
      changeDirection: 'up',
      status: 'normal',
      icon: 'Activity',
      sparklineData: [94, 95, 94.5, 95.2, 95.8, 96, averageUptime],
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
      }}
    >
      {metrics.map((metric, i) => (
        <KPICard key={metric.id} metric={metric} index={i} />
      ))}
    </motion.div>
  );
}
