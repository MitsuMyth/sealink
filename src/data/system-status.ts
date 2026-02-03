import type { Equipment, SolarPowerStatus, ConnectivityStatus } from '@/types/system';

export const equipment: Equipment[] = [
  // SL-001 Tripoli
  { id: 'EQ-001A', name: 'Multi-Parameter Sensor', type: 'sensor', stationId: 'SL-001', condition: 'excellent', lastMaintenance: '2024-12-15', nextMaintenance: '2025-03-15', uptime: 99.8, firmware: 'v3.2.1' },
  { id: 'EQ-001B', name: 'Monitoring Buoy', type: 'buoy', stationId: 'SL-001', condition: 'good', lastMaintenance: '2024-11-20', nextMaintenance: '2025-02-20', uptime: 99.5, firmware: 'v2.1.0' },
  { id: 'EQ-001C', name: '4G Transmitter', type: 'transmitter', stationId: 'SL-001', condition: 'excellent', lastMaintenance: '2024-12-01', nextMaintenance: '2025-06-01', uptime: 99.9, firmware: 'v4.0.3' },
  { id: 'EQ-001D', name: 'Solar Panel Array', type: 'solar_panel', stationId: 'SL-001', condition: 'good', lastMaintenance: '2024-10-15', nextMaintenance: '2025-04-15', uptime: 100, firmware: 'N/A' },
  // SL-002 Batroun
  { id: 'EQ-002A', name: 'Multi-Parameter Sensor', type: 'sensor', stationId: 'SL-002', condition: 'excellent', lastMaintenance: '2025-01-05', nextMaintenance: '2025-04-05', uptime: 99.9, firmware: 'v3.2.1' },
  { id: 'EQ-002B', name: 'Monitoring Buoy', type: 'buoy', stationId: 'SL-002', condition: 'excellent', lastMaintenance: '2024-12-10', nextMaintenance: '2025-03-10', uptime: 99.7, firmware: 'v2.1.0' },
  { id: 'EQ-002C', name: 'LoRa Transmitter', type: 'transmitter', stationId: 'SL-002', condition: 'good', lastMaintenance: '2024-11-15', nextMaintenance: '2025-05-15', uptime: 98.5, firmware: 'v1.8.2' },
  // SL-003 Byblos (warning)
  { id: 'EQ-003A', name: 'Multi-Parameter Sensor', type: 'sensor', stationId: 'SL-003', condition: 'fair', lastMaintenance: '2024-09-20', nextMaintenance: '2025-01-20', uptime: 94.2, firmware: 'v3.1.0' },
  { id: 'EQ-003B', name: 'Monitoring Buoy', type: 'buoy', stationId: 'SL-003', condition: 'good', lastMaintenance: '2024-10-05', nextMaintenance: '2025-01-05', uptime: 97.8, firmware: 'v2.0.5' },
  { id: 'EQ-003C', name: 'Underwater Camera', type: 'camera', stationId: 'SL-003', condition: 'fair', lastMaintenance: '2024-08-30', nextMaintenance: '2025-02-28', uptime: 89.3, firmware: 'v1.4.0' },
  // SL-004 Jounieh
  { id: 'EQ-004A', name: 'Multi-Parameter Sensor', type: 'sensor', stationId: 'SL-004', condition: 'excellent', lastMaintenance: '2025-01-10', nextMaintenance: '2025-04-10', uptime: 99.9, firmware: 'v3.2.1' },
  { id: 'EQ-004B', name: 'Battery Pack', type: 'battery', stationId: 'SL-004', condition: 'good', lastMaintenance: '2024-11-01', nextMaintenance: '2025-05-01', uptime: 100, firmware: 'N/A' },
  // SL-005 Beirut
  { id: 'EQ-005A', name: 'Multi-Parameter Sensor', type: 'sensor', stationId: 'SL-005', condition: 'good', lastMaintenance: '2024-12-20', nextMaintenance: '2025-03-20', uptime: 98.5, firmware: 'v3.2.1' },
  { id: 'EQ-005B', name: 'Monitoring Buoy', type: 'buoy', stationId: 'SL-005', condition: 'good', lastMaintenance: '2024-11-25', nextMaintenance: '2025-02-25', uptime: 99.0, firmware: 'v2.1.0' },
  { id: 'EQ-005C', name: '4G Transmitter', type: 'transmitter', stationId: 'SL-005', condition: 'excellent', lastMaintenance: '2025-01-02', nextMaintenance: '2025-07-02', uptime: 99.8, firmware: 'v4.0.3' },
  // SL-006 Raouche (maintenance)
  { id: 'EQ-006A', name: 'Multi-Parameter Sensor', type: 'sensor', stationId: 'SL-006', condition: 'fair', lastMaintenance: '2024-08-15', nextMaintenance: '2025-01-15', uptime: 85.0, firmware: 'v3.0.2' },
  { id: 'EQ-006B', name: 'Solar Panel Array', type: 'solar_panel', stationId: 'SL-006', condition: 'poor', lastMaintenance: '2024-07-01', nextMaintenance: '2025-01-01', uptime: 78.5, firmware: 'N/A' },
  // SL-007 Sidon
  { id: 'EQ-007A', name: 'Multi-Parameter Sensor', type: 'sensor', stationId: 'SL-007', condition: 'excellent', lastMaintenance: '2025-01-08', nextMaintenance: '2025-04-08', uptime: 99.6, firmware: 'v3.2.1' },
  { id: 'EQ-007B', name: 'Satellite Transmitter', type: 'transmitter', stationId: 'SL-007', condition: 'good', lastMaintenance: '2024-12-05', nextMaintenance: '2025-06-05', uptime: 97.2, firmware: 'v2.3.0' },
  // SL-008 Tyre (offline)
  { id: 'EQ-008A', name: 'Multi-Parameter Sensor', type: 'sensor', stationId: 'SL-008', condition: 'critical', lastMaintenance: '2024-07-10', nextMaintenance: '2025-01-10', uptime: 45.0, firmware: 'v3.0.0' },
  { id: 'EQ-008B', name: '4G Transmitter', type: 'transmitter', stationId: 'SL-008', condition: 'critical', lastMaintenance: '2024-08-01', nextMaintenance: '2025-02-01', uptime: 0, firmware: 'v3.5.1' },
];

export const solarPower: SolarPowerStatus[] = [
  { stationId: 'SL-001', currentOutput: 42, maxCapacity: 60, batteryLevel: 92, dailyGeneration: 380, panelEfficiency: 88, status: 'charging' },
  { stationId: 'SL-002', currentOutput: 38, maxCapacity: 60, batteryLevel: 85, dailyGeneration: 350, panelEfficiency: 85, status: 'charging' },
  { stationId: 'SL-003', currentOutput: 35, maxCapacity: 60, batteryLevel: 72, dailyGeneration: 310, panelEfficiency: 78, status: 'charging' },
  { stationId: 'SL-004', currentOutput: 55, maxCapacity: 60, batteryLevel: 98, dailyGeneration: 420, panelEfficiency: 92, status: 'full' },
  { stationId: 'SL-005', currentOutput: 40, maxCapacity: 60, batteryLevel: 88, dailyGeneration: 365, panelEfficiency: 86, status: 'charging' },
  { stationId: 'SL-006', currentOutput: 0, maxCapacity: 60, batteryLevel: 34, dailyGeneration: 45, panelEfficiency: 25, status: 'low' },
  { stationId: 'SL-007', currentOutput: 48, maxCapacity: 60, batteryLevel: 95, dailyGeneration: 400, panelEfficiency: 90, status: 'charging' },
  { stationId: 'SL-008', currentOutput: 0, maxCapacity: 60, batteryLevel: 8, dailyGeneration: 0, panelEfficiency: 0, status: 'low' },
];

export const connectivity: ConnectivityStatus[] = [
  { stationId: 'SL-001', type: '4G', signalStrength: 92, latency: 45, lastSync: new Date(Date.now() - 2 * 60000).toISOString(), dataTransferred: 156, status: 'connected' },
  { stationId: 'SL-002', type: 'LoRa', signalStrength: 78, latency: 120, lastSync: new Date(Date.now() - 5 * 60000).toISOString(), dataTransferred: 42, status: 'connected' },
  { stationId: 'SL-003', type: '4G', signalStrength: 65, latency: 85, lastSync: new Date(Date.now() - 8 * 60000).toISOString(), dataTransferred: 128, status: 'intermittent' },
  { stationId: 'SL-004', type: '4G', signalStrength: 95, latency: 32, lastSync: new Date(Date.now() - 1 * 60000).toISOString(), dataTransferred: 198, status: 'connected' },
  { stationId: 'SL-005', type: '4G', signalStrength: 88, latency: 52, lastSync: new Date(Date.now() - 2 * 60000).toISOString(), dataTransferred: 210, status: 'connected' },
  { stationId: 'SL-006', type: 'Satellite', signalStrength: 45, latency: 650, lastSync: new Date(Date.now() - 4 * 3600000).toISOString(), dataTransferred: 12, status: 'intermittent' },
  { stationId: 'SL-007', type: 'Satellite', signalStrength: 82, latency: 380, lastSync: new Date(Date.now() - 3 * 60000).toISOString(), dataTransferred: 85, status: 'connected' },
  { stationId: 'SL-008', type: '4G', signalStrength: 0, latency: 0, lastSync: new Date(Date.now() - 48 * 3600000).toISOString(), dataTransferred: 0, status: 'disconnected' },
];
