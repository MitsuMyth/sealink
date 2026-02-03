import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import { getRelativeTime } from '@/lib/utils';
import { AlertTriangle, Wifi, Wrench, AlertCircle } from 'lucide-react';
import type { AlertNotification } from '@/types/common';

const alerts: AlertNotification[] = [
  {
    id: 'ALT-001',
    stationId: 'SL-003',
    stationName: 'Byblos Harbor',
    type: 'threshold_breach',
    message: 'Turbidity exceeded 3.0 NTU threshold',
    severity: 'warning',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    acknowledged: false,
  },
  {
    id: 'ALT-002',
    stationId: 'SL-008',
    stationName: 'Tyre South',
    type: 'connectivity_loss',
    message: 'Station offline - no data for 48 hours',
    severity: 'critical',
    timestamp: new Date(Date.now() - 48 * 3600000).toISOString(),
    acknowledged: false,
  },
  {
    id: 'ALT-003',
    stationId: 'SL-006',
    stationName: 'Raouche',
    type: 'maintenance_due',
    message: 'Sensor calibration overdue by 15 days',
    severity: 'warning',
    timestamp: new Date(Date.now() - 12 * 3600000).toISOString(),
    acknowledged: true,
  },
  {
    id: 'ALT-004',
    stationId: 'SL-005',
    stationName: 'Beirut Port',
    type: 'threshold_breach',
    message: 'Dissolved oxygen approaching lower threshold',
    severity: 'warning',
    timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
    acknowledged: false,
  },
  {
    id: 'ALT-005',
    stationId: 'SL-006',
    stationName: 'Raouche',
    type: 'equipment_fault',
    message: 'Solar panel efficiency degraded to 25%',
    severity: 'warning',
    timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
    acknowledged: true,
  },
];

const typeIcons = {
  threshold_breach: AlertTriangle,
  connectivity_loss: Wifi,
  maintenance_due: Wrench,
  equipment_fault: AlertCircle,
};

const severityStyles = {
  normal: 'text-gray-500 bg-gray-50',
  warning: 'text-yellow-600 bg-yellow-50',
  critical: 'text-red-600 bg-red-50',
};

export default function RecentAlerts() {
  return (
    <Card className="overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Recent Alerts</h3>
          <p className="text-xs text-gray-500 mt-0.5">{alerts.filter(a => !a.acknowledged).length} unacknowledged</p>
        </div>
        <span className="text-xs font-medium text-primary-600 hover:text-primary-700 cursor-pointer">View All</span>
      </div>
      <div className="divide-y divide-gray-50">
        {alerts.map((alert, i) => {
          const Icon = typeIcons[alert.type];
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-3 px-5 py-3"
            >
              <div className={`p-1.5 rounded-lg flex-shrink-0 mt-0.5 ${severityStyles[alert.severity]}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{alert.message}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">{alert.stationName}</span>
                  <span className="text-[10px] text-gray-400">{getRelativeTime(alert.timestamp)}</span>
                </div>
              </div>
              {!alert.acknowledged && (
                <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-2" />
              )}
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
