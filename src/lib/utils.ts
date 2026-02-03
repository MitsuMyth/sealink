import { clsx, type ClassValue } from 'clsx';
import type { StationStatus } from '@/types/station';
import type { EquipmentCondition } from '@/types/system';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getStatusColor(status: StationStatus): string {
  const map: Record<StationStatus, string> = {
    online: '#22c55e',
    warning: '#eab308',
    offline: '#ef4444',
    maintenance: '#9ca3af',
  };
  return map[status];
}

export function getStatusBgClass(status: StationStatus): string {
  const map: Record<StationStatus, string> = {
    online: 'bg-status-online',
    warning: 'bg-status-warning',
    offline: 'bg-status-offline',
    maintenance: 'bg-status-maintenance',
  };
  return map[status];
}

export function getStatusTextClass(status: StationStatus): string {
  const map: Record<StationStatus, string> = {
    online: 'text-green-700 bg-green-50 border-green-200',
    warning: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    offline: 'text-red-700 bg-red-50 border-red-200',
    maintenance: 'text-gray-700 bg-gray-50 border-gray-200',
  };
  return map[status];
}

export function getConditionColor(condition: EquipmentCondition): string {
  const map: Record<EquipmentCondition, string> = {
    excellent: 'text-green-700 bg-green-50',
    good: 'text-blue-700 bg-blue-50',
    fair: 'text-yellow-700 bg-yellow-50',
    poor: 'text-orange-700 bg-orange-50',
    critical: 'text-red-700 bg-red-50',
  };
  return map[condition];
}

export function getRelativeTime(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diff = now - then;

  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(isoString).toLocaleDateString();
}

export function formatNumber(value: number, decimals: number = 1): string {
  return value.toFixed(decimals);
}

export function formatLargeNumber(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
}
