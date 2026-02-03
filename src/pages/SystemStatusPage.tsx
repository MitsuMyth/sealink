import { useMemo } from 'react';
import { motion } from 'framer-motion';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import KPICard from '@/components/ui/KPICard';
import ProgressBar from '@/components/ui/ProgressBar';
import DoughnutChart from '@/components/charts/DoughnutChart';
import ChartContainer from '@/components/charts/ChartContainer';
import { useSystemStatus } from '@/hooks/useSystemStatus';
import { stations } from '@/data/stations';
import { getConditionColor, getRelativeTime, cn } from '@/lib/utils';
import type { KPIMetric } from '@/types/common';
import {
  Cpu, Battery, Wifi, WifiOff, Radio, Sun, Gauge,
  CheckCircle, AlertTriangle, Clock
} from 'lucide-react';

const equipmentTypeIcons: Record<string, React.ReactNode> = {
  sensor: <Cpu className="w-4 h-4" />,
  buoy: <Radio className="w-4 h-4" />,
  transmitter: <Wifi className="w-4 h-4" />,
  solar_panel: <Sun className="w-4 h-4" />,
  battery: <Battery className="w-4 h-4" />,
  camera: <Gauge className="w-4 h-4" />,
};

export default function SystemStatusPage() {
  const { equipment, solar, connectivity, averageBattery, activeConnections, averageUptime } = useSystemStatus();

  const maintenanceDue = useMemo(
    () => equipment.filter(e => new Date(e.nextMaintenance) <= new Date()).length,
    [equipment]
  );

  const summaryMetrics: KPIMetric[] = [
    {
      id: 'uptime',
      label: 'Fleet Uptime',
      value: averageUptime,
      unit: '%',
      change: 0.5,
      changeDirection: 'up',
      status: 'normal',
      icon: 'Activity',
    },
    {
      id: 'battery',
      label: 'Avg Battery',
      value: averageBattery,
      unit: '%',
      change: 2.1,
      changeDirection: 'up',
      status: averageBattery > 60 ? 'normal' : 'warning',
      icon: 'Battery',
    },
    {
      id: 'connections',
      label: 'Active Connections',
      value: `${activeConnections}/${connectivity.length}`,
      unit: '',
      change: 0,
      changeDirection: 'stable',
      status: 'normal',
      icon: 'Wifi',
    },
    {
      id: 'maintenance',
      label: 'Maintenance Due',
      value: maintenanceDue,
      unit: 'items',
      change: maintenanceDue,
      changeDirection: maintenanceDue > 0 ? 'up' : 'stable',
      status: maintenanceDue > 0 ? 'warning' : 'normal',
      icon: 'Wrench',
    },
  ];

  return (
    <PageLayout title="System Status" subtitle="Equipment health, power systems, and network connectivity">
      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryMetrics.map((metric, i) => (
          <KPICard key={metric.id} metric={metric} index={i} />
        ))}
      </div>

      {/* Equipment Health */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Equipment Health</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipment.map((eq, i) => {
            const station = stations.find(s => s.id === eq.stationId);
            return (
              <motion.div
                key={eq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card hover className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">{equipmentTypeIcons[eq.type]}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{eq.name}</p>
                        <p className="text-xs text-gray-500">{station?.name}</p>
                      </div>
                    </div>
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium capitalize', getConditionColor(eq.condition))}>
                      {eq.condition}
                    </span>
                  </div>
                  <ProgressBar value={eq.uptime} label="Uptime" />
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                    <span>FW: {eq.firmware}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Next: {new Date(eq.nextMaintenance).toLocaleDateString()}
                    </span>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Solar Power & Connectivity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Solar Power */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Solar Power</h2>
          <div className="space-y-4">
            {solar.map((sp, i) => {
              const station = stations.find(s => s.id === sp.stationId);
              const statusColor = sp.status === 'full' || sp.status === 'charging' ? 'text-green-600' : 'text-yellow-600';
              return (
                <motion.div
                  key={sp.stationId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-900">{station?.name}</span>
                      </div>
                      <span className={cn('text-xs font-medium capitalize', statusColor)}>
                        {sp.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Output</p>
                        <p className="text-sm font-semibold">{sp.currentOutput}W <span className="text-xs font-normal text-gray-400">/ {sp.maxCapacity}W</span></p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Daily Gen</p>
                        <p className="text-sm font-semibold">{sp.dailyGeneration}Wh</p>
                      </div>
                    </div>
                    <ProgressBar value={sp.batteryLevel} label="Battery" />
                    <div className="mt-2">
                      <ProgressBar value={sp.panelEfficiency} label="Panel Efficiency" color="secondary" />
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Connectivity */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Network Connectivity</h2>
          <div className="space-y-4">
            {connectivity.map((conn, i) => {
              const station = stations.find(s => s.id === conn.stationId);
              const isConnected = conn.status === 'connected';
              const isDisconnected = conn.status === 'disconnected';

              return (
                <motion.div
                  key={conn.stationId}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {isDisconnected ? (
                          <WifiOff className="w-4 h-4 text-red-500" />
                        ) : (
                          <Wifi className="w-4 h-4 text-green-500" />
                        )}
                        <span className="text-sm font-medium text-gray-900">{station?.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-700">
                          {conn.type}
                        </span>
                        <span className={cn(
                          'flex items-center gap-1 text-xs font-medium',
                          isConnected ? 'text-green-600' : isDisconnected ? 'text-red-600' : 'text-yellow-600'
                        )}>
                          {isConnected ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          {conn.status}
                        </span>
                      </div>
                    </div>
                    <ProgressBar value={conn.signalStrength} label="Signal Strength" />
                    <div className="grid grid-cols-3 gap-3 mt-3 text-xs">
                      <div>
                        <span className="text-gray-500">Latency</span>
                        <p className="font-medium text-gray-900">{conn.latency}ms</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Data Today</span>
                        <p className="font-medium text-gray-900">{conn.dataTransferred}MB</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Last Sync</span>
                        <p className="font-medium text-gray-900">{getRelativeTime(conn.lastSync)}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Connectivity Distribution Chart */}
          <div className="mt-6">
            <ChartContainer title="Connection Types" height="h-56">
              <DoughnutChart
                labels={['4G', 'LoRa', 'Satellite']}
                data={[
                  connectivity.filter(c => c.type === '4G').length,
                  connectivity.filter(c => c.type === 'LoRa').length,
                  connectivity.filter(c => c.type === 'Satellite').length,
                ]}
                colors={['#1e40af', '#0891b2', '#8b5cf6']}
                centerLabel="Stations"
                centerValue={connectivity.length.toString()}
              />
            </ChartContainer>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
