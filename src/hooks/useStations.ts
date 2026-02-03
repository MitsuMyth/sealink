import { useMemo } from 'react';
import { stations } from '@/data/stations';

export function useStations() {
  const onlineCount = useMemo(() => stations.filter(s => s.status === 'online').length, []);
  const warningCount = useMemo(() => stations.filter(s => s.status === 'warning').length, []);
  const offlineCount = useMemo(() => stations.filter(s => s.status === 'offline').length, []);
  const maintenanceCount = useMemo(() => stations.filter(s => s.status === 'maintenance').length, []);

  return {
    stations,
    onlineCount,
    warningCount,
    offlineCount,
    maintenanceCount,
    totalCount: stations.length,
  };
}
