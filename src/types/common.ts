export type StatusLevel = 'normal' | 'warning' | 'critical';

export interface DateRange {
  start: string;
  end: string;
}

export interface KPIMetric {
  id: string;
  label: string;
  value: number | string;
  unit: string;
  change: number;
  changeDirection: 'up' | 'down' | 'stable';
  status: StatusLevel;
  icon: string;
  sparklineData?: number[];
}

export interface AlertNotification {
  id: string;
  stationId: string;
  stationName: string;
  type: 'threshold_breach' | 'equipment_fault' | 'connectivity_loss' | 'maintenance_due';
  message: string;
  severity: StatusLevel;
  timestamp: string;
  acknowledged: boolean;
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}
