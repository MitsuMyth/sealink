import { useMemo } from 'react';
import { equipment, solarPower, connectivity } from '@/data/system-status';

export function useSystemStatus(stationId?: string) {
  const filteredEquipment = useMemo(
    () => stationId ? equipment.filter(e => e.stationId === stationId) : equipment,
    [stationId]
  );

  const filteredSolar = useMemo(
    () => stationId ? solarPower.filter(s => s.stationId === stationId) : solarPower,
    [stationId]
  );

  const filteredConnectivity = useMemo(
    () => stationId ? connectivity.filter(c => c.stationId === stationId) : connectivity,
    [stationId]
  );

  const averageBattery = useMemo(
    () => Math.round(solarPower.reduce((sum, s) => sum + s.batteryLevel, 0) / solarPower.length),
    []
  );

  const activeConnections = useMemo(
    () => connectivity.filter(c => c.status === 'connected').length,
    []
  );

  const averageUptime = useMemo(
    () => Math.round(equipment.reduce((sum, e) => sum + e.uptime, 0) / equipment.length * 10) / 10,
    []
  );

  return {
    equipment: filteredEquipment,
    solar: filteredSolar,
    connectivity: filteredConnectivity,
    averageBattery,
    activeConnections,
    averageUptime,
  };
}
