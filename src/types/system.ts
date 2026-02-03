export type EquipmentCondition = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';

export interface Equipment {
  id: string;
  name: string;
  type: 'sensor' | 'buoy' | 'transmitter' | 'solar_panel' | 'battery' | 'camera';
  stationId: string;
  condition: EquipmentCondition;
  lastMaintenance: string;
  nextMaintenance: string;
  uptime: number;
  firmware: string;
}

export interface SolarPowerStatus {
  stationId: string;
  currentOutput: number;
  maxCapacity: number;
  batteryLevel: number;
  dailyGeneration: number;
  panelEfficiency: number;
  status: 'charging' | 'discharging' | 'full' | 'low';
}

export interface ConnectivityStatus {
  stationId: string;
  type: '4G' | 'LoRa' | 'Satellite';
  signalStrength: number;
  latency: number;
  lastSync: string;
  dataTransferred: number;
  status: 'connected' | 'intermittent' | 'disconnected';
}
